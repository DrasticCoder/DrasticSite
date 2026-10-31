'use client';

import { useCode } from '@/context/CodeContext';

export type ViewMode = 'split' | 'code' | 'preview';
export type DeviceMode = 'desktop' | 'mobile' | 'tablet';

interface StudioHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (device: DeviceMode) => void;
  onOpenPublishModal: () => void;
  onOpenHelpModal?: () => void;
  onOpenAiModal?: () => void;
  onResetCode?: () => void;
}

export default function StudioHeader({
  viewMode,
  setViewMode,
  deviceMode,
  setDeviceMode,
  onOpenPublishModal,
  onOpenHelpModal,
}: StudioHeaderProps) {
  const { siteName } = useCode();

  return (
    <header className="neo-studio-header">
      {/* Brand & Subdomain Info */}
      <div data-tour="brand" className="neo-header-brand-group">
        <div className="neo-header-logo">
          <span className="neo-logo-icon">🧱</span>
          <span className="neo-logo-text">DrasticSite</span>
        </div>
        <div className="neo-slug-badge" title="Your current site subdomain">
          <span className="neo-slug-dot" />
          <span className="neo-slug-text">
            {siteName ? `${siteName}.site.drasticcoder.in` : 'site.drasticcoder.in'}
          </span>
        </div>
      </div>

      {/* Middle Controls: View & Device toggles */}
      <div className="neo-header-center-controls">
        {/* View Mode Switcher */}
        <div className="neo-button-group">
          <button
            type="button"
            className={`neo-group-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Split Code & Preview"
          >
            <span>◫</span> Split
          </button>
          <button
            type="button"
            className={`neo-group-btn ${viewMode === 'code' ? 'active' : ''}`}
            onClick={() => setViewMode('code')}
            title="Code Editor Only"
          >
            <span>&lt;/&gt;</span> Code
          </button>
          <button
            type="button"
            className={`neo-group-btn ${
              viewMode === 'preview' ? 'active' : ''
            }`}
            onClick={() => setViewMode('preview')}
            title="Live Preview Only"
          >
            <span>👁️</span> Preview
          </button>
        </div>

        {/* Device Switcher (when preview is visible) */}
        {viewMode !== 'code' && (
          <div className="neo-button-group neo-device-group">
            <button
              type="button"
              className={`neo-group-btn ${
                deviceMode === 'desktop' ? 'active' : ''
              }`}
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View"
            >
              🖥️
            </button>
            <button
              type="button"
              className={`neo-group-btn ${
                deviceMode === 'tablet' ? 'active' : ''
              }`}
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View (768px)"
            >
              📱 Tablet
            </button>
            <button
              type="button"
              className={`neo-group-btn ${
                deviceMode === 'mobile' ? 'active' : ''
              }`}
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View (390px)"
            >
              📱 Mobile
            </button>
          </div>
        )}
      </div>

      {/* Right Primary Actions: Help & Highlighted Publish */}
      <div className="neo-header-actions">
        {/* '?' Help & Tour Button */}
        {onOpenHelpModal && (
          <button
            type="button"
            className="neo-help-btn"
            onClick={onOpenHelpModal}
            title="Help, Quick Steps & Guided Tour"
            aria-label="Help and guided tour"
          >
            ?
          </button>
        )}

        {/* Highlighted Publish button with glowing border */}
        <button
          data-tour="publish"
          type="button"
          className="neo-btn neo-btn-publish neo-btn-glow-green"
          onClick={onOpenPublishModal}
          title="Publish website and copy link directly"
        >
          🚀 Publish
        </button>
      </div>
    </header>
  );
}
