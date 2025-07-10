# API Routes Overview

This document lists all the registered API routes in the backend server.

## Base URL
```
http://localhost:4000/api
```

## User Routes (`/api/user`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/user/login` | User login | None |
| POST | `/api/user/register` | User registration | None |
| POST | `/api/user/admin` | Admin login | None |

## Product Routes (`/api/product`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/product/add` | Add new product | `adminAuth`, `upload.fields()` |
| POST | `/api/product/single` | Get single product | None |
| POST | `/api/product/remove` | Remove product | `adminAuth` |
| GET | `/api/product/list` | List all products | None |

## Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/cart/add` | Add product to cart | `userAuth` |
| POST | `/api/cart/get` | Get user cart data | `userAuth` |
| POST | `/api/cart/update` | Update cart quantities | `userAuth` |

## Order Routes (`/api/order`)

### Admin Features
| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/order/list` | Get all orders | `adminAuth` |
| POST | `/api/order/status` | Update order status | `adminAuth` |

### Payment Features
| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/order/place` | Place COD order | `userAuth` |
| POST | `/api/order/stripe` | Place Stripe order | `userAuth` |
| POST | `/api/order/razorpay` | Place Razorpay order | `userAuth` |
| POST | `/api/order/paytm` | Place Paytm order | `userAuth` |
| POST | `/api/order/gpay` | Place Google Pay order | `userAuth` |

### Verification Features
| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/order/verifyStripe` | Verify Stripe payment | `userAuth` |
| POST | `/api/order/verifyRazorpay` | Verify Razorpay payment | `userAuth` |

### User Features
| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| POST | `/api/order/userorders` | Get user orders | `userAuth` |

## Health Check

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| GET | `/` | API health check | None |

## Middleware Descriptions

- **`adminAuth`**: Validates admin JWT token
- **`userAuth`**: Validates user JWT token  
- **`upload.fields()`**: Handles multiple image file uploads
- **`cors`**: Configured to allow specific origins with credentials

## Route Registration Status
✅ All routes properly registered in `server.js`  
✅ All middleware properly imported  
✅ All controllers properly imported  
✅ Consistent formatting and spacing  
✅ Proper CORS configuration  
✅ Error handling in place  

## Fixed Issues
1. ✅ CORS configuration (changed from `cors("*")` to proper config)
2. ✅ Missing route registrations (added cart and order routes)
3. ✅ Inconsistent formatting across route files
4. ✅ Missing semicolons and proper spacing
5. ✅ Route syntax errors (missing `/` in paths)
6. ✅ Import statement consistency
7. ✅ Middleware authentication on protected routes 