#!/bin/bash

# SAI Sports Platform - Build script for all platforms
# This script builds the Flutter app for Windows, macOS, and Linux

echo "🏗️  Building SAI Sports Platform for all platforms..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed or not in PATH"
    exit 1
fi

# Get dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get

# Create build directory
mkdir -p dist

# Build for Windows (if on Windows or cross-compilation is set up)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Building for Windows..."
    flutter build windows --release
    if [ $? -eq 0 ]; then
        echo "✅ Windows build completed"
        # Copy to dist folder
        cp -r build/windows/runner/Release/* dist/windows/
    else
        echo "❌ Windows build failed"
    fi
fi

# Build for macOS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Building for macOS..."
    flutter build macos --release
    if [ $? -eq 0 ]; then
        echo "✅ macOS build completed"
        # Copy to dist folder
        mkdir -p dist/macos
        cp -r build/macos/Build/Products/Release/*.app dist/macos/
    else
        echo "❌ macOS build failed"
    fi
fi

# Build for Linux (if on Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Building for Linux..."
    flutter build linux --release
    if [ $? -eq 0 ]; then
        echo "✅ Linux build completed"
        # Copy to dist folder
        mkdir -p dist/linux
        cp -r build/linux/x64/release/bundle/* dist/linux/
    else
        echo "❌ Linux build failed"
    fi
fi

echo "🎉 Build process completed!"
echo "📁 Built applications are in the 'dist' folder"
echo ""
echo "Next steps:"
echo "1. Test the applications on their respective platforms"
echo "2. Create installers using platform-specific tools"
echo "3. Code sign applications for distribution (if needed)"
echo "4. Distribute through appropriate channels"