import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsDropdown = ({ isOpen, onClose, dimensions }) => {
  if (!isOpen) return null;

  const settingsItems = [
    { label: 'Presets Setting', icon: Settings, onClick: () => toast.info('Presets settings coming soon!') },
    { label: 'Theme', onClick: () => toast.info('Theme settings coming soon!') },
    { label: 'Export Data', icon: Save, onClick: () => toast.success('Export data feature coming soon!') },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute bottom-full right-0 mb-2 w-[220px] bg-gray-800 rounded-xl shadow-2xl z-[9999] border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-200 m-0">Settings</h3>
        </div>

        {/* Settings Items */}
        {settingsItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-sm text-left transition-colors text-gray-200 hover:bg-gray-700"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
