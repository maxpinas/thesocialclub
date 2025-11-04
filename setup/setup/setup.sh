#!/bin/bash
###########################################
# Automated Codespace Setup Script
# This script installs everything needed for your development environment
###########################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Get project root (parent of setup directory)
SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SETUP_DIR")"

echo ""
print_step "🚀 Starting Automated Codespace Setup"
echo "Project Root: $PROJECT_ROOT"
echo "Setup Directory: $SETUP_DIR"
echo ""

sleep 2

##################################
# STEP 1: Install Claude Code
##################################
print_step "Step 1/8: Installing Claude Code"

if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>&1 || echo "unknown")
    print_success "Claude Code already installed: $CLAUDE_VERSION"
else
    echo "Installing Claude Code globally..."
    npm install -g @anthropic-ai/claude-code
    print_success "Claude Code installed"
fi

echo ""
sleep 1

##################################
# STEP 2: Install Claude Yolo Mode
##################################
print_step "Step 2/8: Installing Claude Yolo Mode"

if command -v claude-yolo &> /dev/null; then
    print_success "Claude Yolo already installed"
else
    echo "Installing Claude Yolo globally..."
    npm install -g claude-yolo
    print_success "Claude Yolo installed"
fi

echo ""
sleep 1

##################################
# STEP 3: Enable Yolo Mode in VS Code
##################################
print_step "Step 3/8: Configuring VS Code Settings"

mkdir -p "$PROJECT_ROOT/.vscode"

cat > "$PROJECT_ROOT/.vscode/settings.json" << 'EOF'
{
    "claudeCodeChat.permissions.yoloMode": true
}
EOF

print_success "Yolo Mode enabled in VS Code"
echo ""
sleep 1

##################################
# STEP 4: Install SuperClaude Framework
##################################
print_step "Step 4/8: Installing SuperClaude Framework"

if [ -d "$HOME/.claude" ] && [ -f "$HOME/.claude/CLAUDE.md" ]; then
    print_success "SuperClaude already installed"
else
    echo "Installing SuperClaude Framework..."
    cd "$PROJECT_ROOT"
    npm install @bifrost_inc/superclaude
    print_success "SuperClaude Framework installed"
fi

echo ""
sleep 1

##################################
# STEP 5: Install Flaticon Icons
##################################
print_step "Step 5/8: Installing Flaticon Icons"

echo "Installing Flaticon uicons..."
npm install -g @flaticon/flaticon-uicons
print_success "Flaticon icons installed"

echo ""
sleep 1

##################################
# STEP 6: Create Scripts Directory
##################################
print_step "Step 6/8: Setting Up Scripts"

mkdir -p "$PROJECT_ROOT/scripts"
cd "$PROJECT_ROOT/scripts"

# Create keep-alive-enhanced.sh
cat > keep-alive-enhanced.sh << 'SCRIPT_EOF'
#!/bin/bash
# Enhanced Keep-Alive Script for Codespace Session

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/keep-alive.log"
PID_FILE="$SCRIPT_DIR/keep-alive.pid"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

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

ping_urls() {
    if [ ! -z "$CODESPACE_NAME" ]; then
        FRONTEND_URL="https://${CODESPACE_NAME}-4173.app.github.dev/"
        BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev/"

        if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$FRONTEND_URL" > /dev/null 2>&1; then
            log_message "✓ Pinged frontend: $FRONTEND_URL"
        else
            log_message "⚠ Frontend ping failed: $FRONTEND_URL"
        fi

        if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BACKEND_URL" > /dev/null 2>&1; then
            log_message "✓ Pinged backend: $BACKEND_URL"
        else
            log_message "⚠ Backend ping failed: $BACKEND_URL"
        fi
    fi
}

keep_alive_activity() {
    touch "$SCRIPT_DIR/.keep-alive-heartbeat"

    if ! pgrep -f "node.*server.js" > /dev/null; then
        log_message "Backend not running, attempting restart..."
        if [ -d "$PROJECT_ROOT/02 - BACKEND/backend" ]; then
            cd "$PROJECT_ROOT/02 - BACKEND/backend" && nohup node server.js > backend.log 2>&1 &
            log_message "Backend restart attempted"
        fi
        sleep 3
    fi

    if ! pgrep -f "vite.*--host" > /dev/null; then
        log_message "Frontend dev server not running, attempting restart..."
        if [ -d "$PROJECT_ROOT/01 - FRONTEND/frontend" ]; then
            cd "$PROJECT_ROOT/01 - FRONTEND/frontend" && nohup npm run dev > dev.log 2>&1 &
            log_message "Frontend dev server restart attempted"
        fi
        sleep 3
    fi

    ping_urls
    ls -la "$PROJECT_ROOT" > /dev/null 2>&1
    df -h > /dev/null 2>&1
    cd "$PROJECT_ROOT" && git fetch > /dev/null 2>&1

    log_message "Keep-alive heartbeat ✓"
}

