# 🔒 SECURITY GUIDE FOR ENVIRONMENT VARIABLES
# CRITICAL: Read this before deploying to production

## 🚨 SECURITY CHECKLIST

### ✅ Local Development Security:
- [x] .env file is in .gitignore (VERIFIED)
- [x] No credentials committed to Git
- [x] Separate .env.example with placeholders

### 🌐 Production Deployment Security:
- [ ] Use platform environment variables (Netlify/Vercel)
- [ ] Never store secrets in code
- [ ] Restrict API keys to specific domains
- [ ] Use different keys for dev/prod

## 🔐 SECURE DEPLOYMENT PROCESS

### Step 1: Verify .gitignore Protection
```bash
# Check if .env is properly ignored
git status
# .env should NOT appear in untracked files
```

### Step 2: API Key Restrictions
Configure each API key with domain restrictions:

**Google Maps API:**
- Restrict to: `localhost:3000`, `ramsmotors.netlify.app`
- Enable only: Maps JavaScript API, Places API

**Supabase:**
- Already secured with Row Level Security (RLS)
- Anon key is safe for frontend use

**Cloudinary:**
- Use unsigned upload presets
- Restrict upload sources in dashboard

### Step 3: Platform Environment Variables
Set secrets in deployment platform (Netlify):
1. Go to Site Settings > Environment Variables
2. Add each variable individually
3. Never paste .env file content

## 🛡️ SECURITY LAYERS

### Layer 1: File Protection
- .env in .gitignore ✅
- No credentials in code ✅
- Template files only ✅

### Layer 2: API Restrictions
- Domain restrictions on APIs
- Usage limits enabled
- Monitoring alerts set

### Layer 3: Deployment Security
- Platform env variables only
- No file uploads of .env
- Separate prod/dev keys

## 🚫 NEVER DO THIS:
- ❌ Commit .env to Git
- ❌ Email/share .env files
- ❌ Use same keys for dev/prod
- ❌ Paste secrets in chat/docs
- ❌ Screenshot API keys

## ✅ ALWAYS DO THIS:
- ✅ Use platform environment variables
- ✅ Restrict API keys by domain
- ✅ Monitor API usage
- ✅ Rotate keys regularly
- ✅ Use different keys per environment

## 🔄 KEY ROTATION SCHEDULE:
- Google Maps: Every 90 days
- Supabase: Every 180 days
- Cloudinary: Every 180 days

## 📞 EMERGENCY PROCEDURES:
If keys are compromised:
1. Immediately disable/delete exposed keys
2. Generate new keys
3. Update deployment platform
4. Redeploy application
5. Monitor for unauthorized usage
