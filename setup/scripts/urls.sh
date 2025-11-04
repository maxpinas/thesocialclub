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
