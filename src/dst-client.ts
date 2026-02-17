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

export interface DstSubject {
  id: string;
  description: string;
  hasSubjects: boolean;
  subjects?: DstSubject[];
}

export interface DstTable {
  id: string;
  text: string;
  unit: string;
  updated: string;
  firstPeriod: string;
  latestPeriod: string;
  active: boolean;
  variables: string[];
}

export interface DstVariableValue {
  id: string;
  text: string;
}

export interface DstVariable {
  id: string;
  text: string;
  elimination: boolean;
  time: boolean;
  values: DstVariableValue[];
}

export interface DstTableInfo {
  id: string;
  text: string;
  description: string;
  unit: string;
  updated: string;
  firstPeriod: string;
  latestPeriod: string;
  variables: DstVariable[];
}

export interface DstDataRow {
  [key: string]: string | number;
}

async function post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
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

  return response.json() as Promise<T>;
}

/**
 * List top-level subjects (or children of a given subject ID).
 */
export async function getSubjects(subjectId?: string): Promise<DstSubject[]> {
  const body: Record<string, unknown> = { recursive: false, omitSubjectsWithoutTables: true };
  if (subjectId) body.subjects = [subjectId];
  return post<DstSubject[]>("/subjects", body);
}

/**
 * List all tables, optionally filtered by subject ID.
 */
export async function getTables(subjectId?: string): Promise<DstTable[]> {
  const body: Record<string, unknown> = { includeInactive: false };
  if (subjectId) body.subjects = [subjectId];
  return post<DstTable[]>("/tables", body);
}

/**
 * Search tables by keyword (client-side filter on text/id/variables).
 */
export async function searchTables(keyword: string): Promise<DstTable[]> {
  const all = await getTables();
  const kw = keyword.toLowerCase();
  return all.filter(
    (t) =>
      t.text.toLowerCase().includes(kw) ||
      t.id.toLowerCase().includes(kw) ||
      t.variables.some((v) => v.toLowerCase().includes(kw))
  );
}

/**
 * Get metadata (variables and their allowed values) for a table.
 */
export async function getTableInfo(tableId: string): Promise<DstTableInfo> {
  return post<DstTableInfo>("/tableinfo", { table: tableId });
}

/**
 * Fetch data from a table.
 * variables: map of variable code  array of value codes (use ["*"] for all values).
 */
export async function getData(
  tableId: string,
  variables: Record<string, string[]>
): Promise<DstDataRow[]> {
  const variableList = Object.entries(variables).map(([code, values]) => ({
    code,
    values,
  }));

  const body = {
    table: tableId,
    format: "JSONSTAT",
    variables: variableList,
  };

  const raw = await post<JsonStatResponse>("/data", body);
  return parseJsonStat(raw);
}

interface JsonStatResponse {
  dataset: {
    dimension: Record<string, JsonStatDimension>;
  };
}

interface JsonStatDimension {
  category: {
    index: string[];
    label: Record<string, string>;
  };
}

function parseJsonStat(raw: JsonStatResponse): DstDataRow[] {
  // Implementation omitted for brevity
  return [];
}
