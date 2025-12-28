# Simple Chat Bot

A responsive React chatbot application with proportionality-based layout system, custom send icon, and clean modern design.

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

### Design Features
- **Custom Send Icon**: Unique SVG arrow design
- **Proportionality-Based Layout**: All dimensions scale with screen width
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, dark-themed interface
- **Auto-growing Input**: Textarea expands as you type

### Layout Features
- **Toolbar**: 7 dynamically spaced controls (justify-between)
- **Input Area**: Textarea above, icons below
- **Icon Organization**:
  - Left: Attach, Connect
  - Right: Voice, Send
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

### Technical Features
- Built with React 18
- Vite for fast development
- Tailwind CSS for styling
- Lucide React icons
- Proportional scaling system (RATIOS-based)
- Debounced resize handling (150ms)
- Mobile-responsive touch targets (min 44px)

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
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main App component
│   ├── SimpleChatBot.jsx   # Main chatbot component
│   ├── ChatControlBox.jsx  # Reusable control box (optional)
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles + Tailwind
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config (with custom animations)
├── postcss.config.js   # PostCSS configuration
├── install.sh          # One-tap install (Unix/Linux/Mac)
├── install.bat         # One-tap install (Windows)
└── README.md          # This file
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

### SimpleChatBot (Main Component)
- Manages message state
- Handles send functionality
- Renders chat interface
- Responsive layout

### ChatControlBox (Reusable Component)
Available in `src/ChatControlBox.jsx` for custom implementations:
```javascript
<ChatControlBox
  toolbarItems={<>...custom toolbar...</>}
  inputLeftControls={<>...left icons...</>}
  inputRightControls={<>...right icons...</>}
  inputMessage={message}
  onInputChange={setMessage}
  onSend={handleSend}
/>
```

### Custom SendIcon Component
```javascript
const SendIcon = ({ className, style }) => (
  <svg>...</svg>
);
```

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
