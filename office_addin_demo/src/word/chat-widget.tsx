import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './chat-widget.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: any[];
  toolCalls?: string[];
}

interface ChatWidgetProps {
  caseId: string;
}

export function ChatWidget({ caseId }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !caseId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      const requestBody = {
        message: userMessage.content,
        threadId,
      };

      // Call API on localhost:3001 directly (HTTPS)
      const response = await fetch(`https://localhost:3001/api/cases/${caseId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessageId = (Date.now() + 1).toString();
      setStreamingMessageId(assistantMessageId);
      setIsThinking(false);

      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, initialAssistantMessage]);

      let accumulatedText = '';
      let finalCitations: any[] = [];
      let messageToolCalls: string[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (data.type) {
                  case 'start':
                    if (data.threadId) {
                      setThreadId(data.threadId);
                    }
                    break;

                  case 'tool_call':
                    messageToolCalls.push(data.toolName);
                    setIsThinking(false);

                    setMessages(prev => prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, toolCalls: [...messageToolCalls] }
                        : msg
                    ));
                    break;

                  case 'text':
                    accumulatedText = data.accumulated || accumulatedText + data.content;

                    setMessages(prev => prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulatedText, toolCalls: messageToolCalls.length > 0 ? messageToolCalls : undefined }
                        : msg
                    ));
                    break;

                  case 'done':
                    if (data.toolResults?.length > 0) {
                      data.toolResults.forEach((toolResult: any) => {
                        const citationsArray =
                          toolResult.citations ||
                          toolResult.result?.citations ||
                          toolResult.output?.citations ||
                          toolResult.data?.citations ||
                          toolResult.payload?.result?.citations ||
                          [];

                        if (Array.isArray(citationsArray)) {
                          finalCitations.push(...citationsArray);
                        }
                      });
                    }

                    setMessages(prev => prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: data.finalText || accumulatedText,
                            citations: finalCitations.length > 0 ? finalCitations : undefined,
                            toolCalls: messageToolCalls.length > 0 ? messageToolCalls : undefined
                          }
                        : msg
                    ));

                    if (data.threadId) {
                      setThreadId(data.threadId);
                    }
                    break;

                  case 'error':
                    throw new Error(data.error?.message || 'Streaming error occurred');
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
        setStreamingMessageId(null);
      }
    } catch (error) {
      console.error('[Chat Widget] Error:', error);
      setIsThinking(false);
      setStreamingMessageId(null);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Failed to send message. Make sure the API server is running on localhost:3001.\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">🤖</span>
          Kenneth AI Assistant
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p>Ask about this case.</p>
            <p className="chat-empty-subtitle">I can search documents and answer questions.</p>
          </div>
        ) : (
          <div className="chat-messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message chat-message-${message.role}`}>
                <div className="chat-message-avatar">
                  {message.role === 'assistant' ? '🤖' : '👤'}
                </div>
                <div className="chat-message-content">
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="chat-tool-calls">
                      {message.toolCalls.map((toolName, index) => (
                        <span key={index} className="chat-tool-badge">
                          🔍 {toolName === 'searchCaseDocuments' ? 'Searched documents' : toolName}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="chat-message-text">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                    {message.id === streamingMessageId && message.content && (
                      <span className="chat-cursor">▋</span>
                    )}
                  </div>

                  {message.citations && message.citations.length > 0 && (
                    <div className="chat-citations">
                      <div className="chat-citations-title">References:</div>
                      {message.citations.map((citation: any, index: number) => (
                        <div key={index} className="chat-citation">
                          <span className="chat-citation-number">{citation.reference_number}</span>
                          <span className="chat-citation-name">
                            {citation.display_name || `Document ${citation.chunk_id}`}
                          </span>
                          {citation.page_start && (
                            <span className="chat-citation-page">
                              p.{citation.page_start}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="chat-message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="chat-message chat-message-assistant">
                <div className="chat-message-avatar">🤖</div>
                <div className="chat-message-content">
                  <div className="chat-thinking">
                    <span className="chat-thinking-dot">●</span>
                    <span className="chat-thinking-dot">●</span>
                    <span className="chat-thinking-dot">●</span>
                    <span className="chat-thinking-text">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about case documents..."
          disabled={isLoading}
        />
        <button
          className="chat-send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? '...' : '➤'}
        </button>
      </div>
    </div>
  );
}
