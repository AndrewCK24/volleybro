const READ_BUDGET = 10_000;
const API_ROOT = "https://api.cloudflare.com/client/v4/accounts";

function requiredCredential(value, name) {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`Cloudflare snapshot ${name} is not configured.`);
  return value;
}

function invalidResponse() {
  return new Error("Cloudflare snapshot query returned an invalid response.");
}

/**
 * @param {{ accountId: string, databaseId: string, token: string }} options
 */
export function createD1SnapshotReader({ accountId, databaseId, token }) {
  const account = requiredCredential(accountId, "account");
  const database = requiredCredential(databaseId, "database");
  const apiToken = requiredCredential(token, "API token");
  const endpoint = `${API_ROOT}/${encodeURIComponent(account)}/d1/database/${encodeURIComponent(database)}/query`;
  let rowsRead = 0;
  let unusable = false;

  return {
    get rowsRead() {
      return rowsRead;
    },

    async query(sql, params) {
      if (unusable)
        throw new Error("Cloudflare snapshot reader is no longer available.");
      if (
        typeof sql !== "string" ||
        !/^\s*SELECT\b/iu.test(sql) ||
        sql.includes(";")
      ) {
        unusable = true;
        throw new Error(
          "Cloudflare snapshot reader accepts one SELECT statement only.",
        );
      }
      if (!Array.isArray(params)) {
        unusable = true;
        throw new Error("Cloudflare snapshot query parameters are invalid.");
      }
      if (rowsRead >= READ_BUDGET) {
        unusable = true;
        throw new Error("The Change snapshot exceeded its D1 read budget.");
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, params }),
          redirect: "error",
        });
        if (!response.ok)
          throw new Error(
            `Cloudflare snapshot request failed (${response.status}).`,
          );

        const payload = await response.json();
        const page = payload?.result?.[0];
        if (
          payload?.success !== true ||
          !Array.isArray(payload.result) ||
          payload.result.length !== 1 ||
          page?.success !== true ||
          !Array.isArray(page.results) ||
          !page.meta ||
          typeof page.meta.rows_read !== "number" ||
          !Number.isSafeInteger(page.meta.rows_read) ||
          page.meta.rows_read < 0
        ) {
          throw invalidResponse();
        }

        const totalRowsRead = rowsRead + page.meta.rows_read;
        if (!Number.isSafeInteger(totalRowsRead)) throw invalidResponse();
        rowsRead = totalRowsRead;
        if (rowsRead > READ_BUDGET) {
          unusable = true;
          throw new Error("The Change snapshot exceeded its D1 read budget.");
        }
        if (rowsRead === READ_BUDGET) unusable = true;
        return page.results;
      } catch (error) {
        unusable = true;
        if (
          error instanceof Error &&
          error.message.startsWith("The Change snapshot")
        )
          throw error;
        if (
          error instanceof Error &&
          error.message.startsWith("Cloudflare snapshot")
        )
          throw error;
        throw new Error("Cloudflare snapshot query failed.");
      }
    },
  };
}
