# 🔧 Troubleshooting Guide

## Current Issue: "Odoo Session Expired" / "No UID returned"

### Root Cause Analysis

**Status**: Authentication is failing because Odoo is rejecting the credentials.

**Evidence**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "uid": null  ← This means credentials were rejected
  }
}
```

### What We've Confirmed

✅ **Odoo server is accessible** - Connection works  
✅ **Database name is correct** - `pets-house` exists  
✅ **API endpoint is correct** - `/web/session/authenticate` responds  
❌ **Credentials are being rejected** - `uid: null` in response  

---

## Solution Path

### Option 1: Verify Current Credentials (RECOMMENDED)

1. **Test web login first**:
   ```
   Visit: https://pets-house.odoo.com
   Try logging in with: saleh.touil.3@gmail.com
   ```

2. **If login works** → Copy exact password to `.env`:
   ```env
   ODOO_PASSWORD=YourExactPassword
   ```

3. **If login fails** → Password needs reset or different account

### Option 2: Check for Different Username

**Your test showed**: `petshouse.sarl` as username

This suggests the login might be:
```env
ODOO_USERNAME=petshouse.sarl
ODOO_PASSWORD=<the correct password>
```

**Why this matters**: Some Odoo instances use:
- Company username (e.g., `petshouse.sarl`)
- Email address (e.g., `saleh.touil.3@gmail.com`)
- Admin username (e.g., `admin`)

### Option 3: Check for API Access Restrictions

Some Odoo accounts have API access disabled. Check:

1. Log in to Odoo web interface
2. Go to **Settings** → **Users & Companies** → **Users**
3. Find your user
4. Check **Access Rights**:
   - Technical Settings must be enabled
   - No "API Access" restriction

---

## Quick Fix Commands

### Test Current .env Credentials
```bash
node test-credentials.js
```

### Find Available Databases
```bash
node find-odoo-database.js
```

### Direct Connection Test
```bash
node test-odoo-direct.js
```

---

## Common Authentication Issues

### Issue: `uid: null` Response
**Meaning**: Odoo received request but rejected credentials  
**Fix**: Verify username and password are correct

### Issue: "Access Denied"
**Meaning**: Password is definitely wrong  
**Fix**: Reset password or get correct one

### Issue: "Session Expired"
**Meaning**: Session timed out (session management is working)  
**Fix**: Our retry logic should handle this (already implemented)

### Issue: "No UID returned"
**Meaning**: Same as `uid: null`  
**Fix**: Check credentials and database name

### Issue: Connection timeout
**Meaning**: Network or firewall issue  
**Fix**: Check URL, VPN, or firewall settings

---

## What's Already Fixed

✅ **Session management** - Auto re-authentication on expiry  
✅ **Retry logic** - Automatically retries on session errors  
✅ **Concurrent request handling** - Prevents multiple auth attempts  
✅ **Error detection** - Detects various session expiry patterns  

The code is ready - we just need the correct credentials!

---

## Next Steps

1. **Complete the credential test** (running now)
2. **Update `.env`** with working credentials:
   ```env
   ODOO_USERNAME=<correct-username>
   ODOO_PASSWORD=<correct-password>
   ```
3. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
4. **Test API**:
   - Visit: http://localhost:3000/api-docs
   - Try "Execute" on GET /api/products
   - Should see: "Authenticating with Odoo..." → "✅ Authenticated successfully"

---

## Environment File Template

```env
# Odoo Configuration
ODOO_URL=https://pets-house.odoo.com
ODOO_DB=pets-house
ODOO_USERNAME=<YOUR-CORRECT-USERNAME>  ← UPDATE THIS
ODOO_PASSWORD=<YOUR-CORRECT-PASSWORD>  ← UPDATE THIS

# API Authentication (these are fine)
API_BEARER_TOKEN=Ktk5+zi6f917Asc/G89go8R4lnmYepoEJTN7r8vWX+8=
API_KEY=xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=

# Rate Limiting (these are fine)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

---

## Contact Points

If issues persist:

1. **Odoo Support**: Check if account has API access
2. **Database Admin**: Verify user permissions
3. **Account Settings**: Check for 2FA or security blocks

---

## Success Indicators

When credentials are correct, you'll see:

```
🔐 Odoo Authentication Tester
TEST 1: Testing .env credentials
✅ SUCCESS! Your .env credentials work!
   User ID: 2
   Username: petshouse.sarl
```

Then the API will work and show:
```
Authenticating with Odoo...
✅ Authenticated successfully as UID: 2
```

---

**Last Updated**: After discovering credentials rejection (uid: null)  
**Status**: Waiting for correct credentials  
**Blocker**: Wrong username or password in .env
