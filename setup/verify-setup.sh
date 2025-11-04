#!/bin/bash
###########################################
# Codespace Setup Verification Script
# Checks all components are properly installed
###########################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Codespace Setup Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ERRORS=0
WARNINGS=0

##################################
# CHECK 1: Claude Code
##################################
echo "Checking Claude Code..."
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>&1 | head -1 || echo "unknown")
    print_success "Claude Code installed: $CLAUDE_VERSION"
else
    print_error "Claude Code not found"
    echo "   Install with: npm install -g @anthropic-ai/claude-code"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 2: Claude Yolo
##################################
echo "Checking Claude Yolo..."
if command -v claude-yolo &> /dev/null; then
    YOLO_PATH=$(which claude-yolo)
    print_success "Claude Yolo installed: $YOLO_PATH"
else
    print_error "Claude Yolo not found"
    echo "   Install with: npm install -g claude-yolo"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 3: VS Code Settings
##################################
echo "Checking VS Code settings..."
if [ -f ".vscode/settings.json" ]; then
    if grep -q "yoloMode.*true" .vscode/settings.json 2>/dev/null; then
        print_success "Yolo Mode enabled in VS Code"
    else
        print_warning "Yolo Mode not enabled in VS Code settings"
        echo "   Add: {\"claudeCodeChat.permissions.yoloMode\": true}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_error "VS Code settings.json not found"
    echo "   Create .vscode/settings.json with yolo mode config"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 4: SuperClaude Framework
