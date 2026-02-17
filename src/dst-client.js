"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getSubjects = getSubjects;
exports.getTables = getTables;
exports.searchTables = searchTables;
exports.getTableInfo = getTableInfo;
exports.getData = getData;
var BASE_URL = "https://api.statbank.dk/v1";
var LANG = "en";
function post(endpoint, body) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(BASE_URL).concat(endpoint);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(__assign(__assign({}, body), { lang: LANG, format: "JSON" })),
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    throw new Error("DST API error ".concat(response.status, ": ").concat(text));
                case 3: return [2 /*return*/, response.json()];
            }
        });
    });
}
/**
 * List top-level subjects (or children of a given subject ID).
 */
function getSubjects(subjectId) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            body = { recursive: false, omitSubjectsWithoutTables: true };
            if (subjectId)
                body.subjects = [subjectId];
            return [2 /*return*/, post("/subjects", body)];
        });
    });
}
/**
 * List all tables, optionally filtered by subject ID.
 */
function getTables(subjectId) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            body = { includeInactive: false };
            if (subjectId)
                body.subjects = [subjectId];
            return [2 /*return*/, post("/tables", body)];
        });
    });
}
/**
 * Search tables by keyword (client-side filter on text/id/variables).
 */
function searchTables(keyword) {
    return __awaiter(this, void 0, void 0, function () {
        var all, kw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTables()];
                case 1:
                    all = _a.sent();
                    kw = keyword.toLowerCase();
                    return [2 /*return*/, all.filter(function (t) {
                            return t.text.toLowerCase().includes(kw) ||
                                t.id.toLowerCase().includes(kw) ||
                                t.variables.some(function (v) { return v.toLowerCase().includes(kw); });
                        })];
            }
        });
    });
}
/**
 * Get metadata (variables and their allowed values) for a table.
 */
function getTableInfo(tableId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, post("/tableinfo", { table: tableId })];
        });
    });
}
/**
 * Fetch data from a table.
 * variables: map of variable code  array of value codes (use ["*"] for all values).
 */
function getData(tableId, variables) {
    return __awaiter(this, void 0, void 0, function () {
        var variableList, body, raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    variableList = Object.entries(variables).map(function (_a) {
                        var code = _a[0], values = _a[1];
                        return ({
                            code: code,
                            values: values,
                        });
                    });
                    body = {
                        table: tableId,
                        format: "JSONSTAT",
                        variables: variableList,
                    };
                    return [4 /*yield*/, post("/data", body)];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, parseJsonStat(raw)];
            }
        });
    });
}
function parseJsonStat(raw) {
    // Implementation omitted for brevity
    return [];
}
