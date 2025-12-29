import React, { useState } from 'react';
import { useChatContext } from './ChatContext';

const SettingsDropdown = ({ onClose }) => {
  const { settings, updateSettings, exportChatData, importChatData, currentChat } = useChatContext();
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);

  const handleToggleAutoSave = () => {
    updateSettings(prev => ({ ...prev, autoSave: !prev.autoSave }));
  };

  const handleThemeChange = (theme) => {
    updateSettings(prev => ({ ...prev, theme }));
    setShowThemeSubmenu(false);
    onClose();
  };

  const handleExportCurrentChat = () => {
    exportChatData(currentChat.id);
    onClose();
  };

  const handleExportAllChats = () => {
    exportChatData();
    onClose();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          importChatData(data);
          alert('Chat data imported successfully!');
        } catch (error) {
          alert('Failed to import chat data. Please check the file format.');
          console.error('Import error:', error);
        }
      }
    };
    input.click();
    onClose();
  };

  return (
    <div className="absolute right-0 bottom-full mb-4 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[9998] overflow-visible">
      <div className="py-1">
        {/* Auto-Save Toggle */}
        <button
          onClick={handleToggleAutoSave}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span>💾</span>
            <span>Auto-Save</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            settings.autoSave ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {settings.autoSave ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemeSubmenu(!showThemeSubmenu)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>🎨</span>
              <span>Theme</span>
            </span>
            <span className="text-xs text-gray-400">
              {settings.theme === 'light' ? '☀️' : settings.theme === 'dark' ? '🌙' : '🔄'}
            </span>
          </button>

          {/* Theme Submenu */}
          {showThemeSubmenu && (
            <div className="absolute left-full top-0 ml-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  settings.theme === 'light' ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  settings.theme === 'dark' ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => handleThemeChange('auto')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  settings.theme === 'auto' ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                🔄 Auto
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-1"></div>

        {/* Export Current Chat */}
        <button
          onClick={handleExportCurrentChat}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📤</span>
          <span>Export Current Chat</span>
        </button>

        {/* Export All */}
        <button
          onClick={handleExportAllChats}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📦</span>
          <span>Export All Data</span>
        </button>

        {/* Import */}
        <button
          onClick={handleImport}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📥</span>
          <span>Import Data</span>
        </button>

        {/* Divider */}
        <div className="border-t border-gray-200 my-1"></div>

        {/* Clear All Data */}
        <button
          onClick={() => {
            if (window.confirm('⚠️ Clear ALL chat data? This cannot be undone!')) {
              localStorage.clear();
              window.location.reload();
            }
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>Clear All Data</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsDropdown;
