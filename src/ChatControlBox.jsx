import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, Plus, Settings, Paperclip, Bot, Mic, Plug, Save } from 'lucide-react';

// ==================== CUSTOM SEND ICON ====================

const SendIcon = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    aria-hidden="true"
    className={className}
    style={style}
  >
    <path
      d="
        M12 2
        L18 10
        L13.5 9.5
        L13.5 18
        Q13.5 21 12 21
        Q10.5 21 10.5 18
        L10.5 9.5
        L6 10
        Z
      "
    />
  </svg>
);

// ==================== PROPORTIONALITY SYSTEM ====================

const RATIOS = {
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

function calculateProportionalDimensions(screenWidth) {
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

function useResponsive() {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

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

// ==================== BUTTON COMPONENT ====================

const Button = ({ children, onClick, disabled = false, variant = 'default', className = '', style, title }) => {
  const baseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variantClass = variant === 'ghost'
    ? "hover:bg-gray-700 text-gray-400"
    : variant === 'minimal-ghost'
    ? "hover:bg-gray-800 text-gray-400"
    : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
};

// ==================== HYBRID CHAT CONTROL BOX ====================

/**
 * Hybrid ChatControlBox Component
 *
 * Accepts dropdown components as render props while maintaining simple architecture.
 * Parent controls dropdown content and actions, component handles UI state.
 *
 * @param {React.ReactNode} menuDropdown - Menu dropdown component (receives onClose prop)
 * @param {React.ReactNode} settingsDropdown - Settings dropdown component (receives onClose prop)
 * @param {function} onNewChatClick - Callback for new chat button
 * @param {function} onModelsToggle - Callback for models toggle
 * @param {function} onPresetsClick - Callback for presets button
 * @param {function} onFileUpload - Callback for file upload (receives File[])
 * @param {string} inputMessage - Current input value
 * @param {function} onInputChange - Input change callback
 * @param {function} onSend - Send message callback
 * @param {boolean} disabled - Disable input
 * @param {number} selectedModels - Number of selected models
 * @param {boolean} showBotIcon - Show bot icon in toolbar
 * @param {number} messageCount - Number of messages in current chat
 * @param {boolean} isSaved - Whether current chat is saved
 */
const ChatControlBox = ({
  // Dropdown render props (Hybrid Approach)
  menuDropdown = null,
  settingsDropdown = null,

  // Traditional callbacks
  onNewChatClick,
  onModelsToggle,
  onPresetsClick,
  onFileUpload,

  // Input props
  inputMessage,
  onInputChange,
  onSend,

  // State props
  disabled = false,
  selectedModels = 1,
  showBotIcon = true,
  messageCount = 0,
  isSaved = false,
}) => {
  const { isMobile, dimensions } = useResponsive();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  // Dropdown state
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target) &&
        !settingsButtonRef.current?.contains(event.target)
      ) {
        setShowMenuDropdown(false);
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-growing textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, dimensions.maxInputHeight);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage, dimensions.maxInputHeight]);

  // Handlers
  const handleMenuClick = () => {
    setShowMenuDropdown(!showMenuDropdown);
    setShowSettingsDropdown(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
    setShowMenuDropdown(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
  };

  const closeDropdowns = () => {
    setShowMenuDropdown(false);
    setShowSettingsDropdown(false);
  };

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-visible"
      style={{
        padding: `${dimensions.containerPadding}px`,
        margin: `${dimensions.gap}px`,
        boxSizing: 'border-box',
        width: `calc(100% - ${dimensions.gap * 2}px)`
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between mb-3 relative"
        style={{ gap: `${dimensions.gap}px` }}
      >
        {/* Menu Button with Dropdown */}
        <div className="relative">
          <Button
            ref={menuButtonRef}
            onClick={handleMenuClick}
            variant="minimal-ghost"
            style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }}
            title="Menu"
          >
            <Menu style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>

          {/* Menu Dropdown */}
          {showMenuDropdown && menuDropdown && (
            <div ref={dropdownContainerRef} className="relative">
              {React.cloneElement(menuDropdown, { onClose: closeDropdowns })}
            </div>
          )}
        </div>

        {/* New Chat */}
        {onNewChatClick && (
          <Button
            onClick={onNewChatClick}
            variant="minimal-ghost"
            style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }}
            title="New Chat"
          >
            <Plus style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

        {/* Models Toggle */}
        {onModelsToggle && (
          <Button
            onClick={onModelsToggle}
            style={{
              height: `${dimensions.toolbarIconButton}px`,
              minWidth: '85px',
              fontSize: `${dimensions.fontSize}px`,
              paddingLeft: `${dimensions.containerPadding}px`,
              paddingRight: `${dimensions.containerPadding}px`,
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className={selectedModels > 0 ? "bg-blue-600 hover:bg-blue-500 border-blue-600" : ""}
            title="Toggle Models"
          >
            {selectedModels} Model{selectedModels !== 1 ? 's' : ''}
          </Button>
        )}

        {/* Bot Icon */}
        {showBotIcon && (
          <Button
            variant="minimal-ghost"
            style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }}
            className="text-cyan-400 hover:text-cyan-300"
            title="AI Active"
            disabled
          >
            <Bot style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

        {/* Settings Button with Dropdown */}
        <div className="relative">
          <Button
            ref={settingsButtonRef}
            onClick={handleSettingsClick}
            variant="minimal-ghost"
            style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }}
            title="Settings"
          >
            <Settings style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>

          {/* Settings Dropdown */}
          {showSettingsDropdown && settingsDropdown && (
            <div className="relative">
              {React.cloneElement(settingsDropdown, { onClose: closeDropdowns })}
            </div>
          )}
        </div>

        {/* Save Indicator */}
        <div
          className={`flex items-center justify-center ${isSaved ? 'text-green-400' : 'text-gray-600'}`}
          style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }}
          title={isSaved ? 'Chat is saved' : 'Not saved'}
        >
          <Save style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
        </div>

        {/* Presets */}
        {onPresetsClick && (
          <Button
            onClick={onPresetsClick}
            style={{
              height: `${dimensions.toolbarIconButton}px`,
              minWidth: '95px',
              fontSize: `${dimensions.fontSize}px`,
              paddingLeft: `${dimensions.containerPadding}px`,
              paddingRight: `${dimensions.containerPadding}px`,
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="bg-stone-300 hover:bg-stone-200 text-zinc-800 border-stone-300"
            title="Presets"
          >
            Presets
          </Button>
        )}
      </div>

      {/* Input Container */}
      <div className="bg-gray-100 rounded-2xl" style={{
        padding: `${dimensions.gap}px`,
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => {
            onInputChange(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={selectedModels === 0 ? "Select models first..." : "Type your message..."}
          disabled={disabled || selectedModels === 0}
          className="w-full bg-transparent border-0 outline-none resize-none text-gray-900 placeholder-gray-400"
          style={{
            fontSize: `${dimensions.fontSize}px`,
            minHeight: `${dimensions.inputHeight}px`,
            maxHeight: `${dimensions.maxInputHeight}px`,
            lineHeight: '1.5',
            paddingTop: '4px',
            paddingBottom: '1px',
            marginBottom: `${dimensions.gap}px`
          }}
          rows={1}
        />

        {/* Icons Row */}
        <div className="flex items-center justify-between">
          {/* Left Icons */}
          <div className="flex items-center" style={{ gap: `${dimensions.gap * 0.3}px` }}>
            <Button
              onClick={handleFileClick}
              variant="ghost"
              style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0 }}
              title="Attach Files"
            >
              <Paperclip style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px`, transform: 'rotate(-45deg)' }} className="text-gray-500" />
            </Button>

            <Button
              variant="ghost"
              style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0 }}
              title="Connect"
            >
              <Plug style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-500" />
            </Button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center" style={{ gap: `${dimensions.gap * 0.3}px` }}>
            <Button
              variant="ghost"
              style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0 }}
              title="Voice"
            >
              <Mic style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-500" />
            </Button>

            <Button
              onClick={onSend}
              disabled={disabled || !inputMessage.trim() || selectedModels === 0}
              variant="ghost"
              style={{
                height: `${dimensions.inputHeight}px`,
                width: `${dimensions.inputHeight}px`,
                padding: 0
              }}
              title="Send"
            >
              <SendIcon style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-900" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatControlBox;
export { useResponsive, RATIOS, calculateProportionalDimensions, SendIcon, Button };
