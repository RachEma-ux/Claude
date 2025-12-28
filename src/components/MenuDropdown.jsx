import { Plus, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const MenuDropdown = ({ isOpen, onClose, onNewChat, onSave, dimensions }) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'New Chat', icon: Plus, onClick: onNewChat },
    { label: 'Rename Chat', icon: Save, onClick: () => toast.info('Rename chat feature coming soon!') },
    { label: 'Save Chat', icon: Save, onClick: onSave },
    { label: 'Clear Chat', icon: Settings, onClick: () => toast.info('Clear chat feature coming soon!') },
    { label: 'Analytics', icon: Settings, onClick: () => toast.info('Analytics feature coming soon!') },
  ];

  const recentConversations = [
    { id: 1, name: 'My Chat 1' },
    { id: 2, name: 'My Chat 2' },
    { id: 3, name: 'My Chat 3' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-gray-800 rounded-xl shadow-2xl z-[9999] border border-gray-700 overflow-hidden">
        {/* Main Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isDelete = item.label.includes('Delete');

          return (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors ${
                isDelete
                  ? 'text-red-400 hover:bg-gray-700'
                  : 'text-gray-200 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="border-t border-gray-700 my-1" />

        {/* Delete Option */}
        <button
          onClick={() => {
            toast.error('Delete chat feature coming soon!');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors text-red-400 hover:bg-gray-700"
        >
          <Settings className="w-4 h-4" />
          <span>Delete Chat</span>
        </button>

        {/* Recent Conversations Section */}
        <div className="border-t border-gray-700 mt-1">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400">
            RECENT CONVERSATIONS
          </div>
          {recentConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                toast.info(`Loading ${conv.name}...`);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors text-gray-200 hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {conv.name}
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              toast.info('View all saved conversations feature coming soon!');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors text-gray-200 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            <span>View All Saved</span>
          </button>
          <button
            onClick={() => {
              toast.info('Archive feature coming soon!');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors text-gray-200 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            <span>Archive (0)</span>
          </button>
        </div>
      </div>
    </>
  );
};
