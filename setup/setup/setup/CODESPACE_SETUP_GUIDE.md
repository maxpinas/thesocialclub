# 🚀 Complete Codespace Setup Guide

This guide will help you replicate your entire development environment in a new Codespace.

## 📋 Table of Contents

- [Quick Setup (5 minutes)](#quick-setup)
- [Manual Setup (Step-by-Step)](#manual-setup)
- [Configuration Files](#configuration-files)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# Copy the setup directory to your new Codespace
# Then run the automated script:
cd setup
chmod +x setup.sh
./setup.sh
```

The script will install everything automatically and verify the setup.

### Option 2: Manual Commands (15 minutes)

Follow the [Manual Setup](#manual-setup) section below for step-by-step installation.

---

## 🔧 Manual Setup

### Step 1: Install Claude Code

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
# Expected: 2.0.11 or newer
```

### Step 2: Install Claude Yolo Mode

```bash
# Install globally via npm
npm install -g claude-yolo

# Verify installation
which claude-yolo
# Expected: /home/codespace/nvm/current/bin/claude-yolo

claude-yolo --version
# Expected: 1.7.0 or newer
```

### Step 3: Enable Yolo Mode in VS Code

```bash
# Create/update VS Code settings
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
    "claudeCodeChat.permissions.yoloMode": true
}
EOF
```

**Verify:**
- Open VS Code settings
- Search for "yolo"
- Should see "Yolo Mode: Enabled"

### Step 4: Install SuperClaude Framework

```bash
# Install SuperClaude Framework
npm install @bifrost_inc/superclaude

# The postinstall script will automatically set up the framework
# It installs to ~/.claude/ directory
```

**Verify:**
```bash
ls -la ~/.claude/
# Should see multiple .md files including:
# - CLAUDE.md
# - FLAGS.md
# - PRINCIPLES.md
# - MODE_*.md files
# - MCP_*.md files
```

### Step 5: Install Flaticon Icons

```bash
# Install Flaticon uicons globally
npm install -g @flaticon/flaticon-uicons
```

**Verify:**
```bash
npm list -g @flaticon/flaticon-uicons
# Should show installed version
```

**Design Rules:**
- Never use emoticons in designs
- Never use purple
- Always align left

### Step 6: Create Keep-Alive Scripts

```bash
# Create scripts directory
mkdir -p scripts
cd scripts
```

#### Create `keep-alive-enhanced.sh`:

```bash
cat > keep-alive-enhanced.sh << 'SCRIPT_END'
#!/bin/bash
# Enhanced Keep-Alive Script for Codespace Session
# This script prevents the codespace from timing out AND keeps URLs alive by performing periodic activity

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/keep-alive.log"
PID_FILE="$SCRIPT_DIR/keep-alive.pid"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check if script is already running
check_running() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if ps -p "$OLD_PID" > /dev/null 2>&1; then
            log_message "Keep-alive script already running with PID $OLD_PID"
            exit 0
        else
            log_message "Removing stale PID file"
            rm -f "$PID_FILE"
        fi
    fi
}

# Function to ping URLs to keep them alive
ping_urls() {
    if [ ! -z "$CODESPACE_NAME" ]; then
        FRONTEND_URL="https://${CODESPACE_NAME}-4173.app.github.dev/"
        BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev/"

        # Ping frontend
        if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$FRONTEND_URL" > /dev/null 2>&1; then
            log_message "✓ Pinged frontend: $FRONTEND_URL"
        else
            log_message "⚠ Frontend ping failed: $FRONTEND_URL"
        fi

        # Ping backend
        if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BACKEND_URL" > /dev/null 2>&1; then
            log_message "✓ Pinged backend: $BACKEND_URL"
        else
            log_message "⚠ Backend ping failed: $BACKEND_URL"
        fi
    fi
}

# Function to perform keep-alive activities
keep_alive_activity() {
    # Touch a file to show activity
    touch "$SCRIPT_DIR/.keep-alive-heartbeat"

    # Check if backend is running
    if ! pgrep -f "node.*server.js" > /dev/null; then
        log_message "Backend not running, attempting restart..."
        cd "/workspaces/$(basename $(pwd | sed 's|/scripts||'))/02 - BACKEND/backend" && nohup node server.js > backend.log 2>&1 &
        log_message "Backend restart attempted"
        sleep 3
    fi

    # Check if frontend dev server is running
    if ! pgrep -f "vite.*--host" > /dev/null; then
        log_message "Frontend dev server not running, attempting restart..."
        cd "/workspaces/$(basename $(pwd | sed 's|/scripts||'))/01 - FRONTEND/frontend" && nohup npm run dev > dev.log 2>&1 &
        log_message "Frontend dev server restart attempted"
        sleep 3
    fi

    # Ping URLs to keep them alive
    ping_urls

    # Make a lightweight file system operation
    ls -la /workspaces > /dev/null 2>&1

    # Check disk usage
    df -h > /dev/null 2>&1

    # Git fetch to show repository activity (prevents timeout)
    cd /workspaces/$(basename $(pwd | sed 's|/scripts||')) && git fetch > /dev/null 2>&1

    log_message "Keep-alive heartbeat ✓"
}

# Function to cleanup on exit
cleanup() {
    log_message "Keep-alive script stopping..."
    rm -f "$PID_FILE"
    exit 0
}

# Main execution
main() {
    check_running

    # Store PID
    echo $$ > "$PID_FILE"

    # Set up cleanup trap
    trap cleanup SIGINT SIGTERM EXIT

    log_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_message "Enhanced Keep-alive script started with PID $$"
    log_message "Interval: 3 minutes"
    log_message "Log file: $LOG_FILE"
    log_message "Features:"
    log_message "  - Codespace timeout prevention"
    log_message "  - URL keep-alive pinging"
    log_message "  - Automatic server restart"
    log_message "  - Git activity"
    log_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Infinite loop with 3-minute intervals
    while true; do
        keep_alive_activity
        sleep 180  # 3 minutes
    done
}

# Run main function
main
SCRIPT_END

chmod +x keep-alive-enhanced.sh
```

#### Create `start-keep-alive-enhanced.sh`:

```bash
cat > start-keep-alive-enhanced.sh << 'SCRIPT_END'
#!/bin/bash
# Start the enhanced keep-alive script in the background

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛡️  Starting Enhanced Keep-Alive Service..."
echo ""
nohup "$SCRIPT_DIR/keep-alive-enhanced.sh" > /dev/null 2>&1 &

sleep 2

if [ -f "$SCRIPT_DIR/keep-alive.pid" ]; then
    PID=$(cat "$SCRIPT_DIR/keep-alive.pid")
    echo "✅ Keep-alive process started with PID: $PID"
    echo ""
    echo "🔹 Features enabled:"
    echo "   - Codespace timeout prevention"
    echo "   - URL keep-alive pinging (frontend + backend)"
    echo "   - Automatic server restart"
    echo "   - Git activity (every 3 minutes)"
    echo ""
    echo "📊 Monitor log: tail -f $SCRIPT_DIR/keep-alive.log"
    echo "⏹️  Stop script: $SCRIPT_DIR/stop-keep-alive.sh"
    echo ""
    echo "💡 This script runs in the background and will keep your codespace alive!"
else
    echo "❌ Failed to start keep-alive process"
    exit 1
fi
SCRIPT_END

chmod +x start-keep-alive-enhanced.sh
```

#### Create `stop-keep-alive.sh`:

```bash
cat > stop-keep-alive.sh << 'SCRIPT_END'
#!/bin/bash
# Stop the keep-alive script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/keep-alive.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        kill "$PID"
        echo "✅ Keep-alive process (PID: $PID) stopped"
        rm -f "$PID_FILE"
    else
        echo "⚠️  Keep-alive process not running (stale PID file removed)"
        rm -f "$PID_FILE"
    fi
else
    echo "ℹ️  Keep-alive process is not running"
fi
SCRIPT_END

chmod +x stop-keep-alive.sh
```

#### Create `urls.sh`:

```bash
cat > urls.sh << 'SCRIPT_END'
#!/bin/bash
# Display working URLs - run this anytime you need the URL!

echo ""
echo "🌐 ═══════════════════════════════════════════════"
echo "   YOUR CODESPACE - WORKING URLS"
echo "═══════════════════════════════════════════════"
echo ""

if [ ! -z "$CODESPACE_NAME" ]; then
    FRONTEND_URL="https://${CODESPACE_NAME}-4173.app.github.dev/"
    BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev/"

    echo "📱 FRONTEND (Copy & paste this):"
    echo "   $FRONTEND_URL"
    echo ""
    echo "🔧 BACKEND API:"
    echo "   $BACKEND_URL"
    echo ""

    # Check if services are running
    if lsof -ti:4173 > /dev/null 2>&1; then
        echo "✅ Frontend is running"
    else
        echo "⚠️  Frontend not running - run './scripts/start.sh' first"
    fi

    if lsof -ti:8080 > /dev/null 2>&1; then
        echo "✅ Backend is running"
    else
        echo "⚠️  Backend not running - run './scripts/start.sh' first"
    fi
else
    echo "⚠️  Not in GitHub Codespaces"
    echo "   Frontend: http://localhost:4173"
    echo "   Backend:  http://localhost:8080"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo ""
SCRIPT_END

chmod +x urls.sh
```

#### Create `start.sh`:

```bash
cat > start.sh << 'SCRIPT_END'
#!/bin/bash
# Start both backend and frontend servers

echo "🚀 Starting Development Servers..."
echo ""

# Get project root directory
PROJECT_ROOT="/workspaces/$(basename $(pwd | sed 's|/scripts||'))"

# Check if already running
BACKEND_PID=$(lsof -ti:8080)
FRONTEND_PID=$(lsof -ti:4173)

if [ ! -z "$BACKEND_PID" ]; then
    echo "⚠️  Backend already running on port 8080 (PID: $BACKEND_PID)"
else
    echo "▶️  Starting backend server..."
    cd "$PROJECT_ROOT/02 - BACKEND/backend"
    nohup node server.js > /tmp/backend.log 2>&1 &
    echo "✅ Backend started (port 8080)"
fi

if [ ! -z "$FRONTEND_PID" ]; then
    echo "⚠️  Frontend already running on port 4173 (PID: $FRONTEND_PID)"
else
    echo "▶️  Starting frontend server..."
    cd "$PROJECT_ROOT/01 - FRONTEND/frontend"
    nohup npm run dev > /tmp/frontend.log 2>&1 &
    echo "✅ Frontend started (port 4173)"
fi

sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 YOUR WORKING URLS (COPY THESE!):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -z "$CODESPACE_NAME" ]; then
    FRONTEND_URL="https://${CODESPACE_NAME}-4173.app.github.dev/"
    BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev/"

    echo ""
    echo "✨ FRONTEND APPLICATION:"
    echo "   $FRONTEND_URL"
    echo ""
    echo "🔧 BACKEND API:"
    echo "   $BACKEND_URL"
    echo ""

    echo "💡 TIP: Run './scripts/urls.sh' anytime to see these URLs again"
else
    echo "   Local Frontend: http://localhost:4173"
    echo "   Local Backend:  http://localhost:8080"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ All services are running!"
echo ""
SCRIPT_END

chmod +x start.sh
```

#### Create `stop.sh`:

```bash
cat > stop.sh << 'SCRIPT_END'
#!/bin/bash
# Stop both servers to save resources

echo "🛑 Stopping all servers..."

# Stop backend
BACKEND_PID=$(lsof -ti:8080)
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend was not running"
fi

# Stop frontend
FRONTEND_PID=$(lsof -ti:4173)
if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend was not running"
fi

echo ""
echo "✅ All servers stopped!"
echo ""
echo "💡 COST TIP: Don't forget to stop your Codespace when done:"
echo "   Codespaces menu → Stop Codespace"
echo ""
SCRIPT_END

chmod +x stop.sh
```

#### Create `status.sh`:

```bash
cat > status.sh << 'SCRIPT_END'
#!/bin/bash
# Quick status check for all services

echo ""
echo "🔍 ═══════════════════════════════════════════════"
echo "   Service Status"
echo "═══════════════════════════════════════════════"
echo ""

# Get project root
PROJECT_ROOT="/workspaces/$(basename $(pwd | sed 's|/scripts||'))"

# Check keep-alive service
if ps aux | grep keep-alive-enhanced | grep -v grep > /dev/null; then
    PID=$(cat "$PROJECT_ROOT/scripts/keep-alive.pid" 2>/dev/null)
    echo "✅ Keep-Alive Service: RUNNING (PID: $PID)"

    # Show last heartbeat
    LAST_BEAT=$(tail -1 "$PROJECT_ROOT/scripts/keep-alive.log" 2>/dev/null)
    echo "   Last activity: $LAST_BEAT"
else
    echo "❌ Keep-Alive Service: NOT RUNNING"
    echo "   Start with: ./scripts/start-keep-alive-enhanced.sh"
fi

echo ""

# Check backend
if lsof -ti:8080 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti:8080)
    echo "✅ Backend Server: RUNNING (PID: $BACKEND_PID, Port: 8080)"
else
    echo "❌ Backend Server: NOT RUNNING"
    echo "   Start with: ./scripts/start.sh"
fi

echo ""

# Check frontend
if lsof -ti:4173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti:4173)
    echo "✅ Frontend Server: RUNNING (PID: $FRONTEND_PID, Port: 4173)"
else
    echo "❌ Frontend Server: NOT RUNNING"
    echo "   Start with: ./scripts/start.sh"
fi

echo ""

# Show URLs if in Codespace
if [ ! -z "$CODESPACE_NAME" ]; then
    echo "🌐 Your URLs:"
    echo "   Frontend: https://${CODESPACE_NAME}-4173.app.github.dev/"
    echo "   Backend:  https://${CODESPACE_NAME}-8080.app.github.dev/"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo ""
echo "💡 Quick commands:"
echo "   View logs:  tail -f scripts/keep-alive.log"
echo "   Stop all:   ./scripts/stop.sh"
echo "   Restart:    ./scripts/start.sh"
echo ""
SCRIPT_END

chmod +x status.sh
```

**Go back to project root:**
```bash
cd /workspaces/your-project-name
```

### Step 7: Create Devcontainer Configuration

```bash
# Create .devcontainer directory
mkdir -p .devcontainer

# Create devcontainer.json
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "Your Project Dev Container",
  "forwardPorts": [8080, 4173, 5173],
  "portsAttributes": {
    "8080": {
      "label": "Backend + Frontend",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "4173": {
      "label": "Vite Dev Server",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "5173": {
      "label": "Vite Alt Port",
      "onAutoForward": "silent",
      "visibility": "public"
    }
  },
  "postStartCommand": "chmod +x scripts/*.sh && ./scripts/start-keep-alive-enhanced.sh && ./scripts/start.sh",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.confirmOnExit": "never",
        "security.workspace.trust.enabled": false,
        "security.workspace.trust.untrustedFiles": "open",
        "security.workspace.trust.startupPrompt": "never",
        "security.workspace.trust.banner": "never",
        "task.allowAutomaticTasks": "on",
        "task.autoDetect": "on",
        "task.promptOnClose": false,
        "terminal.integrated.confirmOnKill": "never"
      }
    }
  },
  "containerEnv": {
    "ANTHROPIC_AUTO_CONFIRM": "true",
    "CLAUDE_AUTO_ACCEPT": "true",
    "PYTHONUNBUFFERED": "1"
  }
}
EOF
```

### Step 8: Add Documentation Files

```bash
# Create quick start guide
cat > QUICK-START.md << 'EOF'
# 🚀 Quick Start Guide

## ✅ Everything is Already Running!

Your Codespace is configured to automatically start:
- ✅ Keep-Alive Service (preventing timeout)
- ✅ Backend Server (port 8080)
- ✅ Frontend Server (port 4173)

## 🎯 Essential Commands

### Check Status
```bash
./scripts/status.sh
```

### View Your URLs
```bash
./scripts/urls.sh
```

### Monitor Keep-Alive
```bash
tail -f ./scripts/keep-alive.log
```

## 📚 Full Documentation

- **Keep-Alive Details**: `KEEP-ALIVE-GUIDE.md`
- **Scripts Reference**: `scripts/README.md`
- **Codespaces Guide**: `CODESPACES_GUIDE.md`
EOF

# Add scripts README
cat > scripts/README.md << 'EOF'
# 📜 Scripts Directory - Quick Reference

## 🚀 Essential Commands

```bash
# Check status of everything
./scripts/status.sh

# Start servers (if not running)
./scripts/start.sh

# View your URLs
./scripts/urls.sh

# View keep-alive logs
tail -f ./scripts/keep-alive.log
```

## 📋 Complete Script List

| Script | Purpose | Auto-Start |
|--------|---------|------------|
| `status.sh` | Check all services status | - |
| `start.sh` | Start backend + frontend | ✅ Yes |
| `stop.sh` | Stop all servers | - |
| `urls.sh` | Display working URLs | - |
| `keep-alive-enhanced.sh` | Main keep-alive loop | ✅ Yes |
| `start-keep-alive-enhanced.sh` | Start keep-alive service | ✅ Yes |
| `stop-keep-alive.sh` | Stop keep-alive service | - |

See the main README for detailed information about each script.
EOF
```

---

## ✅ Verification

Run this verification script to ensure everything is set up correctly:

```bash
# Create verification script
cat > verify-setup.sh << 'VERIFY_END'
#!/bin/bash

echo "🔍 Verifying Codespace Setup..."
echo ""

ERRORS=0

# Check 1: Claude Code
if command -v claude &> /dev/null; then
    echo "✅ Claude Code installed: $(claude --version)"
else
    echo "❌ Claude Code not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Claude Yolo
if command -v claude-yolo &> /dev/null; then
    echo "✅ Claude Yolo installed"
else
    echo "❌ Claude Yolo not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: VS Code Yolo Settings
if [ -f ".vscode/settings.json" ]; then
    if grep -q "yoloMode.*true" .vscode/settings.json; then
        echo "✅ Yolo Mode enabled in VS Code"
    else
        echo "⚠️  Yolo Mode not enabled in VS Code settings"
    fi
else
    echo "❌ VS Code settings.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: SuperClaude Files
if [ -d "$HOME/.claude" ]; then
    FILE_COUNT=$(ls -1 ~/.claude/*.md 2>/dev/null | wc -l)
    echo "✅ SuperClaude installed ($FILE_COUNT config files)"
else
    echo "❌ SuperClaude config directory not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: Scripts Directory
if [ -d "scripts" ]; then
    SCRIPT_COUNT=$(ls -1 scripts/*.sh 2>/dev/null | wc -l)
    echo "✅ Scripts directory exists ($SCRIPT_COUNT scripts)"

    # Check if scripts are executable
    if [ -x "scripts/start.sh" ]; then
        echo "✅ Scripts are executable"
    else
        echo "⚠️  Scripts may not be executable - run: chmod +x scripts/*.sh"
    fi
else
    echo "❌ Scripts directory not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Devcontainer
if [ -f ".devcontainer/devcontainer.json" ]; then
    echo "✅ Devcontainer configuration exists"
else
    echo "❌ Devcontainer configuration not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 7: Flaticon Icons
if npm list -g @flaticon/flaticon-uicons &> /dev/null; then
    echo "✅ Flaticon icons installed"
else
    echo "ℹ️  Flaticon icons not installed (will be installed by setup.sh)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "🎉 All checks passed! Your Codespace is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./scripts/status.sh"
    echo "2. Run: ./scripts/urls.sh"
    echo "3. Start coding!"
else
    echo "⚠️  $ERRORS error(s) found. Please review the setup steps."
fi

echo ""
VERIFY_END

chmod +x verify-setup.sh

# Run the verification
./verify-setup.sh
```

---

## 🎯 Post-Setup Checklist

After completing all steps, verify:

- [ ] Claude Code responds to commands
- [ ] Yolo Mode is enabled in VS Code
- [ ] SuperClaude commands work (`/sc:help`)
- [ ] Scripts are executable and working
- [ ] Keep-alive service starts automatically
- [ ] Servers auto-start when Codespace opens
- [ ] URLs are accessible from browser
- [ ] Flaticon icons installed

---

## 🔧 Troubleshooting

### Issue: Claude Code not found

```bash
# Solution: Check npm global installation
npm list -g --depth=0 | grep claude

# Reinstall if needed
npm install -g @anthropic-ai/claude-code
```

### Issue: Yolo Mode not working

```bash
# Solution: Check settings file
cat .vscode/settings.json

# Should contain:
# {"claudeCodeChat.permissions.yoloMode": true}

# Reload VS Code window
# Press: Ctrl+Shift+P → "Reload Window"
```

### Issue: SuperClaude commands not found

```bash
# Solution: Check installation
ls -la ~/.claude/

# Reinstall if empty
npm install -g @bifrost_inc/superclaude

# Or install locally in project
npm install @bifrost_inc/superclaude
```

### Issue: Scripts not executable

```bash
# Solution: Make all scripts executable
chmod +x scripts/*.sh

# Verify
ls -la scripts/
# Should show -rwxr-xr-x permissions
```

### Issue: Keep-alive not starting

```bash
# Solution: Check script permissions and start manually
chmod +x scripts/start-keep-alive-enhanced.sh
./scripts/start-keep-alive-enhanced.sh

# Check if running
ps aux | grep keep-alive | grep -v grep
```

### Issue: Ports not accessible

```bash
# Solution: Check port forwarding
# In VS Code: Ports tab (bottom panel)
# Ensure ports 8080, 4173 are forwarded and public

# Check devcontainer config
cat .devcontainer/devcontainer.json | grep forwardPorts
```

---

## 📚 Reference Documentation

### Design System Rules

When working with UI components:

- **Icons**: Flaticon uicons
  - Installed via: `npm install -g @flaticon/flaticon-uicons`
  - Never use emoticons

- **Colors**:
  - Never use purple
  - Follow project color palette

- **Layout**:
  - Default alignment: Left
  - Follow responsive design principles

### MCP Servers (Available by Default)

No additional configuration needed - Claude Code includes:
- Context7 (documentation)
- Sequential Thinking
- Magic (UI components)
- Playwright (browser testing)
- And more...

### Essential Commands Reference

```bash
# Daily workflow
./scripts/status.sh              # Check what's running
./scripts/urls.sh                # Get your URLs
./scripts/start.sh               # Start servers
./scripts/stop.sh                # Stop servers

# Keep-alive management
./scripts/start-keep-alive-enhanced.sh  # Start keep-alive
./scripts/stop-keep-alive.sh            # Stop keep-alive
tail -f scripts/keep-alive.log          # Monitor activity

# SuperClaude commands (in Claude Code)
/sc:help                         # List all commands
/sc:implement                    # Feature implementation
/sc:analyze                      # Code analysis
/sc:test                         # Run tests
```

### Port Configuration

| Port | Service | Visibility | Auto-Forward |
|------|---------|-----------|--------------|
| 8080 | Backend API | Public | Notify |
| 4173 | Frontend (Vite) | Public | Notify |
| 5173 | Frontend Alt | Public | Silent |

### File Locations

```
Project Structure:
├── .devcontainer/
│   └── devcontainer.json       # Auto-start configuration
├── .vscode/
│   └── settings.json           # Yolo mode + settings
├── scripts/
│   ├── keep-alive-enhanced.sh  # Main keep-alive loop
│   ├── start-keep-alive-enhanced.sh
│   ├── stop-keep-alive.sh
│   ├── start.sh                # Server startup
│   ├── stop.sh                 # Server shutdown
│   ├── urls.sh                 # URL display
│   ├── status.sh               # Status check
│   └── README.md               # Scripts documentation
├── QUICK-START.md              # Quick start guide
├── KEEP-ALIVE-GUIDE.md         # Keep-alive details
└── CODESPACES_GUIDE.md         # Codespaces information

Global Configuration:
~/.claude/                       # SuperClaude config
@flaticon/flaticon-uicons        # Flaticon icons (npm global)
```

---

## 🌐 Additional Resources

- **Claude Code Documentation**: https://docs.claude.com/claude-code
- **Claude Yolo Mode**: https://github.com/eastlondoner/claude-yolo
- **SuperClaude Framework**: https://github.com/SuperClaude-Org/SuperClaude_Framework
- **Flaticon Icons**: https://www.flaticon.com/uicons
- **GitHub Codespaces Docs**: https://docs.github.com/codespaces

---

## 💡 Pro Tips

1. **Bookmark your Codespace URL** - It never changes!
2. **Use `./scripts/urls.sh` often** - Faster than asking AI
3. **Let auto-stop work** - Saves money automatically (default: 30 min)
4. **Check status first** - Before assuming servers crashed
5. **Monitor keep-alive logs** - To verify everything is working

---

**Need Help?**

Check:
1. This guide first
2. Individual documentation files (QUICK-START.md, etc.)
3. Run `./verify-setup.sh` to diagnose issues
4. Ask Claude Code for assistance

---

**Made with ❤️ for efficient development**

Last Updated: $(date '+%Y-%m-%d')
