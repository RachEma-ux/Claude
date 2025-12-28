import { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ChatControlBox } from '@/components/ChatControlBox';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '👋 Welcome to the Advanced Chat!\n\n✨ Features:\n• Proportional responsive design\n• Dropdown menus for Menu and Settings\n• Auto-growing textarea\n• Toast notifications\n• File upload support\n• Model selection\n\nTry it out!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModels, setSelectedModels] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || selectedModels === 0) {
      if (selectedModels === 0) {
        toast.error('Please select a model first');
      }
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    toast.success('Message sent!');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `✅ Message received!\n\n**You said:** "${inputMessage}"\n\n**Models:** ${selectedModels}\n\nThis is using the new ChatControlBox with toast notifications and improved architecture!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: '👋 New chat started! How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputMessage('');
    toast.success('New chat started');
  };

  const handleSave = () => {
    toast.success(`Conversation saved! (${messages.length} messages)`, {
      description: 'Your chat history has been saved successfully',
    });
  };

  const handleModelsToggle = () => {
    setSelectedModels((prev) => {
      const newValue = prev === 0 ? 1 : 0;
      if (newValue === 0) {
        toast.warning('No models selected');
      } else {
        toast.success(`${newValue} model selected`);
      }
      return newValue;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">Advanced Chat</h1>
            <p className="text-sm text-gray-400">
              {selectedModels} model{selectedModels !== 1 ? 's' : ''} • {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
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

      {/* Chat Control Box */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <ChatControlBox
            onMenuClick={() => {}}
            onNewChatClick={handleNewChat}
            onModelsToggle={handleModelsToggle}
            onPresetsClick={() => toast.info('Presets feature coming soon!')}
            onSettingsClick={() => {}}
            onSaveClick={handleSave}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSend={handleSend}
            disabled={isProcessing}
            selectedModels={selectedModels}
            showBotIcon={true}
            messagesCount={messages.length}
          />
        </div>
      </div>
    </div>
  );
}
