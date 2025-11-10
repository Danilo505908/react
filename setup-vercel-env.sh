#!/bin/bash

# Script to set up environment variables on Vercel
# Make sure you're logged in: npx vercel login

echo "🚀 Setting up environment variables on Vercel..."
echo ""

# Check if user is logged in
if ! npx vercel whoami &>/dev/null; then
    echo "❌ You are not logged in to Vercel."
    echo "Please run: npx vercel login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Values
API_URL="https://notehub-public.goit.study/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmFobWFydWs5MUBnbWFpbC5jb20iLCJpYXQiOjE3NjA3OTg5OTB9.TFUi8cyr0fiziAHuENQ-Qg8e4xhck4lXdS540l6c4Dw"

# Function to add env variable
add_env_var() {
    local name=$1
    local value=$2
    local env=$3
    
    echo -n "  Setting $name for $env... "
    local output
    output=$(echo "$value" | npx vercel env add "$name" "$env" --force 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "✅"
        return 0
    else
        # Check if it's because variable already exists
        if echo "$output" | grep -qi "already exists\|duplicate"; then
            echo "✅ (already exists)"
            return 0
        else
            echo "❌ Failed"
            echo "   Error: $output" | head -1
            return 1
        fi
    fi
}

# Set NEXT_PUBLIC_API_URL for all environments
echo "Setting NEXT_PUBLIC_API_URL..."
add_env_var "NEXT_PUBLIC_API_URL" "$API_URL" "production"
add_env_var "NEXT_PUBLIC_API_URL" "$API_URL" "preview"
add_env_var "NEXT_PUBLIC_API_URL" "$API_URL" "development"

echo ""
echo "Setting NEXT_PUBLIC_NOTEHUB_TOKEN..."
add_env_var "NEXT_PUBLIC_NOTEHUB_TOKEN" "$TOKEN" "production"
add_env_var "NEXT_PUBLIC_NOTEHUB_TOKEN" "$TOKEN" "preview"
add_env_var "NEXT_PUBLIC_NOTEHUB_TOKEN" "$TOKEN" "development"

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Verifying environment variables..."
npx vercel env ls production 2>/dev/null | grep -E "NEXT_PUBLIC_API_URL|NEXT_PUBLIC_NOTEHUB_TOKEN" || echo "  (Run 'npx vercel env ls' to see all variables)"
echo ""
echo "⚠️  IMPORTANT: You need to redeploy your application for the changes to take effect."
echo ""
echo "To redeploy, run one of these commands:"
echo "  npx vercel --prod"
echo "  Or trigger a new deployment from the Vercel dashboard"
echo ""
echo "After redeployment, check your site - the 401 error should be resolved!"

