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
