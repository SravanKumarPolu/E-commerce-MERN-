#!/bin/bash

# E-commerce MERN Environment Setup Script
# This script copies env.example files to .env for all three applications

echo "🛠️  Setting up Environment Variables for E-commerce MERN Stack"
echo "============================================================="

# Function to copy env file
copy_env_file() {
    local dir=$1
    local app_name=$2
    
    if [ -d "$dir" ]; then
        echo "📁 Setting up $app_name..."
        cd "$dir"
        
        if [ -f "env.example" ]; then
            if [ -f ".env" ]; then
                echo "⚠️  .env already exists in $dir"
                read -p "   Overwrite? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    cp env.example .env
                    echo "✅ Copied env.example to .env in $dir"
                else
                    echo "⏭️  Skipped $dir"
                fi
            else
                cp env.example .env
                echo "✅ Created .env from env.example in $dir"
            fi
        else
            echo "❌ env.example not found in $dir"
        fi
        
        cd ..
    else
        echo "❌ Directory $dir not found"
    fi
    echo
}

# Main setup
echo "Starting environment setup..."
echo

# Set up backend
copy_env_file "backend" "Backend API"

# Set up frontend
copy_env_file "frontend" "Frontend (Customer App)"

# Set up admin
copy_env_file "admin" "Admin Panel"

echo "🎉 Environment setup complete!"
echo
echo "📝 Next steps:"
echo "   1. Edit each .env file with your actual values"
echo "   2. Set up MongoDB, Cloudinary, and payment gateways"
echo "   3. Update VITE_BACKEND_URL in frontend and admin .env files"
echo "   4. Start the applications: backend → frontend → admin"
echo
echo "📚 For detailed setup instructions, see:"
echo "   - ./ENVIRONMENT_SETUP.md (main guide)"
echo "   - ./backend/ENVIRONMENT_SETUP.md"
echo "   - ./frontend/ENVIRONMENT_SETUP.md"
echo "   - ./admin/ENVIRONMENT_SETUP.md"
echo
echo "🚀 Happy coding!" 