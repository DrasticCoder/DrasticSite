'use client';
import { useState } from 'react';
import './form.css';
import Link from 'next/link';

export default function FormPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const siteLink = `${baseUrl}/${name}`;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code }),
    });
    if (res.ok) {
      window.location.href = `/${name}`;
      await navigator.clipboard.writeText(siteLink);
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 3000);
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
            required
          />
        </label>
        <label>
          HTML Code:
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows={10}
          />
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
