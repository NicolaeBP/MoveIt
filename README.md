# 🖱️ MoveIt

**Keep your computer active with intelligent mouse movement**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/NicolaeBP/MoveIt)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey.svg)](https://github.com/NicolaeBP/MoveIt)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-38-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)

---

## 🎯 For Users

### What is MoveIt?

MoveIt is a modern, lightweight desktop application that prevents your computer from going to sleep by intelligently moving your mouse cursor at specified intervals. Perfect for presentations, video calls, monitoring dashboards, or any situation where you need your computer to stay active.

### ✨ Key Features

- 🖱️ **Intelligent Mouse Movement** - Minimal, barely noticeable cursor movements
- ⏰ **Flexible Scheduling** - Set custom schedules for different days and times
- 🌍 **Multi-Language Support** - Available in 12 languages
- 🎨 **Modern UI** - Clean, intuitive interface with dark/light themes
- 📊 **System Tray Integration** - Runs quietly in the background
- 🔒 **Privacy-First** - All processing happens locally, no data collection
- ⚡ **Lightweight** - Minimal system resource usage
- 🖥️ **Cross-Platform** - Works on macOS and Windows

### 📸 Screenshots

*Screenshots and demo GIFs will be added soon*

### 🚀 Installation

#### Download Options

1. **GitHub Releases** *(Recommended)*
   - Download the latest version from [Releases](https://github.com/NicolaeBP/MoveIt/releases)
   - Choose the appropriate file for your platform:
     - `MoveIt Setup.exe` for Windows
     - `MoveIt.dmg` for macOS

2. **Build from Source**
   - See the [Developer Setup](#-developer-setup) section below

#### Installation Steps

**macOS:**
1. Download `MoveIt.dmg`
2. Open the DMG file
3. Drag MoveIt to Applications folder
4. Launch MoveIt from Applications
5. Grant accessibility permissions when prompted

**Windows:**
1. Download `MoveIt Setup.exe`
2. Run the installer
3. Follow the setup wizard
4. Launch MoveIt from Start Menu or Desktop

### 🎮 How to Use

1. **Launch MoveIt** - The app opens with a clean, minimal interface
2. **Set Interval** - Choose how often to move the mouse (1-60 minutes)
3. **Configure Schedule** *(Optional)* - Set specific days and times for movement
4. **Start/Stop** - Click the blue/red button to start or stop mouse movement
5. **System Tray** - Minimize to tray for background operation

### 🔧 First-Time Setup

**Accessibility Permissions (macOS):**
- MoveIt needs accessibility permissions to control your mouse
- When prompted, click "Open Settings" to grant permissions
- Add MoveIt to the list of allowed applications

**Windows:**
- No special permissions required - works out of the box

### ❓ FAQ

**Q: Will this interfere with my normal computer usage?**
A: No! MoveIt uses minimal 1-pixel movements that are barely noticeable and won't interfere with your work.

**Q: Does MoveIt collect any data?**
A: Absolutely not. MoveIt runs entirely on your local machine and doesn't send any data anywhere.

**Q: Can I use this during video calls?**
A: Yes! The movements are so small they won't be noticed by others on video calls.

**Q: Why does macOS ask for accessibility permissions?**
A: macOS requires explicit permission for apps to control mouse movement. This is a security feature.

**Q: How much system resources does it use?**
A: Very minimal - typically less than 50MB RAM and negligible CPU usage.

---

## 👨‍💻 For Developers

### 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Backend:** Electron 38 (Node.js)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Mouse Control:** @nut-tree-fork/nut-js
- **Internationalization:** React Intl
- **Build System:** Vite + electron-builder
- **Code Quality:** ESLint + Prettier + Husky

### 📋 Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

**Platform-specific:**
- **macOS:** Xcode Command Line Tools
- **Windows:** Visual Studio Build Tools (for native modules)

### 🚀 Developer Setup

```bash
# Clone the repository
git clone https://github.com/NicolaeBP/MoveIt.git
cd MoveIt

# Install dependencies
npm install

# Start development server
npm run dev
```

This will:
1. Build the Electron main process
2. Start the Vite dev server
3. Launch the app with hot reloading
4. Open React DevTools

### 📁 Project Structure

```
MoveIt/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── store/             # Zustand stores
│   ├── i18n/              # Internationalization
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── electron/              # Electron main process
│   ├── main.ts           # Main process entry
│   ├── preload.ts        # Preload script
│   └── constants.ts      # App constants
├── shared/               # Shared types and utilities
├── assets/              # App icons and resources
├── scripts/             # Build and utility scripts
└── dist/               # Build output
```

### 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start development environment
npm run dev:vite           # Start only Vite dev server
npm run dev:electron       # Start only Electron

# Building
npm run build:vite         # Build React app
npm run build:electron     # Build Electron main process
npm run build:mac          # Build macOS app
npm run build:win          # Build Windows app
npm run build:all          # Build for all platforms

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run type-check         # TypeScript type checking
npm run format            # Format code with Prettier

# Testing
npm test                  # Run tests (when implemented)
```

### 🏗️ Build Process

The build process uses electron-builder with platform-specific configurations:

**macOS:**
- Creates `.dmg` installer
- Code signing with developer certificate
- Notarization for Gatekeeper
- Universal binary (Intel + Apple Silicon)

**Windows:**
- Creates `.exe` installer with NSIS
- Code signing (when certificates are configured)
- Supports both x64 and ia32 architectures

#### Windows Code Signing Setup

For signed Windows builds, you'll need to set up the SSL.com CodeSignTool:

1. **Download CodeSignTool** from [SSL.com](https://www.ssl.com/guide/esigner-codesigntool-command-guide/)
2. **Extract** to `tools/CodeSignTool/` in the project root
3. **Configure credentials** in `.env.local`:
   ```bash
   WINDOWS_SIGN_USER_NAME=your_username
   WINDOWS_SIGN_USER_PASSWORD=your_password
   WINDOWS_SIGN_CREDENTIAL_ID=your_credential_id
   WINDOWS_SIGN_USER_TOTP=your_totp_secret
   ```

**Project structure after setup:**
```
MoveIt/
├── tools/
│   └── CodeSignTool/
│       ├── CodeSignTool.sh
│       ├── CodeSignTool.bat
│       └── jar/
│           └── code_sign_tool-1.3.2.jar
```

**Unsigned builds (for testing):**
```bash
npm run build:win:nosign   # Skips code signing
```

### 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

*Note: Unit and integration tests will be added in future releases.*

### 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Run** quality checks (`npm run lint && npm run type-check`)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

#### Development Guidelines

- Follow the existing code style
- Add TypeScript types for all new code
- Use semantic commit messages
- Update documentation as needed
- Test on both macOS and Windows if possible

#### Code Style

- Use TypeScript for all new code
- Follow the ESLint configuration
- Use functional React components with hooks
- Prefer named exports over default exports
- Keep components small and focused

### 📦 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag: `git tag v1.0.0`
4. Push tags: `git push --tags`
5. GitHub Actions will automatically build and create a release

### 🌍 Internationalization

Adding a new language:

1. Create a new locale file in `src/i18n/locales/`
2. Add the locale to `src/i18n/config.ts`
3. Update the language selector component

Supported languages: English, Spanish, French, German, Italian, Portuguese, Romanian, Russian, Chinese, Japanese, Korean.

### 📝 Architecture Notes

- **Main Process:** Handles system integration, mouse control, and IPC
- **Renderer Process:** React UI with modern state management
- **IPC Communication:** Type-safe channels between processes
- **State Management:** Zustand stores for UI state
- **Scheduling:** Custom scheduler with timezone support

### 🐛 Debugging

**Development Tools:**
- React DevTools (opens automatically in dev mode)
- Electron DevTools (Cmd/Ctrl + Shift + I)
- VS Code debugger configuration included

**Common Issues:**
- **Mouse not moving:** Check accessibility permissions on macOS
- **Build failures:** Ensure all native dependencies are installed
- **Hot reloading not working:** Restart the dev server

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Electron](https://electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - UI framework
- [nut-js](https://github.com/nut-tree/nut.js) - Desktop automation library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### 📞 Support

- **Issues:** [GitHub Issues](https://github.com/NicolaeBP/MoveIt/issues)
- **Discussions:** [GitHub Discussions](https://github.com/NicolaeBP/MoveIt/discussions)
- **Email:** nicolaebalicapfa@gmail.com

---

**Made with ❤️ by [Nicolae Balica](https://github.com/NicolaeBP)**
