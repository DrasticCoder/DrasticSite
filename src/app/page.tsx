'use client';

import { useState } from 'react';
import StudioHeader, {
  ViewMode,
  DeviceMode,
} from '@/components/StudioHeader';
import LiveEditor from '@/components/LiveEditor';
import AiModal from '@/components/AiModal';
import PublishModal from '@/components/PublishModal';
import HelpModal from '@/components/HelpModal';
import OnboardingTour from '@/components/OnboardingTour';
import './studio.css';

export default function HomePage() {
  // Directly open the AI modal on initial load as requested
  const [isAiModalOpen, setIsAiModalOpen] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAiSuccess = (slug: string) => {
    showToast(`⚡ Generated site for "${slug}"! Tweak code or hit Publish.`);
  };

  const handleStartTour = () => {
    setIsAiModalOpen(false);
    setIsPublishModalOpen(false);
    setIsHelpModalOpen(false);
    setIsTourActive(true);
  };

  return (
    <div className="neo-studio-container">
      {/* Neo-brutalist Header Bar */}
      <StudioHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main Workspace with Resizable Splitter */}
      <LiveEditor
        viewMode={viewMode}
        deviceMode={deviceMode}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* AI Generation Modal (Active by default on page load) */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerateSuccess={handleAiSuccess}
      />

      {/* Publish & Link Copy Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Help & Quick Steps Modal ('?' button) */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onStartTour={handleStartTour}
      />

      {/* Interactive Guided Onboarding Tour */}
      <OnboardingTour
        isActive={isTourActive}
        onClose={() => {
          setIsTourActive(false);
          showToast('Tour completed! You are ready to build.');
        }}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="neo-toast-banner" role="status">
          <span>🎉</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
