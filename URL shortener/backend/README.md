# Backend API Routes

This document describes all backend routes available in the `backend` folder.

Base route prefixes:
- `POST /api/v1/users/...`
- `GET /api/v1/users/...`
- `POST /api/v1/url/...`
- `GET /api/v1/url/...`
- `DELETE /api/v1/url/...`
- `PATCH /api/v1/url/...`
- `GET /api/v1/click/...`
- `GET /api/v1/admin/...`
- `GET /:shortID` (redirect route)

> Note: protected routes require a valid access token. The middleware checks `req.cookies.accessToken` or `Authorization: Bearer <token>`.

---

## User Routes

### Register
- **URL:** `POST /api/v1/users/register`
- **Auth:** No
- **Body:** JSON
  - `FullName` (string, required)
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
- **Example:**
```json
{
  "FullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Secret123"
}
```
- **Response:** user info + cookies `accessToken` and `refreshToken`.

### Login
- **URL:** `POST /api/v1/users/login`
- **Auth:** No
- **Body:** JSON
  - `email` or `username` (one required)
  - `password` (string, required)
- **Example:**
```json
{
  "email": "john@example.com",
  "password": "Secret123"
}
```
- **Response:** user info + cookies `accessToken` and `refreshToken`.

### Logout
- **URL:** `POST /api/v1/users/logout`
- **Auth:** Yes
- **Headers/Cookies:** valid access token cookie or Bearer token
- **Body:** none
- **Response:** clears auth cookies.

### Change Password
- **URL:** `POST /api/v1/users/changepassword`
- **Auth:** Yes
- **Body:** JSON
  - `oldPassword` (string, required)
  - `newPassword` (string, required)
- **Example:**
```json
{
  "oldPassword": "Secret123",
  "newPassword": "NewSecret456"
}
```

### Update User Info
- **URL:** `PATCH /api/v1/users/update`
- **Auth:** Yes
- **Body:** JSON
  - `FullName` (string, optional)
  - `email` (string, optional)
- **Example:**
```json
{
  "FullName": "John S. Doe",
  "email": "john.s@example.com"
}
```

### Get User Data
- **URL:** `GET /api/v1/users/userdata`
- **Auth:** Yes
- **Body:** none
- **Response:** current authenticated user data.

### Refresh Access Token
- **URL:** `GET /api/v1/users/refreshToken`
- **Auth:** Yes (refresh token required)
- **Headers/Cookies:** `refreshToken` cookie or JSON body may include `refreshToken`
- **Body (optional):**
  - `refreshToken` (string)
- **Response:** issues a new `accessToken` and `refreshToken` cookies.

---

## URL Routes

### Create Short URL
- **URL:** `POST /api/v1/url/create`
- **Auth:** Yes
- **Body:** JSON
  - `originalUrl` (string, required)
  - `customName` (string, optional)
  - `qrcode` (string, optional, use `"true"` to generate QR code)
- **Example:**
```json
{
  "originalUrl": "https://example.com",
  "customName": "example-short",
  "qrcode": "true"
}
```

### Get My URLs
- **URL:** `GET /api/v1/url/getUrl`
- **Auth:** Yes
- **Body:** none
- **Response:** list of URLs created by authenticated user.

### Delete URL
- **URL:** `DELETE /api/v1/url/delete/:id`
- **Auth:** Yes
- **Params:**
  - `id` = URL document ID
- **Body:** none

### Update URL
- **URL:** `PATCH /api/v1/url/update/:id`
- **Auth:** Yes
- **Params:**
  - `id` = URL document ID
- **Body:** JSON (at least one field required)
  - `originalUrl` (string, optional)
  - `customName` (string, optional)
  - `qrcode` (string, optional, `"true"` or `"false"`)
- **Example:**
```json
{
  "originalUrl": "https://new.example.com",
  "customName": "new-short",
  "qrcode": "false"
}
```

### Get URL Info (click details)
- **URL:** `GET /api/v1/url/urlinfo/:id`
- **Auth:** Yes
- **Params:**
  - `id` = URL document ID for click info
- **Response:** click records for that URL.

### Search User URLs
- **URL:** `GET /api/v1/url/Search?query=<search-term>`
- **Auth:** Yes
- **Query:**
  - `query` (string, required)
- **Example:** `GET /api/v1/url/Search?query=example`

---

## Click Routes

### URL Click Stats
- **URL:** `GET /api/v1/click/stats/:id`
- **Auth:** Yes
- **Params:**
  - `id` = URL document ID
- **Response:** click statistics for the URL.

---

## Admin Routes

> Admin routes require both `Protect` and `adminVerify` middleware. The authenticated user must have `role === "admin"`.

### Dashboard Stats
- **URL:** `GET /api/v1/admin/stats`
- **Auth:** Yes (admin)
- **Body:** none
- **Response:** total users, total URLs, monthly stats.

### Get All Users
- **URL:** `GET /api/v1/admin/TotalUser`
- **Auth:** Yes (admin)
- **Body:** none

### Get All URLs
- **URL:** `GET /api/v1/admin/TotalUrl`
- **Auth:** Yes (admin)
- **Body:** none

### Get User URLs
- **URL:** `GET /api/v1/admin/userUrl/:id`
- **Auth:** Yes (admin)
- **Params:**
  - `id` = user ID

### Delete User
- **URL:** `DELETE /api/v1/admin/deleteUser/:id`
- **Auth:** Yes (admin)
- **Params:**
  - `id` = user ID

### Search Users
- **URL:** `GET /api/v1/admin/serchUser?query=<search-term>`
- **Auth:** Yes (admin)
- **Query:**
  - `query` (string, required)

### Delete URL (admin)
- **URL:** `DELETE /api/v1/admin/deleteUrl/:id`
- **Auth:** Yes (admin)
- **Params:**
  - `id` = URL document ID

### Search URLs (admin)
- **URL:** `GET /api/v1/admin/serchUrl?query=<search-term>`
- **Auth:** Yes (admin)
- **Query:**
  - `query` (string, required)

### Update User (admin)
- **URL:** `POST /api/v1/admin/updateUser/:id`
- **Auth:** Yes (admin)
- **Params:**
  - `id` = user ID
- **Body:** JSON
  - `FullName` (string, optional)
  - `email` (string, optional)
- **Example:**
```json
{
  "FullName": "Admin Updated Name",
  "email": "admin.updated@example.com"
}
```

### Update URL (admin)
- **URL:** `POST /api/v1/admin/updateUrl/:id`
- **Auth:** Yes (admin)
- **Params:**
  - `id` = URL document ID
- **Body:** JSON
  - `originalUrl` (string, optional)
  - `customName` (string, optional)
- **Example:**
```json
{
  "originalUrl": "https://admin-updated.example.com",
  "customName": "admin-short"
}
```

---

## Redirect Route

### Redirect by Short ID
- **URL:** `GET /:shortID`
- **Auth:** No
- **Params:**
  - `shortID` = short code generated for a URL
- **Behavior:** redirects to `originalUrl` and tracks the click.

---

## Authentication Notes
- `Protect` looks for an access token in:
  - cookie `accessToken`
  - `Authorization` header with `Bearer <token>`
- Admin routes also require `req.user.role === "admin"`.
- `refreshToken` is usually stored as a cookie named `refreshToken`.

---

## Common Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>` (for protected requests when not using cookies)
- `Cookie: accessToken=<token>; refreshToken=<token>` (if you use cookie auth)
