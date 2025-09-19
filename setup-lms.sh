#!/bin/bash

echo "🎓 EduLMS Setup Script"
echo "======================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Extract the LMS application
echo "📦 Extracting LMS application..."
if [ -f "lms-app-complete.tar.gz" ]; then
    tar -xzf lms-app-complete.tar.gz
    echo "✅ Extracted from tar.gz"
elif [ -f "lms-app-complete.zip" ]; then
    unzip -q lms-app-complete.zip
    echo "✅ Extracted from zip"
else
    echo "❌ No compressed file found. Please ensure lms-app-complete.tar.gz or lms-app-complete.zip is in the current directory."
    exit 1
fi

# Navigate to the project directory
cd lms-app

echo ""
echo "📁 Project extracted to: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update your Clerk publishable key in .env file"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "🔑 Your Clerk key is already configured in .env"
echo "   Key: $(grep VITE_CLERK_PUBLISHABLE_KEY .env | cut -d'=' -f2)"
echo ""
echo "🚀 To start the development server:"
echo "   cd lms-app && npm run dev"
echo ""
echo "📚 For more information, see README.md"