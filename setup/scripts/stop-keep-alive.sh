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
