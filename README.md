# Simple Chat Bot

A fully-featured React chatbot application with advanced chat management, proportionality-based layout system, and clean modern design. Features include multiple chat sessions, saving/archiving, analytics, import/export, and more!

## ⚡ Quick Start - One-Tap Installation

### For macOS/Linux:
```bash
./install.sh
```

### For Windows:
```cmd
install.bat
```

### For Android (Termux):
```bash
chmod +x install.sh
./install.sh
```

📱 **[Full Termux Installation Guide →](TERMUX_INSTALL.md)**

**That's it!** The script will:
- ✅ Check for Node.js and npm
- ✅ Install all dependencies
- ✅ Optionally start the development server
- ✅ Open your browser to `http://localhost:3000`

---

## 🚀 Features

### 💬 Chat Management
- **Multiple Chats**: Create and manage unlimited chat sessions
- **Chat Naming**: Auto-generated names with custom rename functionality
- **Save & Archive**: Save important chats and archive old conversations
- **Recent Conversations**: Quick access to your 3 most recent chats
- **Chat Analytics**: View detailed statistics about your chats
- **Message Count**: Track messages per chat with live updates
- **Chat Switching**: Seamlessly switch between different conversations

### 💾 Data Management
- **Auto-Save**: Optional automatic chat saving
- **Export Chats**: Export individual chats or all data as JSON
- **Import Chats**: Restore chats from exported JSON files
- **Local Storage**: All data persisted locally in browser
- **Data Persistence**: Chats survive page refreshes and browser restarts

### 🎨 Design Features
- **Hybrid Architecture**: Flexible dropdown system with render props
- **Custom Send Icon**: Unique SVG arrow design
- **Proportionality-Based Layout**: All dimensions scale with screen width
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, dark-themed interface with professional dropdowns
- **Auto-growing Input**: Textarea expands as you type
- **Save Indicator**: Visual feedback for saved/unsaved status

### 🎯 Interactive Features
- **Menu Dropdown**: Access to all chat management actions
- **Settings Dropdown**: Configure theme, auto-save, and export/import
- **File Upload**: Attach multiple files to your messages
- **Confirmation Dialogs**: Prevent accidental deletions
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Click-Outside Detection**: Smart dropdown closing

### 📊 Analytics
- Total chat count
- Archived chats count
- Saved chats count
- Total message count
- Average messages per chat
- Oldest and newest chat dates

### 🛠️ Technical Features
- Built with React 18 and Context API
- Vite for fast development
- Tailwind CSS for styling
- Lucide React icons
- Proportional scaling system (RATIOS-based)
- Debounced resize handling (150ms)
- Mobile-responsive touch targets (min 44px)
- LocalStorage-based persistence

---

## 📋 Prerequisites

Before installing, ensure you have:

