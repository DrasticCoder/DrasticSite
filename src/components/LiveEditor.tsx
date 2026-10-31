'use client';

import { useCode } from '@/context/CodeContext';
import Editor from '@monaco-editor/react';
import { useMemo, useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { ViewMode, DeviceMode } from './StudioHeader';

interface LiveEditorProps {
  viewMode?: ViewMode;
  deviceMode?: DeviceMode;
  onOpenAiModal?: () => void;
}

export default function LiveEditor({
  viewMode = 'split',
  deviceMode = 'desktop',
  onOpenAiModal,
}: LiveEditorProps) {
  const { code, setCode } = useCode();
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Splitter resizable state
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Debounce editor changes to prevent lag
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((value?: string) => {
        setCode(value || '');
      }, 250),
    [setCode]
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRefreshPreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Drag handler for the resizable splitter
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      let pct = (offsetX / totalWidth) * 100;
      // Clamp between 15% and 85%
      if (pct < 15) pct = 15;
      if (pct > 85) pct = 85;

      setSplitPercent(pct);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const getDeviceContainerStyle = () => {
    if (deviceMode === 'mobile') {
      return {
        width: '390px',
        maxWidth: '100%',
        height: '844px',
        maxHeight: '94%',
        borderRadius: '24px',
        border: '4px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        overflow: 'hidden',
        background: '#ffffff',
      };
    }
    if (deviceMode === 'tablet') {
      return {
        width: '768px',
        maxWidth: '100%',
        height: '95%',
        borderRadius: '16px',
        border: '4px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        overflow: 'hidden',
        background: '#ffffff',
      };
    }
    return {
      width: '100%',
      height: '100%',
      border: 'none',
    };
  };

  // Determine width styles based on viewMode and splitPercent
  const editorWidth =
    viewMode === 'split' ? `${splitPercent}%` : viewMode === 'code' ? '100%' : '0%';
  const previewWidth =
    viewMode === 'split' ? `${100 - splitPercent}%` : viewMode === 'preview' ? '100%' : '0%';

  return (
    <div
      ref={containerRef}
      className={`neo-editor-workspace neo-view-${viewMode} ${
        isDragging ? 'is-resizing' : ''
      }`}
    >
      {/* Invisible overlay when dragging to prevent iframe from trapping mouse events */}
      {isDragging && <div className="neo-drag-overlay" />}

      {/* Code Editor Pane */}
      {viewMode !== 'preview' && (
        <div
          data-tour="code-editor"
          className="neo-pane neo-editor-pane"
          style={{ width: editorWidth, flex: 'none' }}
        >
          <div className="neo-pane-bar">
            <div className="neo-pane-title">
              <span className="neo-pill-tag">HTML / CSS / JS</span>
              <span>Code Editor</span>
            </div>
            <div className="neo-pane-tools">
              <button
                type="button"
                className="neo-mini-btn"
                onClick={handleCopyCode}
                title="Copy HTML to clipboard"
              >
                {copiedCode ? '✓ Copied' : '📋 Copy Code'}
              </button>
              {onOpenAiModal && (
                <button
                  data-tour="ai-prompt"
                  type="button"
                  className="neo-mini-btn neo-mini-btn-accent"
                  onClick={onOpenAiModal}
                  title="Ask AI to modify this code"
                >
                  ✨ AI Prompt
                </button>
              )}
            </div>
          </div>

          <div className="neo-monaco-wrapper">
            <Editor
              height="100%"
              language="html"
              value={code}
              onChange={debouncedChangeHandler}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'var(--font-geist-mono), Menlo, Monaco, monospace',
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>
      )}

      {/* Resizable Splitter Handle */}
      {viewMode === 'split' && (
        <div
          data-tour="resizable-splitter"
          className={`neo-splitter ${isDragging ? 'is-active' : ''}`}
          onPointerDown={handlePointerDown}
          role="separator"
          aria-orientation="vertical"
          title="Drag left or right to expand/shrink editor and preview"
        >
          <div className="neo-splitter-bar">
            <div className="neo-splitter-dots">⋮</div>
          </div>
        </div>
      )}

      {/* Live Preview Pane */}
      {viewMode !== 'code' && (
        <div
          data-tour="preview-pane"
          className="neo-pane neo-preview-pane"
          style={{ width: previewWidth, flex: 'none' }}
        >
          <div className="neo-pane-bar">
            <div className="neo-pane-title">
              <span className="neo-pill-tag neo-pill-green">● LIVE PREVIEW</span>
              <span>
                {deviceMode === 'desktop'
                  ? 'Desktop View (Full)'
                  : deviceMode === 'tablet'
                  ? 'Tablet View (768px)'
                  : 'Mobile View (390px)'}
              </span>
            </div>
            <div className="neo-pane-tools">
              <button
                type="button"
                className="neo-mini-btn"
                onClick={handleRefreshPreview}
                title="Reload Preview"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="neo-preview-viewport-wrapper">
            <div
              className={`neo-preview-device-box ${
                deviceMode !== 'desktop' ? 'is-framed' : ''
              }`}
              style={getDeviceContainerStyle()}
            >
              <iframe
                key={iframeKey}
                srcDoc={code}
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                className="neo-preview-iframe"
                title="Live Website Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
