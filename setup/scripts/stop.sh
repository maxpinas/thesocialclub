#!/bin/bash
echo "🛑 Stopping all servers..."

BACKEND_PID=$(lsof -ti:8080 2>/dev/null)
[ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID && echo "✅ Backend stopped" || echo "ℹ️  Backend not running"

FRONTEND_PID=$(lsof -ti:4173 2>/dev/null)
[ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID && echo "✅ Frontend stopped" || echo "ℹ️  Frontend not running"

echo "✅ All servers stopped!"
