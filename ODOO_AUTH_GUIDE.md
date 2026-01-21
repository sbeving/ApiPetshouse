# Odoo Authentication Guide

## Problem
You're getting "Access Denied" errors when connecting to Odoo Online.

## Root Cause
The password in your `.env` file (`f1a3e57d47e85fd6e3f3837417e20ba7a89f5e44`) is incorrect or is an API key being used incorrectly.

## Solutions

### Option 1: Use Your Real Password (Recommended for Development)

1. Update `.env` with your **actual Odoo login password**:
   ```env
   ODOO_PASSWORD=your_actual_password_here
   ```

2. Restart your Next.js server:
   ```bash
   npm run dev
   ```

### Option 2: Generate and Use an API Key (Recommended for Production)

For Odoo Online (v14+), API keys are more secure:

#### Step-by-Step:

1. **Login to Odoo**
   - Go to: https://pets-house.odoo.com
   - Login with: saleh.touil.3@gmail.com

2. **Navigate to User Settings**
   - Click your profile icon (top right)
   - Select **My Profile** or **Preferences**

3. **Go to Account Security**
   - Find the **"Account Security"** tab
   - Or search for "API Keys" in settings

4. **Generate New API Key**
   - Click **"New API Key"**
   - Give it a description: "API Petshouse Development"
   - **Copy the key immediately** (it only shows once!)

5. **Update .env**
   ```env
   ODOO_PASSWORD=your_api_key_here
   ```

### Option 3: Verify Database Name

Sometimes the database name is different:

1. **Check your Odoo URL** when logged in
2. **Look for the database parameter** in the URL
3. **Update .env if different**:
   ```env
   ODOO_DB=actual-database-name
   ```

## Testing Your Connection

Run this command to test:
```bash
node test-odoo-connection.js
```

You should see:
```
✅ Authentication Successful!
User ID: 2
Session ID: abc123...
Username: saleh.touil.3@gmail.com
```

## Common Issues

### Issue: "Access Denied"
- **Solution**: Wrong password/API key
- **Fix**: Use your actual password or generate a new API key

### Issue: "Database does not exist"
- **Solution**: Wrong database name
- **Fix**: Verify the database name in Odoo URL

### Issue: "Connection Timeout"
- **Solution**: URL is wrong or server is down
- **Fix**: Verify URL is accessible in browser

## Next Steps

Once authentication works:
1. Restart your Next.js dev server: `npm run dev`
2. Test API endpoint:
   ```bash
   curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
     http://localhost:3000/api/products?limit=10
   ```

## Security Notes

- ✅ **DO**: Use API keys in production
- ✅ **DO**: Store credentials in environment variables
- ✅ **DO**: Rotate API keys regularly
- ❌ **DON'T**: Commit `.env` to git
- ❌ **DON'T**: Share API keys publicly
- ❌ **DON'T**: Use passwords in production (use API keys instead)
