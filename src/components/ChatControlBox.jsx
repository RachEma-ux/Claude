import { useState, useRef, useEffect } from 'react';
import { Menu, Plus, Settings, Paperclip, Bot, Mic, Plug, Save } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from './Button';
import { SendIcon } from './icons/SendIcon';
import { MenuDropdown } from './MenuDropdown';
import { SettingsDropdown } from './SettingsDropdown';

export const ChatControlBox = ({
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
  messagesCount = 0,
}) => {
  const { isMobile, dimensions } = useResponsive();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-2xl"
      style={{
        padding: `${dimensions.containerPadding}px`,
        margin: `${dimensions.gap}px`,
        boxSizing: 'border-box',
        width: `calc(100% - ${dimensions.gap * 2}px)`,
        overflow: 'visible'
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ gap: `${dimensions.gap}px` }}
      >
        {/* Menu Button with Dropdown */}
        {onMenuClick && (
          <div className="relative">
            <Button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              variant="minimal-ghost"
              style={{
                height: `${dimensions.toolbarIconButton}px`,
                width: `${dimensions.toolbarIconButton}px`
              }}
              title="Menu"
            >
              <Menu style={{
                height: `${dimensions.toolbarIcon}px`,
                width: `${dimensions.toolbarIcon}px`
              }} />
            </Button>

            <MenuDropdown
              isOpen={showMenuDropdown}
              onClose={() => setShowMenuDropdown(false)}
              onNewChat={onNewChatClick}
              onSave={onSaveClick}
              dimensions={dimensions}
            />
          </div>
        )}

        {onNewChatClick && (
          <Button
            onClick={onNewChatClick}
            variant="minimal-ghost"
            style={{
              height: `${dimensions.toolbarIconButton}px`,
              width: `${dimensions.toolbarIconButton}px`
            }}
            title="New Chat"
          >
            <Plus style={{
              height: `${dimensions.toolbarIcon}px`,
              width: `${dimensions.toolbarIcon}px`
            }} />
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

        {showBotIcon && selectedModels > 0 && (
          <Button
            variant="minimal-ghost"
            style={{
              height: `${dimensions.toolbarIconButton}px`,
              width: `${dimensions.toolbarIconButton}px`
            }}
            className="text-cyan-400 hover:text-cyan-300"
            title="AI Active"
            disabled
          >
            <Bot style={{
              height: `${dimensions.toolbarIcon}px`,
              width: `${dimensions.toolbarIcon}px`
            }} />
          </Button>
        )}

        {/* Settings Button with Dropdown */}
        {onSettingsClick && (
          <div className="relative">
            <Button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              variant="minimal-ghost"
              style={{
                height: `${dimensions.toolbarIconButton}px`,
                width: `${dimensions.toolbarIconButton}px`
              }}
              title="Settings"
            >
              <Settings style={{
                height: `${dimensions.toolbarIcon}px`,
                width: `${dimensions.toolbarIcon}px`
              }} />
            </Button>

            <SettingsDropdown
              isOpen={showSettingsDropdown}
              onClose={() => setShowSettingsDropdown(false)}
              dimensions={dimensions}
            />
          </div>
        )}

        {onSaveClick && (
          <Button
            onClick={onSaveClick}
            disabled={disabled || messagesCount === 0}
            variant="minimal-ghost"
            style={{
              height: `${dimensions.toolbarIconButton}px`,
              width: `${dimensions.toolbarIconButton}px`
            }}
            title="Save"
          >
            <Save style={{
              height: `${dimensions.toolbarIcon}px`,
              width: `${dimensions.toolbarIcon}px`
            }} />
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

      {/* Input Container */}
      <div
        className="bg-gray-100 rounded-2xl"
        style={{
          padding: `${dimensions.gap}px`,
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              // File upload handling will be implemented
              console.log('Files selected:', files);
            }
            e.target.value = '';
          }}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => {
            onInputChange(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
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
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              style={{
                height: `${dimensions.inputHeight}px`,
                width: `${dimensions.inputHeight}px`,
                padding: 0
              }}
              title="Attach"
            >
              <Paperclip
                style={{
                  height: `${dimensions.inputIcon}px`,
                  width: `${dimensions.inputIcon}px`,
                  transform: 'rotate(-45deg)'
                }}
                className="text-gray-500"
              />
            </Button>

            <Button
              variant="ghost"
              style={{
                height: `${dimensions.inputHeight}px`,
                width: `${dimensions.inputHeight}px`,
                padding: 0
              }}
              title="Connect"
            >
              <Plug
                style={{
                  height: `${dimensions.inputIcon}px`,
                  width: `${dimensions.inputIcon}px`
                }}
                className="text-gray-500"
              />
            </Button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center" style={{ gap: `${dimensions.gap * 0.3}px` }}>
            <Button
              variant="ghost"
              style={{
                height: `${dimensions.inputHeight}px`,
                width: `${dimensions.inputHeight}px`,
                padding: 0
              }}
              title="Voice"
            >
              <Mic
                style={{
                  height: `${dimensions.inputIcon}px`,
                  width: `${dimensions.inputIcon}px`
                }}
                className="text-gray-500"
              />
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
              <SendIcon
                style={{
                  height: `${dimensions.inputIcon}px`,
                  width: `${dimensions.inputIcon}px`
                }}
                className="text-gray-500"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
