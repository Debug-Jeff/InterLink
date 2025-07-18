#!/bin/bash
# Cross-platform port killer script

if [ $# -eq 0 ]; then
    echo "Usage: ./kill-port.sh [port_number]"
    echo "Example: ./kill-port.sh 5000"
    exit 1
fi

PORT=$1
echo "Killing processes on port $PORT..."

# For Unix/Linux/macOS
if command -v lsof &> /dev/null; then
    PID=$(lsof -ti:$PORT)
    if [ ! -z "$PID" ]; then
        echo "Killing process ID: $PID"
        kill -9 $PID
        echo "Done! Port $PORT should now be free."
    else
        echo "No process found on port $PORT"
    fi
# For Windows (using Git Bash)
elif command -v netstat &> /dev/null; then
    PID=$(netstat -ano | findstr :$PORT | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
        echo "Killing process ID: $PID"
        taskkill //F //PID $PID 2>/dev/null
        echo "Done! Port $PORT should now be free."
    else
        echo "No process found on port $PORT"
    fi
else
    echo "Neither lsof nor netstat found. Please install required tools."
    exit 1
fi