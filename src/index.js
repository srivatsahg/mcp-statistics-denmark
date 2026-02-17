#!/usr/bin/env node
"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var dst_client_js_1 = require("./dst-client.js");
var TOOLS = [
    {
        name: "list_subjects",
        description: "Browse the Statistics Denmark subject hierarchy. Returns top-level subjects or children of a given subject. Use this to discover what categories of data are available (e.g. Taxes, Population, Economy).",
        inputSchema: {
            type: "object",
            properties: {
                subject_id: {
                    type: "string",
                    description: "Optional subject ID to list its children. Omit to get top-level subjects.",
                },
            },
        },
    },
    {
        name: "list_tables",
        description: "List all available data tables in the Statistics Denmark StatBank. Optionally filter by a subject ID. Returns table IDs, names, units, and date coverage.",
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
        description: "Search for Statistics Denmark tables by keyword. Searches across table names, IDs and variable names. Great for finding tax, income, VAT or other specific tables.",
        inputSchema: {
            type: "object",
            required: ["keyword"],
            properties: {
                keyword: {
                    type: "string",
                    description: 'Keyword to search for, e.g. "tax", "income", "VAT", "population", "employment".',
                },
            },
        },
    },
    {
        name: "get_table_metadata",
        description: "Get full metadata for a specific table: its description, unit, date range, and all available variables with their possible filter values. Always call this before get_table_data to understand what filters are available.",
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
        description: "Fetch actual data from a Statistics Denmark table. You must specify which variable values to include. Use get_table_metadata first to discover variable codes and value codes. Use [\"*\"] to fetch all values for a variable.",
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
                    description: 'An object mapping variable codes to arrays of value codes. Use ["*"] to select all values. Example: {"Tid": ["*"], "SKATTYPE": ["1", "2"]}',
                    additionalProperties: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
            },
        },
    },
];
var server = new index_js_1.Server({ name: "mcp-statistics-denmark", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ tools: TOOLS })];
}); }); });
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, subjectId, subjects, subjectId, tables, summary, keyword, results, summary, tableId, info, tableId, variables, rows, truncated, display, note, err_1, message;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 14, , 15]);
                _b = name;
                switch (_b) {
                    case "list_subjects": return [3 /*break*/, 2];
                    case "list_tables": return [3 /*break*/, 4];
                    case "search_tables": return [3 /*break*/, 6];
                    case "get_table_metadata": return [3 /*break*/, 8];
                    case "get_table_data": return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 2:
                subjectId = (args === null || args === void 0 ? void 0 : args.subject_id) || undefined;
                return [4 /*yield*/, (0, dst_client_js_1.getSubjects)(subjectId)];
            case 3:
                subjects = _c.sent();
                return [2 /*return*/, { content: [{ type: "text", text: JSON.stringify(subjects, null, 2) }] }];
            case 4:
                subjectId = (args === null || args === void 0 ? void 0 : args.subject_id) || undefined;
                return [4 /*yield*/, (0, dst_client_js_1.getTables)(subjectId)];
            case 5:
                tables = _c.sent();
                summary = tables.map(function (t) { return ({
                    id: t.id,
                    text: t.text,
                    unit: t.unit,
                    updated: t.updated,
                    firstPeriod: t.firstPeriod,
                    latestPeriod: t.latestPeriod,
                    active: t.active,
                }); });
                return [2 /*return*/, { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] }];
            case 6:
                keyword = args === null || args === void 0 ? void 0 : args.keyword;
                return [4 /*yield*/, (0, dst_client_js_1.searchTables)(keyword)];
            case 7:
                results = _c.sent();
                summary = results.map(function (t) { return ({
                    id: t.id,
                    text: t.text,
                    unit: t.unit,
                    updated: t.updated,
                    firstPeriod: t.firstPeriod,
                    latestPeriod: t.latestPeriod,
                    active: t.active,
                }); });
                return [2 /*return*/, { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] }];
            case 8:
                tableId = args === null || args === void 0 ? void 0 : args.table_id;
                return [4 /*yield*/, (0, dst_client_js_1.getTableInfo)(tableId)];
            case 9:
                info = _c.sent();
                return [2 /*return*/, { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] }];
            case 10:
                tableId = args === null || args === void 0 ? void 0 : args.table_id;
                variables = args === null || args === void 0 ? void 0 : args.variables;
                return [4 /*yield*/, (0, dst_client_js_1.getData)(tableId, variables)];
            case 11:
                rows = _c.sent();
                truncated = rows.length > 100 ? rows.slice(0, 100) : rows;
                display = JSON.stringify(truncated, null, 2);
                note = rows.length > 100 ? "\n\nNote: Only first 100 rows shown." : "";
                return [2 /*return*/, { content: [{ type: "text", text: display + note }] }];
            case 12: throw new Error("Unknown tool: ".concat(name));
            case 13: return [3 /*break*/, 15];
            case 14:
                err_1 = _c.sent();
                message = err_1 instanceof Error ? err_1.message : String(err_1);
                return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(message) }] }];
            case 15: return [2 /*return*/];
        }
    });
}); });