cleanup() {
    log_message "Keep-alive script stopping..."
    rm -f "$PID_FILE"
    exit 0
}

main() {
    check_running
    echo $$ > "$PID_FILE"
    trap cleanup SIGINT SIGTERM EXIT

    log_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_message "Enhanced Keep-alive script started with PID $$"
    log_message "Interval: 3 minutes"
    log_message "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    while true; do
        keep_alive_activity
        sleep 180
    done
}

main
SCRIPT_EOF

# Create other scripts
cat > start-keep-alive-enhanced.sh << 'SCRIPT_EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛡️  Starting Enhanced Keep-Alive Service..."
nohup "$SCRIPT_DIR/keep-alive-enhanced.sh" > /dev/null 2>&1 &
sleep 2

if [ -f "$SCRIPT_DIR/keep-alive.pid" ]; then
    PID=$(cat "$SCRIPT_DIR/keep-alive.pid")
    echo "✅ Keep-alive process started with PID: $PID"
else
    echo "❌ Failed to start keep-alive process"
    exit 1
fi
SCRIPT_EOF

cat > stop-keep-alive.sh << 'SCRIPT_EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/keep-alive.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        kill "$PID"
        echo "✅ Keep-alive process stopped"
        rm -f "$PID_FILE"
    else
        echo "⚠️  Keep-alive process not running"
        rm -f "$PID_FILE"
    fi
else
    echo "ℹ️  Keep-alive process is not running"
fi
SCRIPT_EOF

cat > urls.sh << 'SCRIPT_EOF'
#!/bin/bash
echo ""
echo "🌐 ═══════════════════════════════════════════════"
echo "   YOUR CODESPACE - WORKING URLS"
echo "═══════════════════════════════════════════════"
echo ""

if [ ! -z "$CODESPACE_NAME" ]; then
    FRONTEND_URL="https://${CODESPACE_NAME}-4173.app.github.dev/"
    BACKEND_URL="https://${CODESPACE_NAME}-8080.app.github.dev/"
    echo "📱 FRONTEND: $FRONTEND_URL"
    echo "🔧 BACKEND:  $BACKEND_URL"
    echo ""
    lsof -ti:4173 > /dev/null 2>&1 && echo "✅ Frontend running" || echo "⚠️  Frontend not running"
    lsof -ti:8080 > /dev/null 2>&1 && echo "✅ Backend running" || echo "⚠️  Backend not running"
else
    echo "   Frontend: http://localhost:4173"
    echo "   Backend:  http://localhost:8080"
fi
echo ""
echo "═══════════════════════════════════════════════"
echo ""
SCRIPT_EOF

cat > start.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "🚀 Starting Development Servers..."
PROJECT_ROOT="$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")"

BACKEND_PID=$(lsof -ti:8080 2>/dev/null)
FRONTEND_PID=$(lsof -ti:4173 2>/dev/null)

if [ -z "$BACKEND_PID" ] && [ -d "$PROJECT_ROOT/02 - BACKEND/backend" ]; then
    cd "$PROJECT_ROOT/02 - BACKEND/backend"
    nohup node server.js > /tmp/backend.log 2>&1 &
    echo "✅ Backend started (port 8080)"
else
    echo "⚠️  Backend already running or directory not found"
fi

if [ -z "$FRONTEND_PID" ] && [ -d "$PROJECT_ROOT/01 - FRONTEND/frontend" ]; then
    cd "$PROJECT_ROOT/01 - FRONTEND/frontend"
    nohup npm run dev > /tmp/frontend.log 2>&1 &
    echo "✅ Frontend started (port 4173)"
else
    echo "⚠️  Frontend already running or directory not found"
fi

sleep 3
if [ ! -z "$CODESPACE_NAME" ]; then
    echo ""
    echo "🌐 URLs:"
    echo "   Frontend: https://${CODESPACE_NAME}-4173.app.github.dev/"
    echo "   Backend:  https://${CODESPACE_NAME}-8080.app.github.dev/"
fi
SCRIPT_EOF

cat > stop.sh << 'SCRIPT_EOF'
#!/bin/bash
echo "🛑 Stopping all servers..."

