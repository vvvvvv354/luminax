#!/bin/bash

# SAI Sports Platform - Quick Development Start Script

echo "🚀 Starting SAI Sports Platform Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing web application dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🌐 Starting web development server..."
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Available accounts for testing:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👩‍🏫 Coach Account:"
echo "   Email: coach@sai.gov.in"
echo "   Password: coach123"
echo ""
echo "🏃‍♀️ Athlete Account:"
echo "   Email: athlete@sai.gov.in" 
echo "   Password: athlete123"
echo ""
echo "👨‍💼 Official Account:"
echo "   Email: official@sai.gov.in"
echo "   Password: official123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Features to test:"
echo "• Enhanced Coach Dashboard with messaging & personal training"
echo "• Real-time athlete communication"
echo "• Personal training plan creation"
echo "• Session scheduling"
echo "• Video analysis tools"
echo "• Performance analytics"
echo "• Mental training modules"
echo ""
echo "💡 To build desktop app:"
echo "   cd flutter_wrapper && flutter run -d windows/macos/linux"
echo ""
echo "Press Ctrl+C to stop the development server"
echo ""

# Start the development server
npm start