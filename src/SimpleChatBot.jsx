import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, Plus, Settings, Paperclip, ArrowUp, Bot, Mic, Plug, Save } from 'lucide-react';

// ==================== PROPORTIONALITY SYSTEM ====================

const RATIOS = {
  toolbarIconButton: 0.65,
  toolbarIcon: 0.60,
  inputIcon: 0.458,
  sendIcon: 0.417,
  modelsButton: 0.65,
  sendButton: 0.75,
  sendButtonMobile: 0.917,
  gap: 0.32,
  padding: 0.25,
  inputHeight: 0.917,
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
    inputHeight: Math.max(40, masterRowHeight * RATIOS.inputHeight),
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

// ==================== CHAT CONTROL BOX ====================

const ChatControlBox = ({
  onMenuClick,
  onNewChatClick,
  onModelsToggle,
  onPresetsClick,
  onSettingsClick,
  onSaveClick,
  inputMessage,
  onInputChange,
  onSend,
  disabled = false,
  selectedModels = 1,
  showBotIcon = true,
}) => {
  const { isMobile, dimensions } = useResponsive();
  const textareaRef = useRef(null);

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

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
      style={{
        padding: `${dimensions.containerPadding}px`,
        margin: `${dimensions.gap}px`,
        boxSizing: 'border-box',
        width: `calc(100% - ${dimensions.gap * 2}px)`
      }}
    >
      {/* Toolbar - LAST GOOD VERSION with justify-between */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ gap: `${dimensions.gap}px` }}
      >
        {onMenuClick && (
          <Button onClick={onMenuClick} variant="minimal-ghost" style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }} title="Menu">
            <Menu style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

        {onNewChatClick && (
          <Button onClick={onNewChatClick} variant="minimal-ghost" style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }} title="New Chat">
            <Plus style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

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

        {onSettingsClick && (
          <Button onClick={onSettingsClick} variant="minimal-ghost" style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }} title="Settings">
            <Settings style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

        {onSaveClick && (
          <Button onClick={onSaveClick} disabled={disabled} variant="minimal-ghost" style={{ height: `${dimensions.toolbarIconButton}px`, width: `${dimensions.toolbarIconButton}px` }} title="Save">
            <Save style={{ height: `${dimensions.toolbarIcon}px`, width: `${dimensions.toolbarIcon}px` }} />
          </Button>
        )}

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

      {/* Input Row */}
      <div className="flex items-end" style={{ gap: `${dimensions.gap}px`, maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="flex-1 bg-gray-100 rounded-2xl flex items-end" style={{
          paddingTop: `${dimensions.gap}px`,
          paddingLeft: `${dimensions.gap}px`,
          paddingRight: `${dimensions.gap}px`,
          paddingBottom: `${dimensions.gap * 0.3}px`,
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <Button variant="ghost" style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0, flexShrink: 0 }} title="Attach">
            <Paperclip style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px`, transform: 'rotate(-45deg)' }} className="text-gray-500" />
          </Button>

          <Button variant="ghost" style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0, marginLeft: `${dimensions.gap * 0.1}px`, flexShrink: 0 }} title="Connect">
            <Plug style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-500" />
          </Button>

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
            className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-900 placeholder-gray-400"
            style={{
              marginLeft: `${dimensions.gap}px`,
              marginRight: `${dimensions.gap}px`,
              fontSize: `${dimensions.fontSize}px`,
              minHeight: `${dimensions.inputHeight}px`,
              maxHeight: `${dimensions.maxInputHeight}px`,
              lineHeight: '1.5',
              paddingTop: '8px',
              paddingBottom: '4px'
            }}
            rows={1}
          />

          <Button variant="ghost" style={{ height: `${dimensions.inputHeight}px`, width: `${dimensions.inputHeight}px`, padding: 0, flexShrink: 0 }} title="Voice">
            <Mic style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-500" />
          </Button>

          <Button
            onClick={onSend}
            disabled={disabled || !inputMessage.trim() || selectedModels === 0}
            variant="ghost"
            style={{
              height: `${dimensions.inputHeight}px`,
              width: `${dimensions.inputHeight}px`,
              padding: 0,
              marginLeft: `${dimensions.gap * 0.1}px`,
              flexShrink: 0
            }}
            title="Send"
          >
            <ArrowUp style={{ height: `${dimensions.inputIcon}px`, width: `${dimensions.inputIcon}px` }} className="text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================

export default function SimpleChatBot() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: '👋 Last Good Working Version!\n\n✨ This version uses justify-between layout:\n• All 7 buttons dynamically spaced\n• No fixed positioning\n• Bot icon shows when models > 0\n• This was working before the break\n\nTest it now!',
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModels, setSelectedModels] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || selectedModels === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `✅ Received!\n\n**You said:** "${inputMessage}"\n\n**Models:** ${selectedModels}\n\nThis is the LAST GOOD VERSION with justify-between layout. All 7 buttons should be visible!`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Last Good Working Version</h1>
            <p className="text-gray-400">
              {selectedModels} model{selectedModels !== 1 ? 's' : ''} • {messages.length} message{messages.length !== 1 ? 's' : ''} • justify-between layout
            </p>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatControlBox
        onMenuClick={() => alert('Menu clicked')}
        onNewChatClick={() => alert('New chat clicked')}
        onModelsToggle={() => setSelectedModels(prev => prev === 0 ? 1 : 0)}
        onPresetsClick={() => alert('Presets clicked')}
        onSettingsClick={() => alert('Settings clicked')}
        onSaveClick={() => alert('Save clicked')}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSend={handleSend}
        disabled={isProcessing}
        selectedModels={selectedModels}
        showBotIcon={true}
      />
    </div>
  );
}