BACKEND_PID=$(lsof -ti:8080 2>/dev/null)
[ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID && echo "✅ Backend stopped" || echo "ℹ️  Backend not running"

FRONTEND_PID=$(lsof -ti:4173 2>/dev/null)
[ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID && echo "✅ Frontend stopped" || echo "ℹ️  Frontend not running"

echo "✅ All servers stopped!"
SCRIPT_EOF

cat > status.sh << 'SCRIPT_EOF'
#!/bin/bash
echo ""
echo "🔍 Service Status"
echo "═══════════════════════════════════════════════"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ps aux | grep keep-alive-enhanced | grep -v grep > /dev/null; then
    PID=$(cat "$SCRIPT_DIR/keep-alive.pid" 2>/dev/null)
    echo "✅ Keep-Alive: RUNNING (PID: $PID)"
else
    echo "❌ Keep-Alive: NOT RUNNING"
fi

lsof -ti:8080 > /dev/null 2>&1 && echo "✅ Backend: RUNNING (Port 8080)" || echo "❌ Backend: NOT RUNNING"
lsof -ti:4173 > /dev/null 2>&1 && echo "✅ Frontend: RUNNING (Port 4173)" || echo "❌ Frontend: NOT RUNNING"

[ ! -z "$CODESPACE_NAME" ] && echo "" && echo "🌐 URLs:" && echo "   https://${CODESPACE_NAME}-4173.app.github.dev/" && echo "   https://${CODESPACE_NAME}-8080.app.github.dev/"
echo ""
SCRIPT_EOF

# Make all scripts executable
chmod +x *.sh

print_success "All scripts created and made executable"
echo ""
sleep 1

##################################
# STEP 7: Create Devcontainer Config
##################################
print_step "Step 7/8: Creating Devcontainer Configuration"

mkdir -p "$PROJECT_ROOT/.devcontainer"

cat > "$PROJECT_ROOT/.devcontainer/devcontainer.json" << 'EOF'
{
  "name": "Development Container",
  "forwardPorts": [8080, 4173, 5173],
  "portsAttributes": {
    "8080": {
      "label": "Backend",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "4173": {
      "label": "Frontend",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "5173": {
      "label": "Vite Alt",
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

print_success "Devcontainer configuration created"
echo ""
sleep 1

##################################
# STEP 8: Create Documentation
##################################
print_step "Step 8/8: Creating Documentation Files"

cat > "$PROJECT_ROOT/QUICK-START.md" << 'EOF'
# 🚀 Quick Start Guide

## ✅ Everything is Already Running!

Your Codespace automatically starts:
- ✅ Keep-Alive Service
- ✅ Backend Server (port 8080)
- ✅ Frontend Server (port 4173)

## 🎯 Essential Commands

```bash
./scripts/status.sh    # Check status
./scripts/urls.sh      # View URLs
./scripts/start.sh     # Start servers
./scripts/stop.sh      # Stop servers
```

## 📚 Documentation

- Full Setup Guide: `setup/CODESPACE_SETUP_GUIDE.md`
- Scripts Reference: `scripts/README.md`

**Pro Tip:** Run `./scripts/urls.sh` instead of asking AI for URLs!
EOF

cat > "$PROJECT_ROOT/scripts/README.md" << 'EOF'
# 📜 Scripts Reference

## Essential Commands

| Script | Purpose |
|--------|---------|
| `status.sh` | Check all services |
| `start.sh` | Start servers |
| `stop.sh` | Stop servers |
| `urls.sh` | Display URLs |
| `start-keep-alive-enhanced.sh` | Start keep-alive |
| `stop-keep-alive.sh` | Stop keep-alive |

## Usage

```bash
./scripts/status.sh    # See what's running
./scripts/urls.sh      # Get your URLs
```

See main documentation for details.
EOF

print_success "Documentation created"
echo ""
sleep 1

##################################
# VERIFICATION
##################################
print_step "✅ Setup Complete - Running Verification"

cd "$PROJECT_ROOT"

# Run verification
ERRORS=0

command -v claude &> /dev/null && print_success "Claude Code: OK" || { print_error "Claude Code: FAILED"; ERRORS=$((ERRORS + 1)); }
command -v claude-yolo &> /dev/null && print_success "Claude Yolo: OK" || { print_error "Claude Yolo: FAILED"; ERRORS=$((ERRORS + 1)); }
[ -f ".vscode/settings.json" ] && print_success "VS Code Settings: OK" || { print_error "VS Code Settings: FAILED"; ERRORS=$((ERRORS + 1)); }
[ -d "$HOME/.claude" ] && print_success "SuperClaude: OK" || { print_error "SuperClaude: FAILED"; ERRORS=$((ERRORS + 1)); }
[ -d "scripts" ] && print_success "Scripts Directory: OK" || { print_error "Scripts: FAILED"; ERRORS=$((ERRORS + 1)); }
[ -f ".devcontainer/devcontainer.json" ] && print_success "Devcontainer: OK" || { print_error "Devcontainer: FAILED"; ERRORS=$((ERRORS + 1)); }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
    print_success "🎉 All checks passed! Your Codespace is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Reload your Codespace (if currently open)"
    echo "2. Run: ./scripts/status.sh"
    echo "3. Run: ./scripts/urls.sh"
    echo "4. Start coding!"
else
    print_error "⚠️  $ERRORS error(s) found"
    echo "Please review the setup guide: setup/CODESPACE_SETUP_GUIDE.md"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
