import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { makeVotesRequest } from '../http.js';
import { z } from 'zod';
import { loadVoteWidgetHtml } from '../ui/widget-loader.js';

export function registerVotesTool(server: McpServer) {
  server.registerResource(
    'vote-widget',
    'ui://widget/vote-card.html',
    {},
    async () => ({
      contents: [
        {
          uri: 'ui://widget/vote-card.html',
          mimeType: 'text/html+skybridge',
          text: loadVoteWidgetHtml()
        }
      ]
    })
  );

  server.registerTool(
    'get_votes',
    {
      title: 'Get recent votes for a businesses of the swiss parliament',
      _meta: {
        'openai/outputTemplate': 'ui://widget/vote-card.html',
        'openai/toolInvocation/invoking':
          'Displaying recent votes from the Swiss parliament.',
        'openai/toolInvocation/invoked':
          'Displayed recent votes from the Swiss parliament.'
      },
      inputSchema: {
        skip: z
          .number()
          .min(0)
          .optional()
          .describe('Number of votes to skip (for pagination)')
      }
    },
    async ({ skip }) => {
      const votes = await makeVotesRequest({ top: 5, skip });

      if (!votes) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve recent votes from the Swiss parliament.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: 'Here are the latest 5 votes in the Swiss parliament.'
          }
        ],
        structuredContent: {
          votes: votes.map((vote) => ({
            title: vote.BusinessShortNumber,
            subtitle: vote.BusinessTitle,
            date: vote.VoteEnd,
            detailUrl: `https://www.parlament.ch/en/ratsbetrieb/suche-curia-vista/geschaeft?AffairId=${vote.BusinessNumber}`
          }))
        },
        _meta: {
          votesCount: votes.length
        }
      };
    }
  );
}
