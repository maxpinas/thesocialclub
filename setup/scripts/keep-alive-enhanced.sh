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
