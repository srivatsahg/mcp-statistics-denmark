# MCP Server for Statistics Denmark

A hobbyist project to create an **MCP (Model Context Protocol) Server** that wraps the [Statistics Denmark (Danmarks Statistik) StatBank API](https://www.dst.dk/en/Statistik/hjaelp-til-statistikbanken/api), giving AI assistants direct access to Danish statistical data — including taxes, income, population, employment, and more.

---

## Features

| Tool | Description |
|---|---|
| `list_subjects` | Browse the subject hierarchy (e.g. Taxes, Economy, Population) |
| `list_tables` | List all available data tables, optionally filtered by subject |
| `search_tables` | Search tables by keyword (e.g. "tax", "VAT", "income") |
| `get_table_metadata` | Get variables and filter values for a specific table |
| `get_table_data` | Fetch actual data from a table with variable filters |

All data is returned in **English**. No API key required — the DST StatBank API is free and open.

---

## Requirements

- **Node.js** v18 or higher
- **npm** v8 or higher

---

## Installation

```bash
# Clone or copy the project
cd mcp-statistics-denmark

# Install dependencies
npm install

# Build TypeScript
npm run build
```

---

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dst-statistics-denmark": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-statistics-denmark/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop. You should see the 5 DST tools available.

---

## Usage with Claude Code (CLI)

```bash
claude mcp add dst-statistics-denmark -- node /absolute/path/to/mcp-statistics-denmark/dist/index.js
```

---

## Example Queries

Once connected, you can ask Claude things like:

- *"Search for Danish tax tables"*
- *"What variables are available in table SKAT10?"*
- *"Get income tax data for all years from table INDKP101"*
- *"List all subjects in the Statistics Denmark StatBank"*
- *"Show me VAT revenue data from Denmark"*

---

## Typical Workflow

1. **Discover** — Use `search_tables` or `list_subjects` → `list_tables` to find the right table ID
2. **Inspect** — Use `get_table_metadata` to see what variables and filter values are available
3. **Fetch** — Use `get_table_data` with the variable codes and value codes from step 2

### Example

```
search_tables("tax")
→ finds table "SKAT10" - "Tax assessments by type"

get_table_metadata("SKAT10")
→ shows variables: SKATTYPE (tax type), Tid (time period), OMRÅDE (region)
→ shows valid values for each variable

get_table_data("SKAT10", { "Tid": ["*"], "SKATTYPE": ["1"], "OMRÅDE": ["000"] })
→ returns rows of actual tax data
```

---

## API Reference

All data comes from the **free, open** Statistics Denmark API:
- Base URL: `https://api.statbank.dk/v1`
- Documentation: https://www.dst.dk/en/Statistik/hjaelp-til-statistikbanken/api
- No authentication required

---

## License

MIT
