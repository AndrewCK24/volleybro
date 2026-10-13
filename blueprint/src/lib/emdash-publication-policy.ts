import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";
import { z } from "astro/zod";
import { acceptedContentHash, changeDataSchema } from "./emdash-change-record";
import {
  legacyImportReceiptProblem,
  publicationReceiptProblem,
} from "./publication-receipt";
import { reserveBlueprintMediaUpload } from "./media-upload-budget";

const PLUGIN_ID = "volleybro-blueprint-publication-policy";
const PLUGIN_VERSION = "1.0.0";

export function emdashPublicationPolicy(entrypoint: string): PluginDescriptor {
  return {
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    format: "native",
    entrypoint,
  };
}

export function createPlugin() {
  return definePlugin({
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    capabilities: [
      "hooks.content-policy:register",
      "network:request",
      "media:read",
      "media:write",
    ],
    allowedHosts: ["api.linear.app"],
    admin: {
      settingsSchema: {
        linearApiKey: {
          type: "secret",
          label: "Linear API key",
          description:
            "Used only to verify the accepted EmDash revision before publish.",
        },
        legacyMigrationIssueKey: {
          type: "string",
          label: "Legacy migration issue key",
          description:
            "Linear issue containing the verified receipts for imported legacy Change entries.",
        },
      },
    },
    storage: {
      mediaBudget: {
        indexes: ["month", "reservedBytes", "uploadRequests"],
      },
    },
    hooks: {
      "media:beforeUpload": async (event, context) => {
        if (!context.media)
          throw new Error("Media access is unavailable; uploads are blocked.");
        await reserveBlueprintMediaUpload(
          { size: event.file.size },
          {
            store: context.storage.mediaBudget,
            list: async (cursor) => {
              const page = await context.media!.list({ limit: 100, cursor });
              return {
                items: page.items.map(({ size }) => ({ size })),
                cursor: page.cursor,
                hasMore: page.hasMore,
              };
            },
          },
        );
        return event.file;
      },
      "content:beforePublish": async (event, context) => {
        if (event.collection !== "blueprint_changes") return;

        const parsed = changeDataSchema.safeParse(event.content.data);
        if (!parsed.success) {
          return {
            cancel: true,
            reason:
              "Change content does not match the published EmDash schema.",
          };
        }

        const revision =
          typeof event.content.draftRevisionId === "string"
            ? event.content.draftRevisionId
            : "";
        if (!revision) {
          return {
            cancel: true,
            reason: "Publish requires an exact saved draft revision.",
          };
        }

        const apiKey = await context.settings.get<string>("linearApiKey");
        if (typeof apiKey !== "string" || !apiKey.trim() || !context.http) {
          return {
            cancel: true,
            reason:
              "Linear verification is not configured; publishing is blocked.",
          };
        }
        const linearApiKey = apiKey;

        async function readIssueDescription(
          id: string,
        ): Promise<string | undefined> {
          const response = await context.http!.fetch(
            "https://api.linear.app/graphql",
            {
              method: "POST",
              headers: {
                Authorization: linearApiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: "query($id: String!) { issue(id: $id) { description } }",
                variables: { id },
              }),
            },
          );
          if (!response.ok) return undefined;
          const payload = z
            .object({
              data: z.object({
                issue: z
                  .object({ description: z.string().nullable() })
                  .nullable(),
              }),
            })
            .safeParse(await response.json());
          return payload.success
            ? (payload.data.data.issue?.description ?? "")
            : undefined;
        }

        try {
          const acceptedContent = {
            title: parsed.data.title,
            description: parsed.data.description,
            linear_issue: parsed.data.linear_issue,
            blocks: parsed.data.blocks,
          };
          const contentHash = await acceptedContentHash(acceptedContent);
          const slug =
            typeof event.content.slug === "string" ? event.content.slug : "";
          const hasLegacyHtml = parsed.data.blocks.some(
            (block) => block._type === "legacy_html",
          );
          let policyProblem: string | undefined;
          if (hasLegacyHtml) {
            const migrationIssueKey = await context.settings.get<string>(
              "legacyMigrationIssueKey",
            );
            if (
              typeof migrationIssueKey !== "string" ||
              !/^[A-Z][A-Z0-9]*-[1-9]\d*$/u.test(migrationIssueKey)
            ) {
              return {
                cancel: true,
                reason:
                  "Legacy migration issue key is not configured; publishing is blocked.",
              };
            }
            const migrationIssueDescription =
              await readIssueDescription(migrationIssueKey);
            if (migrationIssueDescription === undefined) {
              return {
                cancel: true,
                reason:
                  "Linear could not verify the legacy migration; publishing is blocked.",
              };
            }
            policyProblem = legacyImportReceiptProblem({
              migrationIssueDescription,
              actualContentHash: contentHash,
              slug,
              hasLegacyHtml: true,
            });
          } else {
            const issueDescription = await readIssueDescription(
              parsed.data.linear_issue!,
            );
            if (issueDescription === undefined) {
              return {
                cancel: true,
                reason:
                  "Linear could not verify the accepted revision; publishing is blocked.",
              };
            }
            policyProblem = publicationReceiptProblem({
              issueDescription,
              draftRevisionId: revision,
              liveRevisionId:
                typeof event.content.liveRevisionId === "string"
                  ? event.content.liveRevisionId
                  : null,
              actualContentHash: contentHash,
            });
          }
          if (policyProblem) return { cancel: true, reason: policyProblem };
        } catch (error) {
          context.log.warn("Linear G1 publication verification failed", {
            message: error instanceof Error ? error.message : String(error),
          });
          return {
            cancel: true,
            reason: "Linear verification failed; publishing is blocked.",
          };
        }
      },
    },
  });
}
