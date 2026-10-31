'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fresh Canvas | DrasticSite</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FFE600;
      color: #000;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 3px solid #000000;
      box-shadow: 8px 8px 0 #000000;
      padding: 40px;
      max-width: 540px;
      width: 100%;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: #00E599;
      border: 2px solid #000;
      box-shadow: 2px 2px 0 #000;
      padding: 4px 12px;
      font-weight: 800;
      font-size: 0.8rem;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 1.05rem;
      margin-bottom: 24px;
      line-height: 1.6;
      color: #222;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: #2563EB;
      color: #FFFFFF;
      font-weight: 800;
      text-decoration: none;
      border: 3px solid #000;
      box-shadow: 4px 4px 0 #000;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.15s ease;
    }
    .btn:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 #000;
    }
    .btn:active {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0 #000;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Neo-Brutalist Canvas</div>
    <h1>🧱 Ready to Build</h1>
    <p>Type your HTML/CSS directly in the editor, or click <strong>✨ Ask AI</strong> to generate any landing page, portfolio, or app instantly.</p>
    <button class="btn" onclick="alert('Hello from DrasticSite!')">⚡ Test Interaction</button>
  </div>
</body>
</html>`;

interface CodeContextProps {
  code: string;
  setCode: (value: string) => void;
  siteName: string;
  setSiteName: (name: string) => void;
  resetCode: () => void;
}

const CodeContext = createContext<CodeContextProps | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [siteName, setSiteName] = useState<string>('');

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setSiteName('');
  };

  return (
    <CodeContext.Provider
      value={{
        code,
        setCode,
        siteName,
        setSiteName,
        resetCode,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};
