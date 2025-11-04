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
