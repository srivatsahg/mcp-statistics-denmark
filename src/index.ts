#!/usr/bin/env node
/**
 * MCP Statistics Denmark Server  Statistics Denmark StatBank
 *
 * Tools exposed:
 *  1. list_subjects         Browse subject hierarchy
 *  2. list_tables           List tables (optionally by subject)
 *  3. search_tables         Search tables by keyword
 *  4. get_table_metadata    Get variables/values for a table
 *  5. get_table_data        Fetch actual data from a table
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  getSubjects,
  getTables,
  searchTables,
  getTableInfo,
  getData,
} from "./dst-client.js";

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

const TOOLS: ToolDefinition[] = [
  {
    name: "list_subjects",
    description:
      "Browse the Statistics Denmark subject hierarchy. Returns top-level subjects or children of a given subject. Use this to discover what categories of data are available (e.g. Taxes, Population, Economy).",
    inputSchema: {
      type: "object",
      properties: {
        subject_id: {
          type: "string",
          description:
            "Optional subject ID to list its children. Omit to get top-level subjects.",
        },
      },
    },
  },
  {
    name: "list_tables",
    description:
      "List all available data tables in the Statistics Denmark StatBank. Optionally filter by a subject ID. Returns table IDs, names, units, and date coverage.",
    inputSchema: {
      type: "object",
      properties: {
        subject_id: {
          type: "string",
          description: "Optional subject ID to filter tables. Omit to list all tables.",
        },
      },
    },
  },
  {
    name: "search_tables",
    description:
      "Search for Statistics Denmark tables by keyword. Searches across table names, IDs and variable names. Great for finding tax, income, VAT or other specific tables.",
    inputSchema: {
      type: "object",
      required: ["keyword"],
      properties: {
        keyword: {
          type: "string",
          description:
            'Keyword to search for, e.g. "tax", "income", "VAT", "population", "employment".',
        },
      },
    },
  },
  {
    name: "get_table_metadata",
    description:
      "Get full metadata for a specific table: its description, unit, date range, and all available variables with their possible filter values. Always call this before get_table_data to understand what filters are available.",
    inputSchema: {
      type: "object",
      required: ["table_id"],
      properties: {
        table_id: {
          type: "string",
          description: 'Table ID, e.g. "SKAT10", "INDKP101". Case-insensitive.',
        },
      },
    },
  },
  {
    name: "get_table_data",
    description:
      "Fetch actual data from a Statistics Denmark table. You must specify which variable values to include. Use get_table_metadata first to discover variable codes and value codes. Use [\"*\"] to fetch all values for a variable.",
    inputSchema: {
      type: "object",
      required: ["table_id", "variables"],
      properties: {
        table_id: {
          type: "string",
          description: 'Table ID, e.g. "SKAT10". Case-insensitive.',
        },
        variables: {
          type: "object",
          description:
            'An object mapping variable codes to arrays of value codes. Use ["*"] to select all values. Example: {"Tid": ["*"], "SKATTYPE": ["1", "2"]}',
          additionalProperties: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
];

const server = new Server(
  { name: "mcp-statistics-denmark", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_subjects": {
        const subjectId = (args?.subject_id as string) || undefined;
        const subjects = await getSubjects(subjectId);
        return { content: [{ type: "text", text: JSON.stringify(subjects, null, 2) }] };
      }

      case "list_tables": {
        const subjectId = (args?.subject_id as string) || undefined;
        const tables = await getTables(subjectId);
        const summary = tables.map((t) => ({
          id: t.id,
          text: t.text,
          unit: t.unit,
          updated: t.updated,
          firstPeriod: t.firstPeriod,
          latestPeriod: t.latestPeriod,
          active: t.active,
        }));
        return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
      }

      case "search_tables": {
        const keyword = args?.keyword as string;
        const results = await searchTables(keyword);
        const summary = results.map((t) => ({
          id: t.id,
          text: t.text,
          unit: t.unit,
          updated: t.updated,
          firstPeriod: t.firstPeriod,
          latestPeriod: t.latestPeriod,
          active: t.active,
        }));
        return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
      }

      case "get_table_metadata": {
        const tableId = args?.table_id as string;
        const info = await getTableInfo(tableId);
        return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
      }

      case "get_table_data": {
        const tableId = args?.table_id as string;
        const variables = args?.variables as Record<string, string[]>;
        const rows = await getData(tableId, variables);
        const truncated = rows.length > 100 ? rows.slice(0, 100) : rows;
        const display = JSON.stringify(truncated, null, 2);
        const note = rows.length > 100 ? `\n\nNote: Only first 100 rows shown.` : "";
        return { content: [{ type: "text", text: display + note }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `Error: ${message}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Statistics Denmark Server running — Statistics Denmark StatBank API ready");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});