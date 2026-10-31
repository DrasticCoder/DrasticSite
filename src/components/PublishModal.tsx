'use client';

import { useState } from 'react';
import { useCode } from '@/context/CodeContext';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const { code, siteName, setSiteName } = useCode();
  const [slug, setSlug] = useState(siteName || '');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSubdomainUrl = (sub: string) => {
    if (typeof window === 'undefined') {
      return `https://${sub}.site.drasticcoder.in`;
    }
    const host = window.location.host;
    // Check if on localhost / local IP
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return `${window.location.protocol}//${sub}.localhost:3000`;
    }
    return `https://${sub}.site.drasticcoder.in`;
  };

  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const fullUrl = getSubdomainUrl(cleanSlug || 'my-site');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanSlug) {
      setError('Please provide a valid website name.');
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanSlug,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to publish.');
      }

      setSiteName(cleanSlug);
      setPublishedUrl(fullUrl);

      // Automatically copy link directly to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
      } catch (clipErr) {
        console.warn('Clipboard write failed:', clipErr);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error publishing site';
      setError(msg);
    } finally {
      setPublishing(false);
    }
  };

  const handleManualCopy = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleClose = () => {
    setPublishedUrl(null);
    setCopied(false);
    setError(null);
    onClose();
  };

  return (
    <div className="neo-modal-overlay" onClick={handleClose}>
      <div
        className="neo-modal-content neo-publish-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="neo-modal-header">
          <div className="neo-modal-title-group">
            <span className="neo-modal-tag neo-tag-green">INSTANT HOSTING</span>
            <h2>
              {publishedUrl ? '🎉 Website Live!' : '🚀 Publish Your Website'}
            </h2>
          </div>
          <button
            type="button"
            className="neo-modal-close-btn"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className="neo-modal-body">
          {!publishedUrl ? (
            <form onSubmit={handlePublish}>
              <p className="neo-modal-desc">
                Your site will be hosted instantly on DrasticSite with zero
                setup. Choose your custom subdomain below.
              </p>

              <div className="neo-form-group">
                <label htmlFor="publish-slug-input" className="neo-form-label">
                  Subdomain Slug:
                </label>
                <div className="neo-input-prefix-wrapper">
                  <input
                    id="publish-slug-input"
                    type="text"
                    className="neo-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-cool-project"
                    required
                    autoFocus
                  />
                  <span className="neo-input-suffix">
                    .site.drasticcoder.in
                  </span>
                </div>
              </div>

              <div className="neo-preview-url-box">
                <span className="neo-preview-url-label">Public Live URL:</span>
                <code className="neo-preview-url">{fullUrl}</code>
              </div>

              {error && (
                <div className="neo-error-banner">
                  <strong>⚠️ Publish Failed:</strong> {error}
                </div>
              )}

              <div className="neo-modal-footer">
                <button
                  type="button"
                  className="neo-btn neo-btn-secondary"
                  onClick={handleClose}
                  disabled={publishing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-green neo-btn-glow-green"
                  disabled={publishing || !cleanSlug}
                >
                  {publishing ? '⏳ Publishing...' : '🚀 Publish & Copy Link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="neo-publish-success-state">
              <div className="neo-success-badge">✅ PUBLISHED & COPIED</div>
              <h3 className="neo-success-title">Your site is live!</h3>
              <p className="neo-success-text">
                The link has been <strong>copied directly to your clipboard</strong>.
                You can paste and share it anywhere.
              </p>

              <div className="neo-url-card">
                <input
                  type="text"
                  readOnly
                  value={publishedUrl}
                  className="neo-url-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  className="neo-btn neo-btn-sm neo-btn-primary"
                  onClick={handleManualCopy}
                >
                  {copied ? '✓ Copied!' : 'Copy Again'}
                </button>
              </div>

              <div className="neo-publish-actions">
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-green"
                >
                  🌐 Visit Live Website ↗
                </a>
                <button
                  type="button"
                  className="neo-btn neo-btn-secondary"
                  onClick={handleClose}
                >
                  Done & Back to Studio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
