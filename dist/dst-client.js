/**
 * Statistics Denmark (Danmarks Statistik) StatBank API Client
 * Base URL: https://api.statbank.dk/v1
 *
 * Endpoints:
 *  - /subjects   : Hierarchical subject browser
 *  - /tables     : List tables (optionally filtered by subject)
 *  - /tableinfo  : Metadata for a specific table (variables, values)
 *  - /data       : Fetch actual data from a table
 */
const BASE_URL = "https://api.statbank.dk/v1";
const LANG = "en";
async function post(endpoint, body) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, lang: LANG, format: "JSON" }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`DST API error ${response.status}: ${text}`);
    }
    return response.json();
}
/**
 * List top-level subjects (or children of a given subject ID).
 */
export async function getSubjects(subjectId) {
    const body = { recursive: false, omitSubjectsWithoutTables: true };
    if (subjectId)
        body.subjects = [subjectId];
    return post("/subjects", body);
}
/**
 * List all tables, optionally filtered by subject ID.
 */
export async function getTables(subjectId) {
    const body = { includeInactive: false };
    if (subjectId)
        body.subjects = [subjectId];
    return post("/tables", body);
}
/**
 * Search tables by keyword (client-side filter on text/id/variables).
 */
export async function searchTables(keyword) {
    const all = await getTables();
    const kw = keyword.toLowerCase();
    return all.filter((t) => t.text.toLowerCase().includes(kw) ||
        t.id.toLowerCase().includes(kw) ||
        t.variables.some((v) => v.toLowerCase().includes(kw)));
}
/**
 * Get metadata (variables and their allowed values) for a table.
 */
export async function getTableInfo(tableId) {
    return post("/tableinfo", { table: tableId });
}
/**
 * Fetch data from a table.
 * variables: map of variable code  array of value codes (use ["*"] for all values).
 */
export async function getData(tableId, variables) {
    const variableList = Object.entries(variables).map(([code, values]) => ({
        code,
        values,
    }));
    const body = {
        table: tableId,
        format: "JSONSTAT",
        variables: variableList,
    };
    const raw = await post("/data", body);
    return parseJsonStat(raw);
}
function parseJsonStat(raw) {
    // Implementation omitted for brevity
    return [];
}
//# sourceMappingURL=dst-client.js.map