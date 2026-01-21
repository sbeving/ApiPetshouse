#!/bin/bash

# Quick Setup Script for Agent Petshouse Integration
# This script helps you quickly test and deploy your API

set -e

echo "🐾 Agent Petshouse - Quick Setup Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file first:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env with your credentials"
    exit 1
fi

echo -e "${GREEN}✅ Found .env file${NC}"
echo ""

# Step 1: Test Odoo Connection
echo "Step 1: Testing Odoo connection..."
echo "-----------------------------------"
if node test-odoo-connection.js; then
    echo -e "${GREEN}✅ Odoo connection successful!${NC}"
    echo ""
else
    echo -e "${RED}❌ Odoo connection failed!${NC}"
    echo ""
    echo "Please fix your Odoo credentials in .env:"
    echo "  - Use your real password OR generate an API key"
    echo "  - Verify ODOO_URL, ODOO_DB, and ODOO_USERNAME"
    echo ""
    echo "See ODOO_AUTH_GUIDE.md for help"
    exit 1
fi

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
echo "-----------------------------------"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Start dev server
echo "Step 3: Starting development server..."
echo "-----------------------------------"
echo ""
echo -e "${YELLOW}📡 Starting Next.js dev server...${NC}"
echo "   Local: http://localhost:3000"
echo "   API Docs: http://localhost:3000/api-docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