- **Node.js** (v18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To check if you have them installed:
```bash
node -v
npm -v
```

### For Android (Termux)

1. Install Termux from [F-Droid](https://f-droid.org/packages/com.termux/)
2. Run: `pkg install nodejs git`
3. Follow the [Termux Installation Guide](TERMUX_INSTALL.md)

---

## 🛠️ Manual Installation

If you prefer manual installation:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
Claude/
├── public/                  # Static assets
├── src/
│   ├── App.jsx             # Main App component
│   ├── SimpleChatBot.jsx   # Main chatbot component with ChatProvider
│   ├── ChatContext.jsx     # Chat state management & localStorage
│   ├── ChatControlBox.jsx  # Hybrid control box with dropdowns
│   ├── MenuDropdown.jsx    # Menu dropdown with chat actions
│   ├── SettingsDropdown.jsx # Settings dropdown with theme/export
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS configuration
├── install.sh              # One-tap install (Unix/Linux/Mac)
├── install.bat             # One-tap install (Windows)
├── TERMUX_INSTALL.md       # Android/Termux installation guide
└── README.md               # This file
```

---

## 🎨 Proportionality System

All UI dimensions are calculated from a master row height that scales with screen width:

### RATIOS Configuration
```javascript
const RATIOS = {
  toolbarIconButton: 0.65,    // Toolbar button size
  toolbarIcon: 0.60,          // Icon size in toolbar
  inputIcon: 0.55,            // Icon size in input area
  gap: 0.16,                  // Spacing between elements
  padding: 0.25,              // Container padding
  inputHeight: 0.614,         // Input field height
  fontSize: 0.23,             // Font size
  maxHeightMultiplier: 4.17   // Max textarea height
};
```

### Screen Width Scaling
- **Min Width**: 320px → **32px** master row height
- **Max Width**: 1920px → **48px** master row height
- **Calculation**: Linear interpolation between min/max

### Responsive Breakpoints
- Mobile: < 768px
- Desktop: ≥ 768px
- Large Desktop: > 1440px (same as desktop for now)

---

## 🎯 Component Architecture

### ChatProvider (Context Provider)
Global state management for all chat-related data:
```javascript
<ChatProvider>
  <ChatApp />
</ChatProvider>
```

**Provides:**
- `currentChat` - Active chat object
- `chats` - Array of all chats
- `archivedChats` - Array of archived chats
- `createChat()` - Create new chat
- `renameChat()` - Rename chat
- `saveChat()` - Save chat
- `archiveChat()` - Archive chat
- `deleteChat()` - Delete chat
- `clearChat()` - Clear messages
- `switchChat()` - Switch active chat
- `getAnalytics()` - Get chat statistics
- `exportChatData()` - Export to JSON
- `importChatData()` - Import from JSON

### SimpleChatBot (Main App)
- Wraps app in ChatProvider
- Manages UI state (input, models, processing)
- Handles message sending
- Renders chat interface with header

### ChatControlBox (Hybrid Component)
Accepts dropdown components as render props:
```javascript
<ChatControlBox
  // Dropdowns (render props)
  menuDropdown={<MenuDropdown />}
  settingsDropdown={<SettingsDropdown />}

  // Callbacks
  onNewChatClick={createChat}
  onModelsToggle={toggleModels}
  onFileUpload={handleFiles}

  // Input props
  inputMessage={message}
  onInputChange={setMessage}
  onSend={handleSend}

  // State props
  selectedModels={1}
  messageCount={chat.messageCount}
  isSaved={chat.isSaved}
/>
```

### MenuDropdown Component
Provides chat management actions:
- New Chat
- Rename Chat
- Save Chat
- Clear Chat
- Analytics
- Archive Chat
- Delete Chat
- Recent Conversations (with quick switch)
- View All Saved

### SettingsDropdown Component
Provides app settings:
- Auto-Save toggle
- Theme selection (Light/Dark/Auto)
- Export Current Chat
- Export All Data
- Import Data
- Clear All Data

### Custom Components
- **SendIcon**: Unique SVG arrow icon
- **Button**: Reusable button with variants (ghost, minimal-ghost, default)
- **useResponsive**: Hook for proportional dimensions

---

## 📖 Usage Guide

### Creating a New Chat
1. Click the **Plus (+)** button in the toolbar
2. A new chat is created with auto-generated name
3. Start messaging immediately

### Managing Chats
Click the **Menu** button to access:
- **Rename Chat**: Give your chat a custom name
- **Save Chat**: Mark chat as saved (green indicator appears)
- **Clear Chat**: Remove all messages from current chat
- **Archive Chat**: Move chat to archive
- **Delete Chat**: Permanently delete chat (with confirmation)

### Recent Conversations
The Menu dropdown shows your 3 most recent chats:
- Click any chat to switch to it
- Shows time since last update
- Displays message count
- Currently active chat is highlighted

### Analytics
Click **Analytics** in the Menu to view:
- Total chats
- Archived chats
- Saved chats
- Total messages
- Average messages per chat
- Date range of your chats

### Settings & Data Management
Click the **Settings** button to:
- Toggle **Auto-Save** on/off
- Change **Theme** (Light/Dark/Auto)
- **Export Current Chat** as JSON
- **Export All Data** (all chats + settings)
- **Import Data** from JSON file
- **Clear All Data** (requires confirmation)

### File Uploads
1. Click the **Paperclip** icon
2. Select one or more files
3. Files are logged and can be processed by your backend

### Keyboard Shortcuts
- `Enter` - Send message (desktop)
- `Shift + Enter` - New line in message
- Mobile: Enter always creates new line

---

## 🎨 Customization

### Change Colors

Edit button classes in `SimpleChatBot.jsx`:
```javascript
// Models button when selected
className="bg-blue-600 hover:bg-blue-500 border-blue-600"

// Presets button
className="bg-stone-300 hover:bg-stone-200 text-zinc-800 border-stone-300"
```

### Adjust Proportions

Modify `RATIOS` in `SimpleChatBot.jsx`:
```javascript
const RATIOS = {
  gap: 0.16,           // Change spacing
  inputIcon: 0.55,     // Change icon sizes
  inputHeight: 0.614,  // Change input height
  // ... etc
};
```

### Customize Send Icon

Edit the SVG path in `SendIcon` component:
```javascript
<path d="M12 2 L18 10 ..." />
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Android browsers (Chrome, Firefox)
- ✅ Works in Termux on Android

---

## 📱 Mobile Optimization

- Touch-friendly button sizes (minimum 44px)
- Mobile-specific send button sizing
- Shift+Enter disabled on mobile (Enter always sends)
- Optimized gap and padding for small screens
- Responsive font sizes

---

## ⚙️ Configuration Files

### Tailwind Config (`tailwind.config.js`)
Custom animations and utilities:
- `slide-up`, `slide-down`, `fade-in`, `scale-in`
- `pulse-soft`, `shimmer`, `bounce-soft`, `typing`
- Custom colors (primary blue palette)
- Glow effects and gradients

### Vite Config (`vite.config.js`)
- React plugin enabled
- Dev server on port 3000
- Auto-open browser

---

## 🐛 Troubleshooting

### Installation Issues

**"Node.js not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**"Permission denied"**
```bash
chmod +x install.sh
./install.sh
```

**"npm install fails"**
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**"Port 3000 already in use"**
- Change port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Use different port
}
```

**"Blank screen"**
- Check browser console (F12) for errors
- Ensure all dependencies are installed
- Try clearing browser cache

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all dependencies are up to date
4. Try reinstalling with the install script

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
