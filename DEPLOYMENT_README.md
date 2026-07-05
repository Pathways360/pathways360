# Pathways 360 - Production Deployment Guide

## 📦 What's Included

This package contains the complete Pathways 360 application ready for deployment:

- **Frontend:** React 19 + Tailwind CSS 4 with responsive design
- **Backend:** Express 4 + tRPC 11 with full API procedures
- **Database:** Drizzle ORM with 11 comprehensive tables
- **Features:** Client/Provider portals, Resource Navigator, ROI Dashboard, Multi-Agency Hub
- **Authentication:** Manus OAuth with role-based access control

## 🚀 Quick Start (Choose One)

### Option A: Deploy to Render.com (RECOMMENDED - FREE)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git remote add origin https://github.com/YOUR_USERNAME/pathways360.git
   git push -u origin main
   ```

2. **Sign Up on Render**
   - Visit https://render.com
   - Connect GitHub account

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select pathways360 repository
   - Configure:
     - Build: `pnpm install && pnpm build`
     - Start: `pnpm start`
     - Plan: Free

4. **Set Environment Variables**
   - Go to Environment tab
   - Add all variables from `.env.example`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Live at: `https://pathways360.onrender.com`

### Option B: Deploy to Railway.app (Alternative - FREE)

1. Visit https://railway.app
2. Click "Start a New Project"
3. Select GitHub Repo
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy automatically

### Option C: Deploy to Your Own Server

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Build for Production**
   ```bash
   pnpm build
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your values
   ```

4. **Run Production Server**
   ```bash
   NODE_ENV=production pnpm start
   ```

## 🔧 Environment Variables Required

Create `.env.production` with these variables:

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/pathways360

# Authentication
JWT_SECRET=your_secret_key_here_minimum_32_characters
VITE_APP_ID=your_manus_oauth_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Information
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Organization Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database created and migrations applied
- [ ] SSL certificate ready
- [ ] Backup system configured
- [ ] Error monitoring setup (Sentry)
- [ ] Email service configured
- [ ] Domain name ready (or using free subdomain)

## 🧪 Testing After Deployment

1. **Test Client Login**
   - Navigate to `/login`
   - Click "I'm a Client"
   - Verify OAuth flow works

2. **Test Provider Login**
   - Click "I'm a Provider"
   - Enter license: `LIC-TEST-001`
   - Verify license verification works

3. **Test Core Features**
   - [ ] Resource Navigator loads
   - [ ] Provider Dashboard displays
   - [ ] Timeline shows events
   - [ ] Messaging works
   - [ ] ROI Dashboard loads
   - [ ] Permission Controls accessible

4. **Test Database**
   ```bash
   # Connect to your database
   psql $DATABASE_URL
   
   # Verify tables exist
   \dt
   ```

## 📱 Mobile App Publishing

### iOS (App Store)
- **Time:** 1-2 weeks
- **Cost:** $99/year (Apple Developer)
- **Steps:** See MOBILE_PUBLISHING_GUIDE.md

### Android (Google Play)
- **Time:** 3-5 days
- **Cost:** $25 one-time (Google Play)
- **Steps:** See MOBILE_PUBLISHING_GUIDE.md

## 🔐 Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Password requirements enforced
- [ ] Session timeout configured
- [ ] Secrets not in version control
- [ ] Database backups automated

## 📊 Monitoring & Maintenance

### Daily
- Check error logs
- Monitor uptime
- Verify database connection

### Weekly
- Review performance metrics
- Check backup completion
- Analyze user feedback

### Monthly
- Database maintenance
- Security audit
- Performance optimization

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Database Connection Error
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### App Won't Start
```bash
# Check logs
tail -f .manus-logs/devserver.log

# Verify environment variables
env | grep VITE
```

## 📚 Documentation Files

- **PATHWAYS360_DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
- **QUICK_DEPLOYMENT_STEPS.md** - 5-step quick start
- **MOBILE_PUBLISHING_GUIDE.md** - iOS/Android publishing
- **README.md** - Project overview

## 🎯 Next Steps

1. ✅ Deploy to Render (15 minutes)
2. ✅ Test all features
3. ✅ Invite beta testers
4. ✅ Collect feedback (1 week)
5. ✅ Fix critical bugs
6. ✅ Publish mobile apps
7. ✅ Go live to production

## 💬 Support

- **Render Support:** support@render.com
- **Railway Support:** support@railway.app
- **GitHub Issues:** pathways360/issues
- **Documentation:** See guides in this directory

## 📝 Version Information

- **App Version:** 1.0.0
- **Node Version:** 18+
- **React Version:** 19
- **Database:** PostgreSQL 12+
- **Deployment Date:** July 5, 2026

---

**Ready to deploy? Start with Quick Start Option A above! 🚀**
