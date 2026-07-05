# Pathways 360 - iOS & Android Deployment Guide

## Overview

Pathways 360 is built as a Progressive Web App (PWA) that works seamlessly on iOS and Android devices. This guide covers deployment options from simplest (web app) to most complex (native app stores).

---

## Option 1: Web App (Easiest - 5 minutes)

### iOS - Add to Home Screen

**Step 1: Access the App**
1. Open Safari on iPhone
2. Navigate to: `https://pathways360-[hash].manus.space`
3. Wait for page to fully load

**Step 2: Install**
1. Tap the **Share** button (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Enter app name: `Pathways 360`
4. Tap **"Add"** in top-right

**Result:**
- ✅ App icon on home screen
- ✅ Standalone mode (no Safari UI)
- ✅ Offline support via service worker
- ✅ Push notifications enabled
- ✅ Access to camera/location (with permission)

### Android - Add to Home Screen

**Step 1: Access the App**
1. Open Chrome on Android phone
2. Navigate to: `https://pathways360-[hash].manus.space`
3. Wait for page to fully load

**Step 2: Install**
1. Tap **Menu** (three dots, top-right)
2. Tap **"Install app"** or **"Add to Home screen"**
3. Confirm installation
4. App appears on home screen

**Result:**
- ✅ App icon on home screen
- ✅ Standalone mode (no browser UI)
- ✅ Offline support via service worker
- ✅ Push notifications enabled
- ✅ Full device API access

---

## Option 2: Progressive Web App (PWA) - 10 minutes

### What's Already Configured

Your app includes PWA support:

```json
// manifest.json
{
  "name": "Pathways 360",
  "display": "standalone",
  "start_url": "/",
  "scope": "/",
  "icons": [...],
  "screenshots": [...]
}
```

**Features enabled:**
- ✅ Offline mode (service worker)
- ✅ App installation prompt
- ✅ Push notifications
- ✅ Background sync
- ✅ Share target API
- ✅ Shortcuts menu

### Verify PWA Installation

**iOS:**
1. Open Settings → Safari
2. Scroll to "Installed Web Apps"
3. Verify "Pathways 360" is listed

**Android:**
1. Open Chrome Settings
2. Go to "Apps" or "Installed apps"
3. Verify "Pathways 360" is installed

### Enable Installation Prompt

The app automatically shows an install prompt when:
- User visits the site multiple times
- PWA requirements are met
- User hasn't dismissed the prompt

**Manual Installation:**
- iOS: Share → Add to Home Screen
- Android: Menu → Install app

---

## Option 3: Capacitor (Native Wrapper) - 30 minutes

### Setup

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialize Capacitor
npx cap init pathways360 com.pathways360.app

# Add iOS
npx cap add ios

# Add Android
npx cap add android
```

### Build Web Assets

```bash
# Build React app
pnpm build

# Copy to Capacitor
npx cap copy
```

### iOS Deployment

```bash
# Open Xcode
npx cap open ios

# In Xcode:
# 1. Select "Pathways360" target
# 2. Go to Signing & Capabilities
# 3. Add your Apple Developer Team
# 4. Change Bundle ID to: com.pathways360.app
# 5. Product → Archive
# 6. Upload to App Store Connect
```

### Android Deployment

```bash
# Open Android Studio
npx cap open android

# In Android Studio:
# 1. Select Build → Generate Signed Bundle/APK
# 2. Create new keystore or select existing
# 3. Fill in signing details
# 4. Build release APK/AAB
# 5. Upload to Google Play Console
```

---

## Option 4: React Native - 2-3 hours

### Setup

```bash
# Create React Native project
npx create-expo-app pathways360-mobile

# Install dependencies
npm install expo-router expo-splash-screen expo-status-bar
```

### Migrate UI Components

```bash
# Install React Native UI library
npm install react-native-paper

# Or use Expo components
npm install expo
```

### Build & Deploy

**iOS:**
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

**Android:**
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

---

## Option 5: Flutter - 2-3 hours

### Setup

```bash
# Install Flutter SDK
# https://flutter.dev/docs/get-started/install

# Create Flutter project
flutter create pathways360_mobile

# Add web dependencies
flutter pub add flutter_web_plugins
```

### Build & Deploy

**iOS:**
```bash
flutter build ios --release
# Upload to App Store Connect
```

**Android:**
```bash
flutter build appbundle --release
# Upload to Google Play Console
```

---

## Comparison Table

| Method | Effort | App Store | Offline | Notifications | Cost |
|--------|--------|-----------|---------|---------------|------|
| Web App | 5 min | No | ✅ | ✅ | Free |
| PWA | 10 min | No | ✅ | ✅ | Free |
| Capacitor | 30 min | ✅ | ✅ | ✅ | $99/year (iOS) |
| React Native | 2-3 hrs | ✅ | ✅ | ✅ | $99/year (iOS) |
| Flutter | 2-3 hrs | ✅ | ✅ | ✅ | $99/year (iOS) |

---

## App Store Submission Checklist

### iOS App Store

- [ ] Apple Developer account ($99/year)
- [ ] App name and description
- [ ] App icon (1024x1024px)
- [ ] Screenshots (5-10 per device)
- [ ] Privacy policy URL
- [ ] Support email
- [ ] Category selected
- [ ] Content rating completed
- [ ] Build uploaded to App Store Connect
- [ ] Pricing tier selected
- [ ] Availability regions configured
- [ ] Submitted for review

**Review Time:** 24-48 hours typically

### Google Play Store

- [ ] Google Play Developer account ($25 one-time)
- [ ] App name and description
- [ ] App icon (512x512px)
- [ ] Screenshots (2-8 per device)
- [ ] Feature graphic (1024x500px)
- [ ] Privacy policy URL
- [ ] Category selected
- [ ] Content rating completed
- [ ] AAB/APK uploaded
- [ ] Pricing tier selected
- [ ] Availability regions configured
- [ ] Submitted for review

**Review Time:** 2-4 hours typically

---

## Testing on Devices

### iOS Testing

**Physical Device:**
```bash
# Connect iPhone via USB
# Open Xcode project
# Select device from dropdown
# Click Run button
```

**Simulator:**
```bash
# Open Xcode
# Product → Destination → iPhone 15 Pro
# Click Run
```

### Android Testing

**Physical Device:**
```bash
# Enable Developer Mode: Settings → About → Build Number (tap 7x)
# Enable USB Debugging: Settings → Developer Options
# Connect via USB
# Run: npx cap run android
```

**Emulator:**
```bash
# Open Android Studio
# Tools → Device Manager → Create Virtual Device
# Run: npx cap run android
```

---

## Performance Optimization

### Mobile-Specific Optimizations

```typescript
// Lazy load components
const JobBoard = lazy(() => import('./pages/JobBoard'));
const LiveFeed = lazy(() => import('./pages/LiveFeedDashboard'));

// Optimize images
<img src="image.webp" alt="..." loading="lazy" />

// Reduce bundle size
// Tree-shake unused code
// Code split by route
```

### Network Optimization

```typescript
// Implement request caching
const cacheConfig = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: 24 * 60 * 60 * 1000, // 24 hours
};

