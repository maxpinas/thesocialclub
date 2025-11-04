# ⚡ Quick Reference Card

## 🚀 Setup Commands

```bash
# Automated setup (new Codespace)
cd setup && ./setup.sh

# Verify installation
cd setup && ./verify-setup.sh

# Manual setup
# See: setup/CODESPACE_SETUP_GUIDE.md
```

## 🎯 Daily Commands

### Essential

```bash
./scripts/status.sh    # Check all services
./scripts/urls.sh      # Get your URLs
./scripts/start.sh     # Start servers
./scripts/stop.sh      # Stop servers
```

### Keep-Alive

```bash
./scripts/start-keep-alive-enhanced.sh   # Start keep-alive
./scripts/stop-keep-alive.sh             # Stop keep-alive
tail -f scripts/keep-alive.log           # Monitor logs
```

## 🌐 Ports

| Port | Service | URL Pattern |
|------|---------|-------------|
| 8080 | Backend | `https://{CODESPACE_NAME}-8080.app.github.dev/` |
| 4173 | Frontend | `https://{CODESPACE_NAME}-4173.app.github.dev/` |
| 5173 | Vite Alt | `https://{CODESPACE_NAME}-5173.app.github.dev/` |

## 🔧 Installation Reference

### Global Tools

```bash
# Claude Code
npm install -g @anthropic-ai/claude-code

# Claude Yolo
npm install -g claude-yolo

# SuperClaude
npm install @bifrost_inc/superclaude
```

### Verification

```bash
claude --version              # Check Claude Code
which claude-yolo             # Check Yolo location
ls ~/.claude/                 # Check SuperClaude config
```

## 📁 File Locations

```
Configuration:
~/.claude/                         # SuperClaude global config
.vscode/settings.json              # Yolo mode settings
.devcontainer/devcontainer.json    # Auto-start config

Scripts:
scripts/keep-alive-enhanced.sh     # Main keep-alive
scripts/start.sh                   # Start servers
scripts/urls.sh                    # Display URLs
scripts/status.sh                  # Check status

Documentation:
QUICK-START.md                     # Daily usage
setup/CODESPACE_SETUP_GUIDE.md     # Complete guide
scripts/README.md                  # Scripts reference
```

## 🎨 Design Rules

```
Icons:  Material Design Icons (width: 200px)
Colors: No purple
Layout: Always left-align
Format: No emoticons in designs
```

## 🔍 Troubleshooting

### Quick Fixes

```bash
# Scripts not executable
chmod +x scripts/*.sh

# Servers not running
./scripts/start.sh

# Need URLs
./scripts/urls.sh

# Full diagnosis
cd setup && ./verify-setup.sh
```

### Service Status

```bash
# Check if keep-alive is running
ps aux | grep keep-alive | grep -v grep

# Check backend
lsof -ti:8080

# Check frontend
lsof -ti:4173

# Check all at once
./scripts/status.sh
```

### Log Files

```bash
# Keep-alive activity
tail -f scripts/keep-alive.log

# Backend logs
tail -f /tmp/backend.log

# Frontend logs
tail -f /tmp/frontend.log
```

## 📚 SuperClaude Commands

```bash
/sc:help           # List all commands
/sc:implement      # Feature implementation
/sc:analyze        # Code analysis
/sc:test           # Run tests
/sc:document       # Generate docs
/sc:improve        # Code improvements
/sc:troubleshoot   # Debug issues
```

## 🔄 Workflows

### Starting Work

```bash
# 1. Check status
./scripts/status.sh

# 2. Get URLs if needed
./scripts/urls.sh

# 3. Start coding!
```

### Ending Work

```bash
# Option 1: Leave running (keep-alive maintains it)
# Nothing to do!

# Option 2: Stop servers
./scripts/stop.sh

# Option 3: Stop Codespace
# Codespaces menu → Stop Codespace
```

### After Codespace Restart

```bash
# Everything starts automatically!
# Just verify:
./scripts/status.sh
./scripts/urls.sh
```

## 🆘 Emergency Commands

```bash
# Kill everything on a port
kill $(lsof -ti:8080)   # Backend
kill $(lsof -ti:4173)   # Frontend

# Restart all services
./scripts/stop.sh && sleep 2 && ./scripts/start.sh

# Check what's using ports
lsof -i :8080
lsof -i :4173

# Force stop keep-alive
pkill -f keep-alive-enhanced

# Clean restart
./scripts/stop.sh
./scripts/stop-keep-alive.sh
sleep 3
./scripts/start-keep-alive-enhanced.sh
./scripts/start.sh
```

## 💰 Cost Saving

```bash
# Manual stop Codespace
# Codespaces menu → Stop Codespace

# Auto-stop timeout
# Settings → Codespaces → Idle timeout
# Recommended: 30 minutes

# Check if Codespace is running
# https://github.com/codespaces
# Green dot = running (charging)
# Gray = stopped (not charging)
```

## 🎓 Learning Resources

```
Claude Code Docs:     https://docs.claude.com/claude-code
Claude Yolo:          https://github.com/eastlondoner/claude-yolo
SuperClaude:          https://github.com/SuperClaude-Org/SuperClaude_Framework
Material Icons:       https://github.com/google/material-design-icons
Codespaces:           https://docs.github.com/codespaces
```

## 📊 Health Checks

```bash
# Full verification
cd setup && ./verify-setup.sh

# Quick check
./scripts/status.sh

# Service tests
curl localhost:8080     # Backend
curl localhost:4173     # Frontend

# Keep-alive working?
tail -3 scripts/keep-alive.log
# Should show recent heartbeats
```

## 🔐 Environment Variables

```bash
# Codespace-specific
echo $CODESPACE_NAME    # Your Codespace identifier

# Auto-confirm (set in devcontainer)
ANTHROPIC_AUTO_CONFIRM=true
CLAUDE_AUTO_ACCEPT=true
```

---

**💡 Pro Tip**: Bookmark this file for quick access during development!

**🔖 Bookmark These URLs**:
- Your Codespace URL (never changes!)
- This reference: `setup/QUICK_REFERENCE.md`
- Full guide: `setup/CODESPACE_SETUP_GUIDE.md`

---

Last Updated: $(date '+%Y-%m-%d')
