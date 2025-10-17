# Chat Server Configuration for Office Add-in

This document explains how to configure your chat server at `localhost:3001` to work properly with the Office Add-in iframe embedding.

## Quick Fix Checklist

Office Add-ins block cross-origin iframes by default. To make the chat widget load, your chat server **MUST** have:

### 1. ✅ Run on HTTPS (not HTTP)

Office Add-ins require HTTPS. Mixed content (HTTPS add-in loading HTTP iframe) will be blocked by the browser.

**Solution**: Run your chat server with a dev certificate on `https://localhost:3001`

```bash
# Generate a dev cert (if you don't have one)
# Using mkcert (recommended):
mkcert localhost

# Then start your server with HTTPS enabled
# Example for Node.js/Express:
const https = require('https');
const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

https.createServer(httpsOptions, app).listen(3001);
```

### 2. ✅ Remove X-Frame-Options Header

If your server sends `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN`, the iframe will be blocked.

**Solution**: Don't send the `X-Frame-Options` header, or use:

```javascript
// Option 1: Don't set X-Frame-Options at all (recommended for dev)

// Option 2: If you must set it, use ALLOW-FROM (though deprecated):
// res.setHeader('X-Frame-Options', 'ALLOW-FROM https://localhost:3000');
```

### 3. ✅ Set Content-Security-Policy with frame-ancestors

Allow Office hosts and your add-in to iframe your chat.

**Solution**: Add this header to your chat server responses:

```javascript
res.setHeader(
  'Content-Security-Policy',
  "frame-ancestors 'self' https://localhost:* https://*.office.com https://*.officeapps.live.com ms-office:;"
);
```

### 4. ✅ Configure CORS (if needed)

If your chat widget makes cross-origin API calls back to your server:

```javascript
// Enable CORS
res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### 5. ✅ Fix Cookies (if using authentication)

Cookies in cross-origin iframes require special attributes:

```javascript
// When setting cookies in your chat server:
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,        // Required for HTTPS
  sameSite: 'none',    // Required for cross-origin iframe
});
```

---

## Complete Express.js Example

Here's a minimal Express server configured correctly:

```javascript
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// Middleware to set required headers
app.use((req, res, next) => {
  // Don't send X-Frame-Options (or set it appropriately)
  // res.removeHeader('X-Frame-Options'); // if you're using helmet

  // Set CSP to allow Office hosts
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://localhost:* https://*.office.com https://*.officeapps.live.com ms-office:;"
  );

  // CORS headers (if needed)
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

// Your chat routes
app.get('/chat/:id', (req, res) => {
  // Serve your chat widget HTML
  res.send(/* your chat widget HTML */);
});

// HTTPS server
const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

https.createServer(httpsOptions, app).listen(3001, () => {
  console.log('Chat server running on https://localhost:3001');
});
```

---

## Debugging Tips

### Check if the iframe is loading

Open browser DevTools in the Office Add-in task pane:

1. **Windows**: Right-click task pane → "Inspect"
2. **Mac**: Right-click task pane → "Inspect Element"

Look for errors in the Console:

- **"Mixed Content"** → Chat server not using HTTPS
- **"Refused to display ... frame because it set 'X-Frame-Options'"** → Remove X-Frame-Options header
- **"Refused to connect ... violates CSP 'frame-ancestors'"** → Fix Content-Security-Policy
- **CORS errors** → Fix CORS headers
- **Cookie warnings** → Set cookies with `SameSite=None; Secure`

### Network tab

Check if any requests are being made to `https://localhost:3001`. If you see 0 requests, the iframe is being blocked before it even loads.

---

## Production Considerations

For production, update the CSP header to include your production domains:

```javascript
res.setHeader(
  'Content-Security-Policy',
  "frame-ancestors 'self' https://yourdomain.com https://*.office.com https://*.officeapps.live.com ms-office:;"
);
```

And update the Office Add-in manifest to include your production chat server domain in `<AppDomains>`.

---

## Summary

**The key requirements are:**
1. ✅ HTTPS on localhost:3001 (not HTTP)
2. ✅ No `X-Frame-Options` header (or allow framing)
3. ✅ CSP with proper `frame-ancestors`
4. ✅ CORS headers (if making cross-origin requests)
5. ✅ Cookies with `SameSite=None; Secure` (if using auth)

After making these changes, restart both servers and reload the Office Add-in.
