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
