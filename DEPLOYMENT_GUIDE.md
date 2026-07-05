# Pathways 360 - Deployment & Publishing Guide

## Quick Start: 15-Minute Deployment

### Prerequisites
- Node.js 22.13.0+ installed
- pnpm package manager installed
- Git repository initialized
- Manus account with hosting enabled

### Step 1: Prepare for Deployment (2 minutes)

```bash
cd /home/ubuntu/pathways360

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests (optional but recommended)
pnpm test
```

### Step 2: Create Checkpoint (1 minute)

The checkpoint captures your current project state and enables rollback if needed.

```bash
# Via CLI (if available)
git add .
git commit -m "Production deployment checkpoint"

# Or use Manus UI: Click "Create Checkpoint" in Management Panel
```

### Step 3: Configure Secrets (3 minutes)

Ensure all environment variables are set in Manus Management UI:
- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - OAuth login portal
- `BUILT_IN_FORGE_API_KEY` - Manus API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

**Location:** Management UI → Settings → Secrets

### Step 4: Publish to Production (9 minutes)

#### Option A: Manus Management UI (Recommended)
1. Open Management UI in browser
2. Click **"Publish"** button (top-right)
3. Select deployment target (Autoscale or Reserved)
4. Confirm and wait for deployment to complete
5. Access your live site at: `https://pathways360-[hash].manus.space`

#### Option B: CLI Deployment
```bash
# If using Manus CLI
manus deploy --project pathways360

# Or with custom domain
manus deploy --project pathways360 --domain yourdomain.com
```

#### Option C: GitHub Integration
1. Go to Management UI → More → GitHub
2. Authorize GitHub account
3. Select repository and branch
4. Enable auto-deploy on push
5. Push to main branch to trigger deployment

---

## iOS & Android Deployment

### iOS (Web App)

#### Method 1: Add to Home Screen (Easiest)
1. Open Pathways 360 in Safari on iPhone
2. Tap **Share** button
3. Select **"Add to Home Screen"**
4. Name the app "Pathways 360"
5. Tap **"Add"**

**Result:** App icon appears on home screen with standalone mode

#### Method 2: Full App Store Distribution
1. Build native wrapper using React Native or Capacitor
2. Submit to Apple App Store
3. Follow Apple's review process

