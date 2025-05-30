# 🧪 Manual Testing Guide - RamsMotors with Mock Data

## 🚀 Current Setup Status

✅ **React Development Server**: Running on http://localhost:3000  
✅ **Mock Data Mode**: Enabled for immediate UI testing  
✅ **4 Sample Vehicles**: Honda Accord, Toyota Camry, Ford F-150, BMW X5  
✅ **All UI Components**: Ready for testing  

## 🎯 What You Can Test Right Now

### 1. Homepage & Navigation
- **URL**: http://localhost:3000
- **Test**: Navigation between pages, responsive design, hero section

### 2. Vehicle Inventory Page
- **URL**: http://localhost:3000/inventory
- **Test**: 
  - View 4 mock vehicles with different statuses
  - Filter by make, model, year, price range
  - Search functionality
  - Sorting options
  - Responsive grid layout

### 3. Admin Login (Mock Credentials)
- **URL**: http://localhost:3000/admin/login
- **Test Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Expected**: Successful login with JWT token simulation

### 4. Admin Dashboard (After Login)
- **URL**: http://localhost:3000/admin/dashboard
- **Test**: 
  - View vehicle inventory
  - Bulk selection (select all checkbox)
  - Individual vehicle selection
  - Bulk delete with confirmation dialog
  - Bulk status updates (Available/Pending/Sold)
  - Add/Edit vehicle forms
  - Individual vehicle delete

### 5. Bulk Operations Testing
1. **Login** as admin (admin/admin123)
2. **Go to Admin Dashboard**
3. **Test Select All**: Click "Select All" checkbox
4. **Test Individual Selection**: Click individual vehicle checkboxes
5. **Test Bulk Delete**: 
   - Select multiple vehicles
   - Click "Delete X" button
   - Confirm deletion in dialog
   - Verify vehicles are removed
6. **Test Bulk Status Update**:
   - Select multiple vehicles
   - Click status buttons (Available/Pending/Sold)
   - Verify status changes

### 6. Vehicle Forms
- **Add Vehicle**: Click "Add Vehicle" in admin dashboard
- **Edit Vehicle**: Click "Edit" on any vehicle card
- **Test**: Form validation, image placeholder handling

### 7. Responsive Design
- **Test on**: Different screen sizes
- **Check**: Mobile navigation, grid layout adaptation, button accessibility

## 📊 Mock Data Details

### Sample Vehicles:
1. **Honda Accord 2023** - $28,500 - Available - 15,000 km
2. **Toyota Camry 2022** - $26,900 - Available - 22,000 km  
3. **Ford F-150 2023** - $35,900 - Pending - 8,500 km
4. **BMW X5 2022** - $52,900 - Sold - 18,000 km

### Mock Authentication:
- **Admin User**: admin/admin123
- **JWT Token**: Simulated with localStorage
- **Session**: Persists across page refreshes

## 🔍 What to Look For

### ✅ Should Work:
- Page navigation and routing
- Vehicle display and filtering
- Admin authentication flow
- Bulk operations UI and logic
- Form validation
- Responsive design
- Loading states and animations
- Error handling (simulated)

### ❌ Expected Limitations:
- No real data persistence (refreshing resets changes)
- No actual image uploads (shows placeholders)
- No real API calls (console shows mock responses)
- No email functionality

## 🐛 Debugging Tips

### Check Browser Console:
- Look for "🧪 TESTING MODE" message
- Monitor API call simulations
- Check for any JavaScript errors

### Network Tab:
- Should see no actual HTTP requests
- All "API calls" are simulated with delays

### Local Storage:
- Check for authToken after login
- Token should persist across page refreshes

## 🔄 Switching to Real Supabase

When ready to test with real Supabase:

1. **Set up Supabase** (see QUICK_SETUP.md)
2. **Update environment variables** in .env file
3. **Change mock mode** in src/services/api.js:
   ```javascript
   const USE_MOCK_DATA = false; // Change to false
   ```
4. **Restart development server**

## 📱 Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Inventory page shows 4 vehicles
- [ ] Filtering works (try filtering by "Honda")
- [ ] Admin login works (admin/admin123)
- [ ] Admin dashboard loads after login
- [ ] Select all checkbox works
- [ ] Individual vehicle selection works
- [ ] Bulk delete confirmation appears
- [ ] Bulk status updates work
- [ ] Add vehicle form appears
- [ ] Edit vehicle form pre-fills data
- [ ] Responsive design works on mobile
- [ ] Loading states appear during operations
- [ ] Console shows mock API responses

## 🎉 Ready for Testing!

The application is now ready for comprehensive manual testing. All UI components and bulk operations should work smoothly with the mock data. Once you're satisfied with the UI/UX, you can set up real Supabase integration for persistent data.
