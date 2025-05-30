@echo off
echo Building RamsMotors application for production...
cd /d "c:\Users\nilin\ramsmotors"

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building application...
call npm run build

echo.
echo Step 3: Copying routing configuration files...
copy /Y "netlify.toml" "build\netlify.toml"
echo /*    /index.html   200 > "build\_redirects"

echo.
echo Step 4: Build completed successfully!
echo.
echo Files in build folder:
dir build\_redirects
dir build\netlify.toml

echo.
echo ===========================================
echo NEXT STEPS FOR NETLIFY DEPLOYMENT:
echo ===========================================
echo 1. Go to https://app.netlify.com/
echo 2. Find your RamsMotors site
echo 3. Go to "Deploys" tab
echo 4. Drag and drop the entire 'build' folder
echo 5. Wait for deployment to complete
echo 6. Test your site - F5 should work on all pages!
echo ===========================================

pause