**Resources:**
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [React Native iOS Guide](https://reactnative.dev/docs/getting-started)

### Android (Web App)

#### Method 1: Add to Home Screen (Easiest)
1. Open Pathways 360 in Chrome on Android
2. Tap **Menu** (three dots)
3. Select **"Install app"** or **"Add to Home screen"**
4. Confirm installation

**Result:** App icon appears on home screen with offline support

#### Method 2: Google Play Store Distribution
1. Build APK/AAB using Capacitor or React Native
2. Sign the app with your keystore
3. Submit to Google Play Console
4. Follow Google's review process

**Resources:**
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [React Native Android Guide](https://reactnative.dev/docs/getting-started)

#### Method 3: Web App Manifest (PWA)
The app already includes PWA support:
- ✅ `manifest.json` configured
- ✅ Service worker for offline support
- ✅ App icons and splash screens
- ✅ Responsive design for all screen sizes

**Verification:**
```bash
# Check manifest is valid
curl https://pathways360-[hash].manus.space/manifest.json

# Verify service worker
curl https://pathways360-[hash].manus.space/sw.js
```

---

## Post-Deployment Configuration

### 1. Custom Domain Setup (Optional)

**In Manus Management UI:**
1. Go to Settings → Domains
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `pathways360.org`)
4. Follow DNS configuration instructions
5. Verify domain ownership
6. Wait for SSL certificate (usually 5-10 minutes)

**DNS Configuration Example:**
```
Type: CNAME
Name: pathways360
Value: pathways360-[hash].manus.space
TTL: 3600
```

### 2. Enable Analytics

**In Manus Management UI:**
1. Go to Dashboard
2. Analytics section shows:
   - Unique visitors (UV)
   - Page views (PV)
   - Geographic distribution
   - Device types
   - Referral sources

### 3. Configure Notifications

**For Push Notifications:**
1. Settings → Integrations → Notifications
2. Enable notification service
3. Configure notification channels:
   - Referral alerts
   - Job matches
   - Appointment reminders
   - System updates

### 4. Database Backup

**Automatic Backups:**
- Manus automatically backs up your database daily
- Retention: 30 days
- Restore via Management UI → Database → Backups

**Manual Backup:**
```bash
# Export database
mysqldump -u [user] -p [database] > backup.sql

# Import backup
mysql -u [user] -p [database] < backup.sql
```

---

## Monitoring & Maintenance

### Health Checks

**Check deployment status:**
```bash
# Via curl
curl -I https://pathways360-[hash].manus.space

# Expected response: HTTP 200 OK
```

**View server logs:**
- Management UI → Dashboard → Logs
- Real-time log streaming
- Error tracking and alerts

### Performance Optimization

**Recommended settings:**
- Enable caching: Settings → Performance → Cache
- Set cache TTL: 3600 seconds (1 hour)
- Enable compression: Automatic
- CDN: Enabled by default

### Scaling

**Auto-scaling (Default):**
- Instances: 0-10 (scales based on traffic)
- Response time: < 1s
- Cost: Pay-per-use

**Reserved Hosting (Optional):**
- Instances: Always-on (1-4 vCPU)
- Response time: < 500ms
- Cost: Fixed monthly

**Upgrade to Reserved:**
- Management UI → Settings → Hosting
- Select "Reserved" plan
- Confirm and upgrade

---

## Troubleshooting

### Deployment Failed

**Check logs:**
```bash
# View build logs
Management UI → Dashboard → Build Logs

# Common issues:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Syntax errors in code
```

**Solution:**
1. Check all secrets are configured
2. Verify database is accessible
3. Run `pnpm build` locally to test
4. Check for TypeScript errors: `pnpm tsc --noEmit`
5. Rollback to previous checkpoint if needed

### App Not Loading

**Check:**
1. Is domain accessible? `curl https://yourdomain.com`
2. Are secrets configured? Management UI → Settings → Secrets
3. Is database connected? Management UI → Database → Connection
4. Check browser console for errors (F12)

**Solution:**
1. Verify SSL certificate is valid
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private mode
4. Check service worker: DevTools → Application → Service Workers

### Slow Performance

**Optimize:**
1. Enable caching: Settings → Performance
2. Reduce database queries (check N+1 issues)
3. Optimize images (use WebP format)
4. Enable gzip compression (automatic)
5. Consider upgrading to Reserved hosting

**Monitor:**
- Management UI → Dashboard → Performance Metrics
- Check response times
- Identify slow endpoints

### Database Issues

**Check connection:**
```bash
# Via Management UI
Settings → Database → Test Connection

# Via CLI
mysql -h [host] -u [user] -p [password] -e "SELECT 1"
```

**Troubleshoot:**
1. Verify DATABASE_URL is correct
2. Check database user permissions
3. Ensure database is running
4. Review query performance (slow query log)

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Manus Secrets Manager
- ✅ Rotate secrets regularly
- ✅ Use strong, unique passwords

### 2. Database Security
- ✅ Enable SSL/TLS connections
- ✅ Use strong database passwords
- ✅ Restrict database access by IP
- ✅ Regular backups and testing

### 3. API Security
- ✅ OAuth 2.0 enabled
- ✅ Rate limiting configured
- ✅ CORS properly configured
- ✅ Input validation on all endpoints

### 4. HTTPS/SSL
- ✅ Automatic SSL certificate
- ✅ Auto-renewal (90-day cycle)
- ✅ HTTP → HTTPS redirect
- ✅ HSTS headers enabled

---

## Rollback Procedure

**If deployment has issues:**

1. **Via Management UI:**
   - Go to Dashboard → Version History
   - Select previous checkpoint
   - Click "Rollback"
   - Confirm and wait for deployment

2. **Via CLI:**
   ```bash
   manus rollback --project pathways360 --version [version-id]
   ```

3. **Manual Rollback:**
   ```bash
   git revert HEAD
   git push origin main
   # Redeploy
   ```

---

## Support & Resources

### Documentation
- [Manus Documentation](https://docs.manus.im)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Community
- [Manus Community Forum](https://community.manus.im)
- [GitHub Issues](https://github.com/manus-ai/pathways360)
- [Discord Community](https://discord.gg/manus)

### Support Channels
- Email: support@manus.im
- Chat: Management UI → Help → Chat with Support
- Phone: +1-XXX-XXX-XXXX (Premium support)

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection verified
- [ ] Tests passing locally (`pnpm test`)
- [ ] Build successful (`pnpm build`)
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] Checkpoint created
- [ ] Secrets configured in Management UI
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified
- [ ] Analytics enabled
- [ ] Notifications configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up
- [ ] Team access configured
- [ ] Documentation updated

---

## Next Steps

1. **Monitor Performance:** Check Dashboard daily for first week
2. **Gather Feedback:** Collect user feedback and bug reports
3. **Iterate:** Deploy updates using same process
4. **Scale:** Upgrade to Reserved hosting if needed
5. **Expand:** Add new features and integrations

---

**Last Updated:** July 5, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
