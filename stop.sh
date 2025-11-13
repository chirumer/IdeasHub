#!/bin/bash

echo "🛑 Stopping Ideas Hub servers..."
echo ""

# Find and kill backend process (port 3001)
BACKEND_PID=$(lsof -ti:3001)
if [ ! -z "$BACKEND_PID" ]; then
    echo "🔴 Stopping backend server (PID: $BACKEND_PID)..."
    kill -9 $BACKEND_PID
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend not running"
fi

# Find and kill frontend process (port 5173 or 5174)
FRONTEND_PID=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "🔴 Stopping frontend server (PID: $FRONTEND_PID)..."
    kill -9 $FRONTEND_PID
    echo "✅ Frontend stopped"
else
    # Check if running on alternate port
    FRONTEND_PID=$(lsof -ti:5174)
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "🔴 Stopping frontend server on port 5174 (PID: $FRONTEND_PID)..."
        kill -9 $FRONTEND_PID
        echo "✅ Frontend stopped"
    else
        echo "ℹ️  Frontend not running"
    fi
fi

# Also kill any tsx or vite processes that might be hanging
TSX_PIDS=$(pgrep -f "tsx watch")
if [ ! -z "$TSX_PIDS" ]; then
    echo "🔴 Stopping tsx processes..."
    kill -9 $TSX_PIDS 2>/dev/null
fi

VITE_PIDS=$(pgrep -f "vite")
if [ ! -z "$VITE_PIDS" ]; then
    echo "🔴 Stopping vite processes..."
    kill -9 $VITE_PIDS 2>/dev/null
fi

echo ""
echo "✅ All servers stopped"
echo "💡 Use ./start.sh to start again"
