#!/bin/bash

# Simple Chatbot - One-Tap Installation Script
# This script installs dependencies and optionally starts the development server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Print header
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Simple Chatbot - One-Tap Install   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
print_status "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Recommended version: 18.x or higher"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js found: $NODE_VERSION"

# Check if npm is installed
print_status "Checking for npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm found: v$NPM_VERSION"

echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_warning "node_modules directory already exists"
    read -p "Do you want to reinstall dependencies? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Removing old node_modules..."
        rm -rf node_modules package-lock.json
        print_success "Cleanup complete"
    else
        print_status "Skipping dependency installation"
        SKIP_INSTALL=true
    fi
fi

# Install dependencies
if [ "$SKIP_INSTALL" != true ]; then
    echo ""
    print_status "Installing dependencies..."
    echo ""

    npm install

    echo ""
    print_success "Dependencies installed successfully!"
fi

echo ""
print_success "Installation complete! 🎉"
echo ""

# Ask if user wants to start dev server
read -p "Do you want to start the development server now? (Y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    print_status "Starting development server..."
    echo ""
    print_status "The app will open at http://localhost:3000"
    echo ""
    print_warning "Press Ctrl+C to stop the server"
    echo ""

    npm run dev
else
    echo ""
    print_status "You can start the development server later with:"
    echo "  npm run dev"
    echo ""
    print_status "Other available commands:"
    echo "  npm run build   - Build for production"
    echo "  npm run preview - Preview production build"
    echo ""
fi
