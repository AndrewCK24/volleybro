import { defineMiddleware } from "astro:middleware";

const MCP_PATH = "/_emdash/api/mcp";
const CHANGE_COLLECTION = "blueprint_changes";
const WRITE_TOOLS = new Set(["content_create", "content_update"]);

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  if (url.pathname !== MCP_PATH || request.method !== "POST") return next();

  let payload: unknown;
  try {
    payload = await request.clone().json();
  } catch {
    return next();
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return next();
  const rpcRequest = payload as {
    jsonrpc?: unknown;
    id?: unknown;
    method?: unknown;
    params?: {
      name?: unknown;
      arguments?: {
        collection?: unknown;
        data?: Record<string, unknown>;
      };
    };
  };
  if (
    rpcRequest.jsonrpc !== "2.0" ||
    rpcRequest.method !== "tools/call" ||
    typeof rpcRequest.params?.name !== "string" ||
    !WRITE_TOOLS.has(rpcRequest.params.name) ||
    rpcRequest.params.arguments?.collection !== CHANGE_COLLECTION
  ) {
    return next();
  }

  const data = rpcRequest.params.arguments.data;
  if (!data || !Object.hasOwn(data, "blocks") || Array.isArray(data.blocks))
    return next();

  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id: rpcRequest.id ?? null,
      error: {
        code: -32602,
        message:
          "Blueprint Change blocks must be provided as a Portable Text array; Markdown strings are not supported.",
      },
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
  );
});
