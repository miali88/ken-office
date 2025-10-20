import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { CaseSelector } from './components/CaseSelector';
import { DocumentSelector } from './components/DocumentSelector';

type Task = {
  id: number;
  label: string;
  status: 'pending' | 'loading' | 'complete';
};

type DraftingTabAppProps = {
  onStartRewrite: () => void;
};

// Global reference to update task states from outside React
let updateTaskStateGlobal: ((step: number, status: 'loading' | 'complete') => void) | null = null;
let resetTasksGlobal: (() => void) | null = null;
let setStageGlobal: ((stage: 'initial' | 'loading' | 'complete') => void) | null = null;

export function DraftingTabApp({ onStartRewrite }: DraftingTabAppProps) {
  const [stage, setStage] = useState<'initial' | 'loading' | 'complete'>('initial');
  const [completionTimestamp, setCompletionTimestamp] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, label: 'Understanding document', status: 'pending' },
    { id: 2, label: 'Identifying missing info', status: 'pending' },
    { id: 3, label: 'Reviewing case files', status: 'pending' },
    { id: 4, label: 'Typing....', status: 'pending' },
  ]);

  // Expose functions globally for ai-rewrite-structured.ts to call
  useEffect(() => {
    updateTaskStateGlobal = (step: number, status: 'loading' | 'complete') => {
      setTasks(prev =>
        prev.map((task, idx) => {
          if (idx === step - 1) {
            return { ...task, status };
          }
          return task;
        })
      );

      // If this is the last task (Typing....) being completed, set timestamp
      if (step === 4 && status === 'complete') {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setCompletionTimestamp(`${timeStr} • ${dateStr}`);
      }
    };

    resetTasksGlobal = () => {
      setTasks([
        { id: 1, label: 'Understanding document', status: 'pending' },
        { id: 2, label: 'Identifying missing info', status: 'pending' },
        { id: 3, label: 'Reviewing case files', status: 'pending' },
        { id: 4, label: 'Typing....', status: 'pending' },
      ]);
      setCompletionTimestamp('');
    };

    setStageGlobal = (newStage: 'initial' | 'loading' | 'complete') => {
      setStage(newStage);
    };

    return () => {
      updateTaskStateGlobal = null;
      resetTasksGlobal = null;
      setStageGlobal = null;
    };
  }, []);

  const handleStartRewrite = () => {
    setStage('loading');
    // Reset tasks
    setTasks([
      { id: 1, label: 'Understanding document', status: 'pending' },
      { id: 2, label: 'Identifying missing info', status: 'pending' },
      { id: 3, label: 'Reviewing case files', status: 'pending' },
      { id: 4, label: 'Typing....', status: 'pending' },
    ]);

    // Call the actual rewrite handler
    onStartRewrite();
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Case Selector - Always visible */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          color: '#4b5563',
          marginBottom: '8px',
          fontWeight: 500
        }}>
          Case selected:
        </label>
        <CaseSelector />
      </div>

      {/* Document Selector - Always visible */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          color: '#4b5563',
          marginBottom: '8px',
          fontWeight: 500
        }}>
          Document template
        </label>
        <DocumentSelector />
      </div>

      {/* Loading States - Show when loading */}
      {stage === 'loading' && (
        <div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: 1,
            transition: 'opacity 0.3s ease'
          }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  opacity: 1,
                  transform: 'translateX(0)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {task.status === 'pending' && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid #d1d5db'
                    }}></div>
                  )}
                  {task.status === 'loading' && (
                    <Loader2 style={{
                      width: '20px',
                      height: '20px',
                      color: '#3b82f6',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  {task.status === 'complete' && (
                    <Check style={{
                      width: '20px',
                      height: '20px',
                      color: '#10b981'
                    }} />
                  )}
                </div>
                <span style={{
                  color: task.status === 'loading' ? '#3b82f6' : task.status === 'complete' ? '#111827' : '#6b7280',
                  transition: 'color 0.3s ease'
                }}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>

          {/* Completion timestamp - Show when all tasks complete */}
          {completionTimestamp && (
            <div style={{
              marginTop: '12px',
              fontSize: '13px',
              color: '#6b7280',
              textAlign: 'left',
              paddingLeft: '12px'
            }}>
              Drafted {completionTimestamp}
            </div>
          )}
        </div>
      )}

      {/* AI Rewrite Button */}
      {stage === 'initial' && (
        <div>
          <button
            id="ai-rewrite-btn"
            onClick={handleStartRewrite}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: 1,
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✨ Review & Draft
          </button>
        </div>
      )}

      {/* Status Message - Only shows final success/error message */}
      <div id="rewrite-status" style={{ marginTop: '12px' }}></div>
    </div>
  );
}

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for external use by ai-rewrite-structured.ts
export function updateTaskState(step: number, status: 'loading' | 'complete') {
  if (updateTaskStateGlobal) {
    updateTaskStateGlobal(step, status);
  }
}

export function resetTasks() {
  if (resetTasksGlobal) {
    resetTasksGlobal();
  }
}

export function setRewriteStage(stage: 'initial' | 'loading' | 'complete') {
  if (setStageGlobal) {
    setStageGlobal(stage);
  }
}
