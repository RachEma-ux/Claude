# Installing Simple Chatbot on Termux (Android)

This guide will help you install and run the Simple Chatbot on your Android device using Termux.

## 📱 What is Termux?

Termux is a powerful terminal emulator for Android that provides a Linux environment. You can run Node.js applications directly on your Android device!

---

## 🚀 Quick Installation

### Step 1: Install Termux

Download Termux from [F-Droid](https://f-droid.org/packages/com.termux/) (recommended) or Google Play Store.

### Step 2: Update Termux Packages

Open Termux and run:
```bash
pkg update && pkg upgrade
```

Type `y` when prompted to confirm.

### Step 3: Install Node.js and Git

```bash
pkg install nodejs git
```

This will install:
- Node.js (JavaScript runtime)
- npm (package manager)
- Git (version control)

### Step 4: Grant Storage Permission (Optional)

To save files to your device storage:
```bash
termux-setup-storage
```

Tap "Allow" when prompted.

### Step 5: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Claude.git
cd Claude
```

Replace `YOUR_USERNAME` with the actual repository owner.

### Step 6: Run the One-Tap Installer

```bash
chmod +x install.sh
./install.sh
```

The installer will:
- ✅ Check Node.js and npm
- ✅ Install all dependencies
- ✅ Ask if you want to start the server

### Step 7: Access the App

When the server starts, open your browser and navigate to:
```
http://localhost:3000
```

Or use:
```
http://127.0.0.1:3000
```

---

## 🎯 Manual Installation (Alternative)

If you prefer manual installation:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open your Android browser and go to `http://localhost:3000`

---

## 📝 Termux-Specific Tips

### Keep Termux Running in Background

Termux needs to stay open for the server to run. To prevent Android from killing the app:

1. **Acquire Wakelock** (keeps Termux awake):
```bash
termux-wake-lock
```

2. **Run in Background**: Minimize Termux but don't swipe it away

3. **Release Wakelock** (when done):
```bash
termux-wake-unlock
```

### Access from Other Devices

To access the chatbot from other devices on your network:

1. **Find your device IP**:
```bash
ifconfig
```

Look for your WiFi IP (usually starts with 192.168.x.x)

2. **Access from another device**:
```
http://YOUR_DEVICE_IP:3000
```

Example: `http://192.168.1.100:3000`

### Save Battery

When not using the server:

1. Stop the server: Press `Ctrl+C` in Termux
2. Release wakelock: `termux-wake-unlock`

---

## 🛠️ Troubleshooting

### "Command not found: node"

Node.js is not installed. Run:
```bash
pkg install nodejs
```

### "Permission denied" when running install.sh

Make the script executable:
```bash
chmod +x install.sh
```

### "Port 3000 already in use"

Kill the process using the port:
```bash
# Find the process
lsof -i :3000

# Kill it (replace PID with actual process ID)
kill -9 PID
```

Or edit `vite.config.js` to use a different port.

### App won't open in browser

Try these URLs:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://0.0.0.0:3000`

### "Cannot find module" errors

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Out of storage space

Check available space:
```bash
df -h
```

Clean npm cache:
```bash
npm cache clean --force
```

### Termux keeps closing

1. Disable battery optimization for Termux
2. Use wakelock: `termux-wake-lock`
3. Keep Termux in foreground or recent apps

---

## 🔧 Useful Termux Commands

### Package Management
```bash
# Update packages
pkg update && pkg upgrade

# Search for packages
pkg search package-name

# Install package
pkg install package-name

# Remove package
pkg uninstall package-name
```

### File Management
```bash
# List files
ls -la

# Change directory
cd folder-name

# Go to home
cd ~

# Go to storage
cd ~/storage/shared
```

### Process Management
```bash
# List running processes
ps aux

# Kill process
kill -9 PID

# See running npm processes
ps aux | grep node
```

---

## 📱 Recommended Termux Setup

### Install Additional Tools

```bash
# Text editor (choose one)
pkg install nano          # Simple editor
pkg install vim           # Advanced editor

# File utilities
pkg install tree          # View directory structure
pkg install htop          # Process monitor
```

### Create Shortcuts

Add to `~/.bashrc`:
```bash
alias chatbot="cd ~/Claude && npm run dev"
alias chatbot-stop="pkill node"
```

Then reload:
```bash
source ~/.bashrc
```

Now you can start the chatbot with just:
```bash
chatbot
```

---

## 🌐 Building for Production

To create a production build:

```bash
npm run build
```

Serve the production build:
```bash
npm run preview
```

---

## 💡 Performance Tips

### On Low-End Devices

1. **Close other apps** before starting the server
2. **Use lightweight browser** (Chrome Lite, Firefox Focus)
3. **Disable animations** in Tailwind config if needed
4. **Limit concurrent processes**

### Optimize Node.js

Set Node.js memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=512"
npm run dev
```

---

## 🔒 Security Notes

- The dev server is **not secure** for public internet
- Only use on trusted WiFi networks
- Don't expose port 3000 to the internet
- Use for local development only

---

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Visit [Termux Wiki](https://wiki.termux.com/)
3. Check Node.js version: `node -v` (should be 18+)
4. Check npm version: `npm -v`
5. Review browser console (F12 or DevTools)

---

## 🎉 Success!

Once everything is running, you should see:
- Termux running the dev server
- Browser showing the Simple Chatbot
- Ability to send and receive messages

**Enjoy your Simple Chatbot on Android!** 📱✨

---

## 📚 Additional Resources

- [Termux Official Wiki](https://wiki.termux.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Need more help?** Open an issue on the GitHub repository!
