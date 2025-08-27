#!/bin/bash

# Exit on error
set -e

# Debug info
echo "Running vercel-build.sh"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Run the vercel-build script from package.json
echo "Running vercel-build script..."
npm run vercel-build