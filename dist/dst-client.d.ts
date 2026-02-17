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
/**
 * List top-level subjects (or children of a given subject ID).
 */
export declare function getSubjects(subjectId?: string): Promise<DstSubject[]>;
/**
 * List all tables, optionally filtered by subject ID.
 */
export declare function getTables(subjectId?: string): Promise<DstTable[]>;
/**
 * Search tables by keyword (client-side filter on text/id/variables).
 */
export declare function searchTables(keyword: string): Promise<DstTable[]>;
/**
 * Get metadata (variables and their allowed values) for a table.
 */
export declare function getTableInfo(tableId: string): Promise<DstTableInfo>;
/**
 * Fetch data from a table.
 * variables: map of variable code  array of value codes (use ["*"] for all values).
 */
export declare function getData(tableId: string, variables: Record<string, string[]>): Promise<DstDataRow[]>;
//# sourceMappingURL=dst-client.d.ts.map