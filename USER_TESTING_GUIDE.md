# RamsMotors Website - User Testing Guide

## Introduction

This guide will help you verify that all features of the RamsMotors website are working correctly, focusing on two key improvements:

1. Real Google Reviews Integration
2. Admin Portal Functionality

## Testing Google Reviews

### Verify Real Google Reviews on Homepage

1. Navigate to the homepage: [http://localhost:3000](http://localhost:3000)
2. Scroll down to the "About Rams Motors" section
3. You should see:
   - Real Google reviews from actual customers
   - Current overall rating (approx. 4.9 stars)
   - Customer names matching those from Google My Business
   - Genuine review text and ratings

### Verify API Functionality

If you want to check the backend API directly:
```powershell
Invoke-RestMethod -Uri "http://localhost:5246/api/reviews/google"
```

This should return the full set of reviews with rating, text, author, and dates.

## Testing Admin Portal

### 1. Login Process

1. Navigate to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign in"
4. You should be redirected to the dashboard without errors

### 2. Dashboard Access

After successful login, you should see:
- Header with "Admin Dashboard" title
- "Add Vehicle" button
- "Logout" button
- List of vehicles in inventory (or empty state if no vehicles)

### 3. Vehicle Management

Test the following functions:
- **Add Vehicle**: Click "Add Vehicle" and complete the form
- **Edit Vehicle**: Click edit icon on any existing vehicle
- **Delete Vehicle**: Click delete icon on any vehicle (confirm in prompt)
- **Refresh List**: Click "Refresh" to reload the vehicle list

### 4. Logout Process

1. Click "Logout" from dashboard
2. You should be redirected to the login page
3. If you try to access the dashboard directly after logout, you should be redirected to login

## Troubleshooting

### If Google Reviews Don't Load

- Check browser console for errors
- Verify backend API is running on port 5246
- Ensure API key and Place ID are correct in appsettings.json

### If Admin Portal Has Issues

- Clear browser localStorage (this resets authentication state)
- Check browser console for any JavaScript errors
- Verify backend authentication endpoint is working:
  ```powershell
  $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
  Invoke-RestMethod -Uri "http://localhost:5246/api/auth/login" -Method POST -Body $body -ContentType "application/json"
  ```
- Try restarting the backend and frontend servers

## Backend Server Status

To check if the backend server is running:
```powershell
Get-Process -Name "dotnet" | Where-Object { $_.CommandLine -like "*RamsMotorsAPI*" }
```

To restart the backend server if needed:
```powershell
# Stop the server
Stop-Process -Name "dotnet" -ErrorAction SilentlyContinue

# Start the server
cd c:\Users\nilin\ramsmotors\RamsMotorsAPI
dotnet run
```

## Frontend Server Status

To check if the frontend server is running:
```powershell
Get-Process -Name "node" | Where-Object { $_.CommandLine -like "*react-scripts*" }
```

To restart the frontend server if needed:
```powershell
# Stop the server
Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Start the server
cd c:\Users\nilin\ramsmotors
npm start
```

## Technical Support

If you encounter any issues not covered in this guide, please refer to:
- `FINAL_IMPLEMENTATION_STATUS.md` - Complete implementation details
- `ADMIN_DASHBOARD_FIX.md` - Specific fixes for admin dashboard issues
