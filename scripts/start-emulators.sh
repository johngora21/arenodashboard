#!/bin/bash

echo "🚀 Starting Firebase Emulators..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Start Firebase emulators
firebase emulators:start \
  --only auth,firestore,storage \
  --import=./emulator-data \
  --export-on-exit=./emulator-data

echo "✅ Firebase Emulators started successfully!"
echo "📊 Emulator UI: http://localhost:4000"
echo "🔐 Auth Emulator: http://localhost:9099"
echo "🗄️  Firestore Emulator: http://localhost:8080"
echo "📦 Storage Emulator: http://localhost:9199" 