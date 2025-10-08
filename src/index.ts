import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Tool registration modules
import { registerVotesTool } from './tools/get-votes.js';

// Create server instance (kept minimal – all logic lives in dedicated modules)
export const server = new McpServer({
  name: 'parlwatch-mcp',
  version: '0.0.1',
  capabilities: {
    resources: {},
    tools: {}
  }
});

// Register tools and resources
registerVotesTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Parlwatch MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
