import React from 'react';
import { useChatContext } from './ChatContext';

const MenuDropdown = ({ onClose }) => {
  const {
    currentChat,
    createChat,
    renameChat,
    saveChat,
    clearChat,
    deleteChat,
    archiveChat,
    getRecentChats,
    getSavedChats,
    switchChat,
    getAnalytics,
  } = useChatContext();

  const recentChats = getRecentChats(3);
  const savedChats = getSavedChats();

  const handleNewChat = () => {
    createChat();
    onClose();
  };

  const handleRenameChat = () => {
    const newName = prompt('Enter new chat name:', currentChat.name);
    if (newName && newName.trim()) {
      renameChat(currentChat.id, newName.trim());
    }
    onClose();
  };

  const handleSaveChat = () => {
    saveChat(currentChat.id);
    onClose();
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages in this chat?')) {
      clearChat();
    }
    onClose();
  };

  const handleDeleteChat = () => {
    if (window.confirm(`Are you sure you want to delete "${currentChat.name}"? This cannot be undone.`)) {
      deleteChat(currentChat.id);
    }
    onClose();
  };

  const handleArchiveChat = () => {
    if (window.confirm(`Archive "${currentChat.name}"?`)) {
      archiveChat(currentChat.id);
    }
    onClose();
  };

  const handleViewSaved = () => {
    console.log('Saved chats:', savedChats);
    alert(`You have ${savedChats.length} saved chat${savedChats.length !== 1 ? 's' : ''}`);
    onClose();
  };

  const handleAnalytics = () => {
    const analytics = getAnalytics();
    const message = `
📊 Chat Analytics

Total Chats: ${analytics.totalChats}
Archived: ${analytics.totalArchivedChats}
Saved: ${analytics.savedChats}
Total Messages: ${analytics.totalMessages}
Avg Messages/Chat: ${analytics.averageMessagesPerChat}
Oldest Chat: ${analytics.oldestChat}
Newest Chat: ${analytics.newestChat}
    `.trim();
    alert(message);
    onClose();
  };

  const handleSwitchChat = (chatId) => {
    switchChat(chatId);
    onClose();
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="absolute left-0 bottom-full mb-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[9998] overflow-hidden">
      {/* Main Actions */}
      <div className="py-1">
        <button
          onClick={handleNewChat}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          <span>New Chat</span>
        </button>
        <button
          onClick={handleRenameChat}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>✏️</span>
          <span>Rename Chat</span>
        </button>
        <button
          onClick={handleSaveChat}
          disabled={currentChat.isSaved}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>💾</span>
          <span>{currentChat.isSaved ? 'Saved ✓' : 'Save Chat'}</span>
        </button>
        <button
          onClick={handleClearChat}
          disabled={currentChat.messageCount === 0}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🗑️</span>
          <span>Clear Chat</span>
        </button>
        <button
          onClick={handleAnalytics}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📊</span>
          <span>Analytics</span>
        </button>
        <button
          onClick={handleArchiveChat}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📦</span>
          <span>Archive Chat</span>
        </button>
        <button
          onClick={handleDeleteChat}
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
        >
          <span>🗑️</span>
          <span>Delete Chat</span>
        </button>
      </div>

      {/* Recent Conversations */}
      {recentChats.length > 0 && (
        <>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Recent Conversations
            </div>
            {recentChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => handleSwitchChat(chat.id)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                  chat.id === currentChat.id ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="truncate flex-1">{chat.name}</span>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {formatTimeAgo(chat.updatedAt)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {chat.messageCount} message{chat.messageCount !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={handleViewSaved}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-blue-600"
          >
            View All Saved →
          </button>
        </>
      )}
    </div>
  );
};

export default MenuDropdown;
