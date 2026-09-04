#!/bin/bash
# start-dev.sh - Starts MongoDB and both dev servers

echo "==========================================="
echo "  🚀 Littroi Full-Stack Dev Launcher"
echo "==========================================="

# 1. Check if MongoDB is already running
if pgrep -x mongod > /dev/null; then
  echo "✅ MongoDB already running"
else
  echo "🔄 Starting MongoDB..."
  mkdir -p ~/data/db
  nohup /usr/local/mongodb/bin/mongod --dbpath ~/data/db --port 27017 --logpath ~/data/mongodb.log &
  sleep 3
  if pgrep -x mongod > /dev/null; then
    echo "✅ MongoDB started successfully (pid: $(pgrep -x mongod))"
    echo "   Data stored at: ~/data/db"
    echo "   Logs at: ~/data/mongodb.log"
  else
    echo "❌ MongoDB failed to start. Check ~/data/mongodb.log"
    exit 1
  fi
fi

echo ""
echo "==========================================="
echo "  MongoDB: mongodb://localhost:27017/littroi_db"
echo "  View data: Open MongoDB Compass → mongodb://localhost:27017/littroi"
echo ""
echo "  To start the API server:"
echo "    cd littroi-mern/server && npm run dev"
echo ""
echo "  To start the frontend:"
echo "    cd littroi-mern/client && npm run dev"
echo "==========================================="
