# Admin Panel Environment Setup

Create a `.env` file in the admin directory with the following variables:

## Required Environment Variables

```bash
# Backend API URL - Must match your backend server URL
VITE_BACKEND_URL=http://localhost:4000

# Admin Panel Configuration
VITE_APP_NAME=SKR E-Commerce Admin
VITE_APP_VERSION=1.0.0
```

## Optional Environment Variables

```bash
# Admin Panel Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_BULK_OPERATIONS=true

# File Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Dashboard Settings
VITE_ITEMS_PER_PAGE=10
VITE_DEFAULT_CURRENCY=USD
VITE_CURRENCY_SYMBOL=$

# Environment Mode
VITE_NODE_ENV=development

# Security Settings (Admin Panel)
VITE_SESSION_TIMEOUT=3600000
VITE_AUTO_LOGOUT=true

# API Configuration
VITE_API_TIMEOUT=30000
VITE_REQUEST_RETRY_COUNT=3
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the backend URL:**
   - For development: `VITE_BACKEND_URL=http://localhost:4000`
   - For production: `VITE_BACKEND_URL=https://your-api-domain.com`

3. **Configure admin settings:**
   - Set appropriate file size limits
   - Configure session timeout
   - Enable/disable features as needed

## Important Notes

- **Vite Environment Variables**: Must be prefixed with `VITE_` to be accessible in the admin panel
- **Security**: Never commit your `.env` file to version control
- **Backend Connection**: Admin panel directly connects to your backend API
- **Authentication**: Admin credentials are managed on the backend

## Usage in Code

Access environment variables in your admin components:

```typescript
// Backend URL (already used in App.tsx)
export const backendUrl: string = import.meta.env.VITE_BACKEND_URL;

// File upload limits
const maxFileSize = import.meta.env.VITE_MAX_FILE_SIZE;

// Feature toggles
const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
```

## Current Usage

The admin panel currently uses these environment variables:

1. **`VITE_BACKEND_URL`** - Used in `src/App.tsx` for API calls
2. **API Endpoints used:**
   - `/api/user/admin` - Admin login
   - `/api/product/add` - Add products
   - `/api/product/list` - List products
   - `/api/product/remove` - Remove products

## Development vs Production

### Development (.env.development)
```bash
VITE_BACKEND_URL=http://localhost:4000
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_SESSION_TIMEOUT=7200000
```

### Production (.env.production)
```bash
VITE_BACKEND_URL=https://your-api-domain.com
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT=3600000
```

## Security Considerations

- **Admin Access**: Ensure VITE_BACKEND_URL points to a secure HTTPS endpoint in production
- **File Uploads**: Set appropriate file size and type restrictions
- **Session Management**: Configure appropriate timeout values
- **Environment Files**: Never commit `.env` files to version control

## Troubleshooting

### Common Issues:

1. **Cannot connect to backend:**
   - Check `VITE_BACKEND_URL` is correct
   - Ensure backend server is running
   - Verify CORS settings on backend

2. **File upload failures:**
   - Check `VITE_MAX_FILE_SIZE` setting
   - Verify file types are allowed
   - Ensure backend multer configuration matches

3. **Admin login issues:**
   - Verify backend admin credentials are set
   - Check network connectivity
   - Ensure admin auth middleware is working 