// Compress responses
// Enable gzip compression
// Use CDN for static assets
```

### Battery & Data Optimization

```typescript
// Reduce polling frequency
const POLL_INTERVAL = 60000; // 1 minute (not 5 seconds)

// Batch API requests
// Implement request debouncing
// Use WebSocket for real-time data

// Respect low-power mode
if (navigator.deviceMemory && navigator.deviceMemory < 4) {
  // Reduce animations
  // Disable auto-play
  // Reduce image quality
}
```

---

## Troubleshooting

### App Won't Install (iOS)

**Issue:** "Cannot add web app"
- **Solution:** Ensure HTTPS is enabled, manifest.json is valid

**Issue:** "App keeps closing"
- **Solution:** Check for JavaScript errors in console (F12)

### App Won't Install (Android)

**Issue:** "Installation failed"
- **Solution:** Clear Chrome cache, enable installation in Chrome settings

**Issue:** "App crashes on startup"
- **Solution:** Check Android logcat for errors

### Offline Not Working

**Issue:** App doesn't work offline
- **Solution:** Verify service worker is registered (DevTools → Application)

**Check:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### Notifications Not Working

**Issue:** Push notifications don't appear
- **Solution:** Verify notification permission is granted

**Check:**
```javascript
// In browser console
Notification.permission // Should be "granted"
```

---

## Distribution Channels

### Direct Links
- Share PWA link: `https://pathways360-[hash].manus.space`
- QR code for easy mobile access
- Email/SMS campaigns

### App Stores
- Apple App Store (iOS)
- Google Play Store (Android)
- Samsung Galaxy Store (Android)
- Amazon Appstore (Android)

### Enterprise Distribution
- Internal app store for organizations
- MDM (Mobile Device Management) deployment
- B2B app distribution

---

## Monitoring Mobile Usage

### Analytics

**Track:**
- Mobile vs desktop traffic
- Device types and OS versions
- App installation rate
- Offline usage percentage
- Crash reports

**Dashboard:**
- Management UI → Analytics
- Filter by device type
- Geographic distribution
- User retention

### Error Tracking

```typescript
// Track errors
window.addEventListener('error', (event) => {
  console.error('Error:', event.error);
  // Send to error tracking service
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
```

---

## Support Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Capacitor Docs](https://capacitorjs.com/)
- [React Native Docs](https://reactnative.dev/)
- [Flutter Docs](https://flutter.dev/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**Last Updated:** July 5, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
