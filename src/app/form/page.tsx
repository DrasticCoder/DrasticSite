'use client';
import { useState } from 'react';
import './form.css';

export default function FormPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [siteLink, setSiteLink] = useState('');

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
            <a href={siteLink} target="_blank">
              {siteLink}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
