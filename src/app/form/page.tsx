'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import './form.css';

export default function FormPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [siteLink, setSiteLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (name) {
      const baseUrl = `${window.location.protocol}//${name
        .replace(/\s+/g, '-')
        .toLowerCase()}.${window.location.host}`;
      setSiteLink(baseUrl);
    }
  }, [name]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const text = await file.text();
      setCode(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: slug, code }),
    });

    if (res.ok) {
      const fullUrl = `${window.location.protocol}//${slug}.${window.location.host}`;
      await navigator.clipboard.writeText(fullUrl);
      setPopupVisible(true);
      window.open(fullUrl, '_blank');
      setTimeout(() => setPopupVisible(false), 3000);
    }
  };

  return (
    <div className="form-container">
      <h1>Publish Your HTML</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Site Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-awesome-site"
            required
          />
        </label>

        <label>
          Upload .html File (optional):
          <input
            type="file"
            accept=".html"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </label>

        <label>
          Or edit HTML code below:
          <div style={{ height: '400px', border: '1px solid #ccc' }}>
            <Editor
              height="100%"
              language="html"
              value={code}
              onChange={(value) => setCode(value || '')}
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
        </label>

        <button type="submit">Submit</button>
      </form>

      {popupVisible && (
        <div className="popup">
          <div className="confetti"></div>
          <p>Link copied to clipboard:</p>
          <p>
            <Link href={siteLink} target="_blank">
              {siteLink}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
