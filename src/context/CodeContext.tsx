'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CodeContextProps {
  code: string;
  setCode: (value: string) => void;
}

const CodeContext = createContext<CodeContextProps | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState('<p>Hello World</p>');
  return (
    <CodeContext.Provider value={{ code, setCode }}>
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
