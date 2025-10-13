import React from 'react';

export interface VoteEntry {
  title: string;
  subtitle: string;
  date: string;
  detailUrl: string;
}

export interface WidgetState {
  votes?: VoteEntry[];
}

export interface VoteWidgetProps {
  initialState?: WidgetState;
}

export const VoteWidget: React.FC<VoteWidgetProps> = ({ initialState }) => {
  return (
    <div style={{ padding: '0.75rem 1rem' }}>
      <h1 style={{ marginTop: 0, fontSize: '1.1rem' }}>
        Swiss Parliament Votes
      </h1>
      <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', opacity: 0.8 }}>
        React widget container (static demo). Data is supplied via the MCP tool
        structuredContent.
      </p>
      {initialState?.votes ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0' }}>
          {initialState.votes.map((v) => (
            <li key={v.detailUrl} style={{ marginBottom: '0.5rem' }}>
              <strong>{v.title}</strong>: {v.subtitle}
              <br />
              <small style={{ opacity: 0.7 }}>{v.date}</small>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ marginTop: '0.75rem' }}>No votes yet.</div>
      )}
    </div>
  );
};
