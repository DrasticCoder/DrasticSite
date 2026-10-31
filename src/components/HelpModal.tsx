'use client';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export default function HelpModal({
  isOpen,
  onClose,
  onStartTour,
}: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="neo-modal-overlay" onClick={onClose}>
      <div
        className="neo-modal-content neo-help-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="neo-modal-header">
          <div className="neo-modal-title-group">
            <span className="neo-modal-tag">QUICK GUIDE</span>
            <h2>❓ How DrasticSite Works</h2>
          </div>
          <button
            type="button"
            className="neo-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="neo-modal-body">
          <p className="neo-modal-desc">
            Build, edit, and launch complete websites in seconds with zero configuration.
          </p>

          <div className="neo-steps-container">
            {/* Step 1 */}
            <div className="neo-step-card">
              <div className="neo-step-badge">1</div>
              <div className="neo-step-content">
                <h4>⚡ Describe Your Website</h4>
                <p>
                  Use the initial prompt modal or the <strong>✨ AI Prompt</strong> button
                  to describe your dream site in plain English. The AI generates complete HTML5, modern
                  CSS, and interactive scripts at ultra-fast speeds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="neo-step-card">
              <div className="neo-step-badge">2</div>
              <div className="neo-step-content">
                <h4>✏️ Live Tweak &amp; Resize</h4>
                <p>
                  Drag the central <strong>⋮ divider</strong> left or right to expand/shrink
                  the code editor or preview. Edit code directly, or switch between
                  <strong> Desktop</strong>, <strong>Tablet</strong>, and <strong>Mobile</strong> views.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="neo-step-card">
              <div className="neo-step-badge">3</div>
              <div className="neo-step-content">
                <h4>🚀 One-Click Publish</h4>
                <p>
                  Click the glowing <strong>🚀 Publish</strong> button. Your site is deployed
                  instantly and its live public link is <strong>copied directly to your clipboard</strong>!
                </p>
              </div>
            </div>
          </div>

          <div className="neo-help-actions">
            <button
              type="button"
              className="neo-btn neo-btn-primary neo-btn-glow-yellow"
              onClick={() => {
                onClose();
                onStartTour();
              }}
            >
              🧭 Start Interactive Tour
            </button>
            <button
              type="button"
              className="neo-btn neo-btn-secondary"
              onClick={onClose}
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
