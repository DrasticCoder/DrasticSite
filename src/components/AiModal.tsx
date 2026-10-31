'use client';

import { useState } from 'react';
import { useCode } from '@/context/CodeContext';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateSuccess?: (slug: string) => void;
}

export default function AiModal({
  isOpen,
  onClose,
  onGenerateSuccess,
}: AiModalProps) {
  const { code, setCode, setSiteName } = useCode();
  const [prompt, setPrompt] = useState('');
  // Keep the website subdomain field empty by default as requested
  const [desiredSlug, setDesiredSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setError('Please describe the website you want to build.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          currentCode: code && code.length > 50 ? code : undefined,
          siteName: desiredSlug.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate code.');
      }

      if (data.code) {
        setCode(data.code);
        const finalSlug = data.suggestedSlug || desiredSlug.trim() || 'my-site';
        setSiteName(finalSlug);

        if (onGenerateSuccess) {
          onGenerateSuccess(finalSlug);
        }
        onClose();
      } else {
        throw new Error('No code returned from AI.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neo-modal-overlay" onClick={onClose}>
      <div
        className="neo-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="neo-modal-header">
          <div className="neo-modal-title-group">
            <span className="neo-modal-tag">AI STUDIO</span>
            <h2>⚡ What website do you want to build?</h2>
          </div>
          <button
            type="button"
            className="neo-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="neo-modal-body">
          <p className="neo-modal-desc">
            Describe what you need in plain English. AI will generate the complete,
            responsive website with instant live preview.
          </p>

          <form onSubmit={handleGenerate}>
            {/* Prompt Textarea */}
            <div className="neo-form-group">
              <label htmlFor="ai-prompt-input" className="neo-form-label">
                Prompt:
              </label>
              <textarea
                id="ai-prompt-input"
                className="neo-textarea"
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="E.g., A clean modern portfolio for a designer with gallery, dark mode, testimonials, and contact modal..."
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Optional Site Subdomain (kept empty by default) */}
            <div className="neo-form-group">
              <label htmlFor="site-slug-input" className="neo-form-label">
                Website Subdomain (optional):
              </label>
              <div className="neo-input-prefix-wrapper">
                <input
                  id="site-slug-input"
                  type="text"
                  className="neo-input"
                  placeholder="e.g. my-cool-project"
                  value={desiredSlug}
                  onChange={(e) =>
                    setDesiredSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    )
                  }
                  disabled={loading}
                />
                <span className="neo-input-suffix">
                  .site.drasticcoder.in
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="neo-error-banner">
                <strong>⚠️ Generation Error:</strong> {error}
              </div>
            )}

            {/* Ultra-Fast Loading Banner */}
            {loading && (
              <div className="neo-loading-card">
                <div className="neo-loading-spinner" />
                <div>
                  <div className="neo-loading-title">
                    ⚡ Crafting your website at lightning speed...
                  </div>
                  <div className="neo-loading-sub">
                    Generating complete HTML5, modern CSS, and interactive scripts.
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="neo-modal-footer">
              <button
                type="button"
                className="neo-btn neo-btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Close & Write Manually
              </button>

              <button
                type="submit"
                className="neo-btn neo-btn-primary neo-btn-glow-yellow"
                disabled={loading || !prompt.trim()}
              >
                {loading ? '⏳ Generating Code...' : '⚡ Generate Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
