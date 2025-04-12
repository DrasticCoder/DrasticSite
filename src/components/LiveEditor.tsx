'use client';
import { useCode } from '@/context/CodeContext';
import Editor from '@monaco-editor/react';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function LiveEditor() {
  const { code, setCode } = useCode();

  const handleEditorChange = (value?: string) => {
    setCode(value || '');
  };

  // Debounced change handler to prevent too many rapid updates
  const debouncedChangeHandler = useCallback(
    debounce(handleEditorChange, 300),
    [],
  );

  return (
    <div style={{ display: 'flex', height: '91vh' }}>
      {/* Editor pane */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <Editor
          height="100%"
          language="html"
          value={code}
          onChange={debouncedChangeHandler}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Live preview pane */}
      <div style={{ flex: 1 }}>
        <iframe
          srcDoc={code}
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Live Preview"
        />
      </div>
    </div>
  );
}
