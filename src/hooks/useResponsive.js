import { useState, useEffect, useMemo } from 'react';

// Proportionality ratios for responsive scaling
export const RATIOS = {
  toolbarIconButton: 0.65,
  toolbarIcon: 0.60,
  inputIcon: 0.55,
  sendIcon: 0.417,
  modelsButton: 0.65,
  sendButton: 0.75,
  sendButtonMobile: 0.917,
  gap: 0.16,
  padding: 0.25,
  inputHeight: 0.614,
  fontSize: 0.23,
  maxHeightMultiplier: 4.17
};

export function calculateProportionalDimensions(screenWidth) {
  const minWidth = 320;
  const maxWidth = 1920;
  const minRowHeight = 32;
  const maxRowHeight = 48;

  const normalized = (screenWidth - minWidth) / (maxWidth - minWidth);
  const clamped = Math.max(0, Math.min(1, normalized));
  const masterRowHeight = minRowHeight + (maxRowHeight - minRowHeight) * clamped;

  return {
    rowHeight: masterRowHeight,
    toolbarIconButton: masterRowHeight * RATIOS.toolbarIconButton,
    toolbarIcon: masterRowHeight * RATIOS.toolbarIcon,
    inputIcon: masterRowHeight * RATIOS.inputIcon,
    sendIcon: masterRowHeight * RATIOS.sendIcon,
    modelsButtonHeight: masterRowHeight * RATIOS.modelsButton,
    sendButton: masterRowHeight * RATIOS.sendButton,
    sendButtonMobile: Math.max(44, masterRowHeight * RATIOS.sendButtonMobile),
    gap: masterRowHeight * RATIOS.gap,
    containerPadding: masterRowHeight * RATIOS.padding,
    inputHeight: Math.max(27.5, masterRowHeight * RATIOS.inputHeight),
    maxInputHeight: masterRowHeight * RATIOS.maxHeightMultiplier,
    fontSize: Math.max(14, masterRowHeight * RATIOS.fontSize),
  };
}

export function useResponsive() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenWidth(window.innerWidth);
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const dimensions = useMemo(() =>
    calculateProportionalDimensions(screenWidth),
    [screenWidth]
  );

  return { isMobile, screenWidth, dimensions };
}
