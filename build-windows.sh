#!/bin/zsh

echo "🚀 Starting Windows build with retry logic..."

# Clean previous builds
rm -rf dist 2>/dev/null

# Build with retry for network issues
for i in {1..3}; do
  docker buildx build \
    --platform linux/amd64 \
    --output type=local,dest=./dist \
    --no-cache \
    --progress plain \
    .
  
  if [[ $(find dist -name "*.exe" -type f 2>/dev/null | wc -l) -gt 0 ]]; then
    echo "\n✅ Build successful after attempt $i!"
    find dist -name "*.exe" -type f
    exit 0
  else
    echo "\n⚠️ Attempt $i failed, retrying..."
    sleep 5
  fi
done

echo "\n❌ Build failed after 3 attempts"
exit 1