##################################
echo "Checking SuperClaude Framework..."
if [ -d "$HOME/.claude" ]; then
    FILE_COUNT=$(ls -1 ~/.claude/*.md 2>/dev/null | wc -l)
    if [ $FILE_COUNT -gt 0 ]; then
        print_success "SuperClaude installed ($FILE_COUNT config files)"

        # Check for essential files
        ESSENTIAL_FILES=(
            "CLAUDE.md"
            "FLAGS.md"
            "PRINCIPLES.md"
            "RULES.md"
        )

        MISSING_FILES=()
        for file in "${ESSENTIAL_FILES[@]}"; do
            if [ ! -f "$HOME/.claude/$file" ]; then
                MISSING_FILES+=("$file")
            fi
        done

        if [ ${#MISSING_FILES[@]} -gt 0 ]; then
            print_warning "Missing some SuperClaude files: ${MISSING_FILES[*]}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        print_error "SuperClaude directory exists but no config files found"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_error "SuperClaude config directory not found (~/.claude/)"
    echo "   Install with: npm install @bifrost_inc/superclaude"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 5: Scripts Directory
##################################
echo "Checking scripts directory..."
if [ -d "scripts" ]; then
    SCRIPT_COUNT=$(ls -1 scripts/*.sh 2>/dev/null | wc -l)
    print_success "Scripts directory exists ($SCRIPT_COUNT scripts)"

    # Check for essential scripts
    ESSENTIAL_SCRIPTS=(
        "start.sh"
        "stop.sh"
        "urls.sh"
        "status.sh"
        "keep-alive-enhanced.sh"
        "start-keep-alive-enhanced.sh"
        "stop-keep-alive.sh"
    )

    MISSING_SCRIPTS=()
    for script in "${ESSENTIAL_SCRIPTS[@]}"; do
        if [ ! -f "scripts/$script" ]; then
            MISSING_SCRIPTS+=("$script")
        fi
    done

    if [ ${#MISSING_SCRIPTS[@]} -gt 0 ]; then
        print_warning "Missing scripts: ${MISSING_SCRIPTS[*]}"
        WARNINGS=$((WARNINGS + 1))
    fi

    # Check if scripts are executable
    NOT_EXECUTABLE=()
    for script in "${ESSENTIAL_SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ] && [ ! -x "scripts/$script" ]; then
            NOT_EXECUTABLE+=("$script")
        fi
    done

    if [ ${#NOT_EXECUTABLE[@]} -gt 0 ]; then
        print_warning "Scripts not executable: ${NOT_EXECUTABLE[*]}"
        echo "   Fix with: chmod +x scripts/*.sh"
        WARNINGS=$((WARNINGS + 1))
    else
        print_success "All scripts are executable"
    fi
else
    print_error "Scripts directory not found"
    echo "   Create with setup script or manually"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 6: Devcontainer
##################################
echo "Checking devcontainer configuration..."
if [ -f ".devcontainer/devcontainer.json" ]; then
    print_success "Devcontainer configuration exists"

    # Check for essential config
    if grep -q "postStartCommand" .devcontainer/devcontainer.json 2>/dev/null; then
        print_success "Auto-start configured"
    else
        print_warning "postStartCommand not found in devcontainer"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q "forwardPorts" .devcontainer/devcontainer.json 2>/dev/null; then
        PORTS=$(grep -A 5 "forwardPorts" .devcontainer/devcontainer.json | grep -o '[0-9]\{4\}' | tr '\n' ',' | sed 's/,$//')
        print_success "Port forwarding configured: $PORTS"
    else
        print_warning "Port forwarding not configured"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_error "Devcontainer configuration not found"
    echo "   Create .devcontainer/devcontainer.json"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 7: Material Icons (Optional)
##################################
echo "Checking Material Design Icons..."
if [ -d "$HOME/material-design-icons" ]; then
    ICON_COUNT=$(find ~/material-design-icons -name "*.svg" 2>/dev/null | wc -l)
    print_success "Material Design Icons installed ($ICON_COUNT icons)"
else
    print_info "Material Design Icons not installed (optional)"
    echo "   Install with: cd ~ && git clone https://github.com/google/material-design-icons.git"
fi

##################################
# CHECK 8: Node & npm
##################################
echo "Checking Node.js environment..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 9: Git
##################################
echo "Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git installed: $GIT_VERSION"
else
    print_error "Git not found"
    ERRORS=$((ERRORS + 1))
fi

##################################
# CHECK 10: Running Services
##################################
echo "Checking running services..."

# Check keep-alive
if ps aux | grep keep-alive-enhanced | grep -v grep > /dev/null 2>&1; then
    if [ -f "scripts/keep-alive.pid" ]; then
        PID=$(cat scripts/keep-alive.pid 2>/dev/null)
        print_success "Keep-alive service running (PID: $PID)"
    else
        print_success "Keep-alive service running"
    fi
else
    print_info "Keep-alive service not running (will start on Codespace boot)"
fi

# Check backend
if lsof -ti:8080 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti:8080)
    print_success "Backend server running (PID: $BACKEND_PID, Port: 8080)"
else
    print_info "Backend server not running (will start on Codespace boot)"
fi

# Check frontend
if lsof -ti:4173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti:4173)
    print_success "Frontend server running (PID: $FRONTEND_PID, Port: 4173)"
else
    print_info "Frontend server not running (will start on Codespace boot)"
fi

##################################
# CHECK 11: Documentation Files
##################################
echo "Checking documentation..."
DOC_FILES=(
    "QUICK-START.md"
    "setup/CODESPACE_SETUP_GUIDE.md"
    "scripts/README.md"
)

DOC_COUNT=0
for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        DOC_COUNT=$((DOC_COUNT + 1))
    fi
done

if [ $DOC_COUNT -eq ${#DOC_FILES[@]} ]; then
    print_success "All documentation files present"
else
    print_warning "Missing $((${#DOC_FILES[@]} - DOC_COUNT)) documentation file(s)"
    WARNINGS=$((WARNINGS + 1))
fi

##################################
# SUMMARY
##################################
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    print_success "🎉 Perfect! All checks passed!"
    echo ""
    echo "Your Codespace is fully configured and ready to use."
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./scripts/status.sh"
    echo "  2. Run: ./scripts/urls.sh"
    echo "  3. Start coding!"

elif [ $ERRORS -eq 0 ]; then
    print_success "✅ All critical checks passed!"
    print_warning "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "Your Codespace is functional but could be optimized."
    echo "Review the warnings above for improvements."

else
    print_error "❌ $ERRORS error(s) and $WARNINGS warning(s) found"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo "See: setup/CODESPACE_SETUP_GUIDE.md for help"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Exit with error code if there are errors
if [ $ERRORS -gt 0 ]; then
    exit 1
else
    exit 0
fi
