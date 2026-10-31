'use client';

import { useState, useEffect, useCallback } from 'react';

interface TourStep {
  target: string; // selector for data-tour attribute
  title: string;
  description: string;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="brand"]',
    title: '🧱 Welcome to DrasticSite!',
    description:
      'This is your instant AI website studio. Your website subdomain is shown right next to the logo.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ai-prompt"]',
    title: '✨ AI Promptbox',
    description:
      'Click here anytime to reopen the AI promptbox. Describe changes or a new website and it generates the full code instantly!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="code-editor"]',
    title: '💻 Live Code Editor',
    description:
      'Write, edit, and tweak your HTML, CSS, and JS directly. Changes automatically sync to the live preview.',
    placement: 'right',
  },
  {
    target: '[data-tour="resizable-splitter"]',
    title: '↔️ Draggable Splitter',
    description:
      'Drag this divider handle left or right to expand or shrink the code editor and preview panes to any size!',
    placement: 'right',
  },
  {
    target: '[data-tour="preview-pane"]',
    title: '👁️ Live Interactive Preview',
    description:
      'Interact with buttons, navigation, and animations live. Toggle between Desktop, Tablet, and Mobile views in the top bar.',
    placement: 'left',
  },
  {
    target: '[data-tour="publish"]',
    title: '🚀 One-Click Publish & Link Copy',
    description:
      'Click the glowing Publish button to deploy your site live. Your hosted website link is copied directly to your clipboard!',
    placement: 'bottom',
  },
];

interface OnboardingTourProps {
  isActive: boolean;
  onClose: () => void;
}

export default function OnboardingTour({
  isActive,
  onClose,
}: OnboardingTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[currentStepIdx];

  const updateTargetPosition = useCallback(() => {
    if (!isActive || !currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIdx(0);
      setTargetRect(null);
      return;
    }

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    return () => window.removeEventListener('resize', updateTargetPosition);
  }, [isActive, currentStepIdx, updateTargetPosition]);

  if (!isActive || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Calculate card position near target
  const getCardStyle = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const margin = 14;
    const placement = currentStep.placement || 'bottom';

    if (placement === 'bottom') {
      return {
        top: Math.min(window.innerHeight - 240, targetRect.bottom + margin),
        left: Math.max(16, Math.min(window.innerWidth - 360, targetRect.left)),
      };
    }
    if (placement === 'top') {
      return {
        top: Math.max(16, targetRect.top - 220),
        left: Math.max(16, Math.min(window.innerWidth - 360, targetRect.left)),
      };
    }
    if (placement === 'right') {
      return {
        top: Math.max(80, Math.min(window.innerHeight - 240, targetRect.top + 30)),
        left: Math.min(window.innerWidth - 360, targetRect.right + margin),
      };
    }
    if (placement === 'left') {
      return {
        top: Math.max(80, Math.min(window.innerHeight - 240, targetRect.top + 30)),
        left: Math.max(16, targetRect.left - 350 - margin),
      };
    }

    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className="neo-tour-overlay">
      {/* Spotlight cutout / highlight border around target */}
      {targetRect && (
        <div
          className="neo-tour-spotlight"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Tour Step Card */}
      <div className="neo-tour-card" style={getCardStyle()}>
        <div className="neo-tour-header">
          <div className="neo-tour-step-badge">
            STEP {currentStepIdx + 1} OF {TOUR_STEPS.length}
          </div>
          <button
            type="button"
            className="neo-tour-skip-btn"
            onClick={onClose}
            title="Skip tour"
          >
            ✕
          </button>
        </div>

        <h3 className="neo-tour-title">{currentStep.title}</h3>
        <p className="neo-tour-desc">{currentStep.description}</p>

        <div className="neo-tour-footer">
          <button
            type="button"
            className="neo-tour-btn-text"
            onClick={onClose}
          >
            Skip Tour
          </button>

          <div className="neo-tour-nav-btns">
            {currentStepIdx > 0 && (
              <button
                type="button"
                className="neo-btn neo-btn-sm neo-btn-secondary"
                onClick={handlePrev}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              className="neo-btn neo-btn-sm neo-btn-primary neo-btn-glow-yellow"
              onClick={handleNext}
            >
              {currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish Tour 🎉' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
