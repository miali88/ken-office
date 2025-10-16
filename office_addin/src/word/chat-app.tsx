import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './chat-widget';

export function mountChatApp(caseId: string) {
  const container = document.getElementById('chat-root');
  if (!container) {
    console.error('Chat root element not found');
    return;
  }

  const root = createRoot(container);
  root.render(<ChatWidget caseId={caseId} />);
}
