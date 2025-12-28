import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Data structure for a single chat
const createNewChat = (name = null) => ({
  id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: name || `Chat ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`,
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isArchived: false,
  isSaved: false,
  messageCount: 0,
});

// Storage keys
const STORAGE_KEYS = {
  CHATS: 'simpleChatBot_chats',
  CURRENT_CHAT_ID: 'simpleChatBot_currentChatId',
  ARCHIVED_CHATS: 'simpleChatBot_archivedChats',
  SETTINGS: 'simpleChatBot_settings',
};

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // Load from localStorage or create initial chat
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved chats:', e);
      }
    }
    return [createNewChat()];
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT_ID);
    return saved || chats[0]?.id;
  });

  const [archivedChats, setArchivedChats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARCHIVED_CHATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse archived chats:', e);
      }
    }
    return [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      theme: 'light',
      autoSave: true,
      maxRecentChats: 10,
    };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT_ID, currentChatId);
  }, [currentChatId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARCHIVED_CHATS, JSON.stringify(archivedChats));
  }, [archivedChats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Ensure currentChatId always points to a valid chat
  useEffect(() => {
    if (chats.length > 0) {
      const chatExists = chats.some(chat => chat.id === currentChatId);
      if (!chatExists) {
        console.warn('Current chat ID not found, switching to first chat');
        setCurrentChatId(chats[0].id);
      }
    }
  }, [chats, currentChatId]);

  // Get current chat
  const currentChat = chats.find(chat => chat.id === currentChatId) || chats[0] || null;

  // Create new chat
  const createChat = useCallback((name = null) => {
    const newChat = createNewChat(name);
    console.log('Creating new chat:', newChat);

    // React 18 automatically batches these updates
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);

    console.log('Chat created with ID:', newChat.id);

    return newChat;
  }, []);

  // Rename chat
  const renameChat = useCallback((chatId, newName) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, name: newName, updatedAt: Date.now() }
        : chat
    ));
    console.log('Renamed chat:', chatId, 'to', newName);
  }, []);

  // Add message to current chat
  const addMessage = useCallback((message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, message];
        return {
          ...chat,
          messages: updatedMessages,
          messageCount: updatedMessages.length,
          updatedAt: Date.now(),
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  // Update messages in current chat
  const updateMessages = useCallback((messages) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages,
          messageCount: messages.length,
          updatedAt: Date.now(),
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  // Save chat
  const saveChat = useCallback((chatId) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, isSaved: true, updatedAt: Date.now() }
        : chat
    ));
    console.log('Saved chat:', chatId);
  }, []);

  // Archive chat
  const archiveChat = useCallback((chatId) => {
    const chatToArchive = chats.find(chat => chat.id === chatId);
    if (!chatToArchive) return;

    // Move to archived
    setArchivedChats(prev => [...prev, { ...chatToArchive, isArchived: true }]);

    // Remove from active chats
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);

      // If we archived the current chat, switch to another or create new
      if (chatId === currentChatId) {
        if (filtered.length > 0) {
          setCurrentChatId(filtered[0].id);
        } else {
          // Creating a new chat because we archived the last one
          const newChat = createNewChat();
          setCurrentChatId(newChat.id);
          return [newChat];
        }
      }

      return filtered.length > 0 ? filtered : prev; // Keep at least one chat
    });

    console.log('Archived chat:', chatId);
  }, [chats, currentChatId]);

  // Unarchive chat
  const unarchiveChat = useCallback((chatId) => {
    const chatToUnarchive = archivedChats.find(chat => chat.id === chatId);
    if (!chatToUnarchive) return;

    // Move back to active chats
    setChats(prev => [...prev, { ...chatToUnarchive, isArchived: false }]);

    // Remove from archived
    setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));

    console.log('Unarchived chat:', chatId);
  }, [archivedChats]);

  // Delete chat permanently
  const deleteChat = useCallback((chatId) => {
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);

      // If we deleted the current chat, switch to another or create new
      if (chatId === currentChatId) {
        if (filtered.length > 0) {
          setCurrentChatId(filtered[0].id);
        } else {
          // Creating a new chat because we deleted the last one
          const newChat = createNewChat();
          setCurrentChatId(newChat.id);
          return [newChat];
        }
      }

      return filtered.length > 0 ? filtered : prev; // Keep at least one chat
    });

    console.log('Deleted chat:', chatId);
  }, [currentChatId]);

  // Clear current chat messages
  const clearChat = useCallback(() => {
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId
        ? { ...chat, messages: [], messageCount: 0, updatedAt: Date.now() }
        : chat
    ));
    console.log('Cleared chat:', currentChatId);
  }, [currentChatId]);

  // Switch to different chat
  const switchChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
    console.log('Switched to chat:', chatId);
  }, []);

  // Get recent chats (non-archived, sorted by updatedAt)
  const getRecentChats = useCallback((limit = 5) => {
    return [...chats]
      .filter(chat => !chat.isArchived)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  }, [chats]);

  // Get saved chats
  const getSavedChats = useCallback(() => {
    return chats.filter(chat => chat.isSaved && !chat.isArchived);
  }, [chats]);

  // Export chat data
  const exportChatData = useCallback((chatId = null) => {
    const dataToExport = chatId
      ? chats.find(chat => chat.id === chatId)
      : { chats, archivedChats, settings };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = chatId
      ? `chat_${chatId}_${Date.now()}.json`
      : `all_chats_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Exported chat data');
  }, [chats, archivedChats, settings]);

  // Import chat data
  const importChatData = useCallback((data) => {
    try {
      if (data.chats && Array.isArray(data.chats)) {
        // Importing all chats
        setChats(data.chats);
        if (data.archivedChats) setArchivedChats(data.archivedChats);
        if (data.settings) setSettings(data.settings);
      } else if (data.id && data.messages) {
        // Importing single chat
        setChats(prev => [...prev, data]);
      }
      console.log('Imported chat data');
    } catch (e) {
      console.error('Failed to import chat data:', e);
    }
  }, []);

  // Get analytics
  const getAnalytics = useCallback(() => {
    const totalChats = chats.length;
    const totalArchivedChats = archivedChats.length;
    const totalMessages = chats.reduce((sum, chat) => sum + chat.messageCount, 0);
    const savedChats = chats.filter(chat => chat.isSaved).length;
    const averageMessagesPerChat = totalChats > 0 ? (totalMessages / totalChats).toFixed(1) : 0;

    return {
      totalChats,
      totalArchivedChats,
      totalMessages,
      savedChats,
      averageMessagesPerChat,
      oldestChat: chats.length > 0 ? new Date(Math.min(...chats.map(c => c.createdAt))).toLocaleDateString() : 'N/A',
      newestChat: chats.length > 0 ? new Date(Math.max(...chats.map(c => c.createdAt))).toLocaleDateString() : 'N/A',
    };
  }, [chats, archivedChats]);

  const value = {
    // State
    chats,
    currentChat,
    currentChatId,
    archivedChats,
    settings,

    // Actions
    createChat,
    renameChat,
    addMessage,
    updateMessages,
    saveChat,
    archiveChat,
    unarchiveChat,
    deleteChat,
    clearChat,
    switchChat,

    // Queries
    getRecentChats,
    getSavedChats,
    getAnalytics,

    // Import/Export
    exportChatData,
    importChatData,

    // Settings
    updateSettings: setSettings,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
