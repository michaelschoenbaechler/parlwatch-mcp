import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Server as HttpServer } from 'node:http';
import { registerVotesTool } from './tools/get-votes.js';

function createServer() {
  const server = new McpServer({
    name: 'parlwatch-mcp',
    version: '0.0.1',
    capabilities: { resources: {}, tools: {} }
  });

  registerVotesTool(server);

  return server;
}

async function startExpressServer(): Promise<HttpServer> {
  const app = express();
  app.use(express.json());

  app.post('/mcp', async (req, res) => {
    const serverInstance = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    const cleanup = async () => {
      await Promise.allSettled([transport.close(), serverInstance.close()]);
    };

    const scheduleCleanup = () => {
      void cleanup();
    };

    res.on('close', scheduleCleanup);
    res.on('finish', scheduleCleanup);

    try {
      await serverInstance.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      await cleanup();
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error'
          },
          id: null
        });
      }
    }
  });

  app.all('/mcp', (req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.'
      },
      id: null
    });
    return;
  });

  const port = Number.parseInt(process.env.PORT ?? '3001', 10);

  return await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.error(`Parlwatch MCP Server listening on port ${port}`);
      resolve(server);
    });
    server.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const httpServer = await startExpressServer();

  const shutdown = () => {
    console.error('Shutting down Parlwatch MCP Server...');
    httpServer.close((error) => {
      if (error) {
        console.error('Error closing HTTP server:', error);
        process.exitCode = 1;
      }
      process.exit();
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
