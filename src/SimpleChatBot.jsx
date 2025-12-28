import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ChatProvider, useChatContext } from './ChatContext';
import ChatControlBox from './ChatControlBox';
import MenuDropdown from './MenuDropdown';
import SettingsDropdown from './SettingsDropdown';

// ==================== CHAT APP COMPONENT ====================

function ChatApp() {
  const {
    currentChat,
    addMessage,
    createChat,
  } = useChatContext();

  const [inputMessage, setInputMessage] = React.useState('');
  const [selectedModels, setSelectedModels] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat.messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || selectedModels === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `✅ Message received!\n\n**You said:** "${inputMessage}"\n\n**Chat:** ${currentChat.name}\n**Messages in chat:** ${currentChat.messageCount + 1}\n**Models:** ${selectedModels}\n**Saved:** ${currentChat.isSaved ? 'Yes ✓' : 'No'}\n\nTry the Menu button to access all chat management features!`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      addMessage(aiMessage);
      setIsProcessing(false);
    }, 1000);
  };

  const handleFileUpload = (files) => {
    console.log('Files uploaded:', files);
    const fileNames = files.map(f => f.name).join(', ');
    const message = {
      id: Date.now().toString(),
      content: `📎 Uploaded ${files.length} file(s): ${fileNames}`,
      role: 'system',
      timestamp: new Date().toISOString()
    };
    addMessage(message);
  };

  const handlePresetsClick = () => {
    alert('Presets feature - Coming soon!');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-white">{currentChat.name}</h1>
          <p className="text-sm text-gray-400">
            {selectedModels} model{selectedModels !== 1 ? 's' : ''} •
            {' '}{currentChat.messageCount} message{currentChat.messageCount !== 1 ? 's' : ''} •
            {' '}{currentChat.isSaved ? '💾 Saved' : 'Not saved'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {currentChat.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Bot className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white mb-2">Welcome to SimpleChatBot</h2>
                <p>Start a conversation or explore the menu for more options.</p>
              </div>
              <div className="mt-8 text-left max-w-md mx-auto bg-gray-800 rounded-lg p-6 text-sm">
                <h3 className="font-semibold text-white mb-3">✨ Features:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Chat Management:</strong> Create, rename, save, and archive chats</li>
                  <li>• <strong>Recent Conversations:</strong> Quick access to your recent chats</li>
                  <li>• <strong>Analytics:</strong> View detailed chat statistics</li>
                  <li>• <strong>Export/Import:</strong> Backup and restore your chat data</li>
                  <li>• <strong>Auto-Save:</strong> Toggle automatic chat saving</li>
                  <li>• <strong>File Upload:</strong> Attach files to your messages</li>
                </ul>
              </div>
            </div>
          ) : (
            currentChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.role === 'system'
                      ? 'bg-gray-700 text-gray-300 text-sm'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Control Box */}
      <ChatControlBox
        menuDropdown={<MenuDropdown />}
        settingsDropdown={<SettingsDropdown />}
        onNewChatClick={createChat}
        onModelsToggle={() => setSelectedModels(prev => prev === 0 ? 1 : 0)}
        onPresetsClick={handlePresetsClick}
        onFileUpload={handleFileUpload}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSend={handleSend}
        disabled={isProcessing}
        selectedModels={selectedModels}
        showBotIcon={true}
        messageCount={currentChat.messageCount}
        isSaved={currentChat.isSaved}
      />
    </div>
  );
}

// ==================== MAIN APP WITH PROVIDER ====================

export default function SimpleChatBot() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}
