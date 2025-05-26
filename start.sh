#!/bin/bash

# Start ngrok on the Nuxt port (default is 3000)
ngrok http 3000 > /dev/null &
NGROK_PID=$!

# Wait for ngrok to initialize
sleep 5

# Get ngrok public URL using its API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

# Validate ngrok started
if [ -z "$NGROK_URL" ]; then
  echo "❌ Failed to get ngrok URL"
  kill $NGROK_PID
  exit 1
fi

# Update .env file with new API_URL
sed -i '' "s|^API_URL=.*|API_URL=${NGROK_URL}/api/v1|" .env

echo "✅ Updated API_URL to ${NGROK_URL}/api/v1"

# Start Nuxt dev server
npx nuxt dev

# Kill ngrok after Nuxt stops
kill $NGROK_PID
