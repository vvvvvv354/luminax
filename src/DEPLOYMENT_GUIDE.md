# SAI Sports Platform - Deployment Guide

## Overview
This guide covers the complete deployment of the SAI Sports Platform, including both the web application and the Flutter desktop wrapper.

## Architecture
- **Web Application**: React-based SPA with all coaching features
- **Desktop Wrapper**: Flutter application that embeds the web app in a WebView
- **Backend**: Supabase for data management (optional, can use mock data)

## Web Application Deployment

### 1. Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
# App will be available at http://localhost:3000
```

### 2. Production Build
```bash
# Build for production
npm run build

# The build folder contains the production-ready static files
```

### 3. Deploy to Web Server
Deploy the contents of the `build` folder to any static hosting service:
- **Netlify**: Connect your GitHub repo for automatic deployment
- **Vercel**: Similar GitHub integration
- **AWS S3 + CloudFront**: For scalable hosting
- **Traditional Web Server**: Apache/Nginx

### 4. Environment Configuration
Update the following for production:
- API endpoints (if using Supabase)
- Image upload services
- Analytics tracking codes
- Domain-specific settings

## Desktop Application Deployment

### 1. Flutter Setup
```bash
cd flutter_wrapper
flutter pub get
flutter config --enable-windows-desktop
flutter config --enable-macos-desktop
flutter config --enable-linux-desktop
```

### 2. Configure Web App URL
Edit `flutter_wrapper/lib/main.dart`:
```dart
// Update this to your production URL
static const String webAppUrl = 'https://your-domain.com';
```

### 3. Build for Each Platform

#### Windows
```bash
cd flutter_wrapper
flutter build windows --release
```
Output: `build/windows/runner/Release/`

#### macOS
```bash
cd flutter_wrapper
flutter build macos --release
```
Output: `build/macos/Build/Products/Release/`

#### Linux
```bash
cd flutter_wrapper
flutter build linux --release
```
Output: `build/linux/x64/release/bundle/`

### 4. Create Installers

#### Windows Installer (NSIS)
1. Install NSIS (Nullsoft Scriptable Install System)
2. Create installer script:
```nsis
!define APP_NAME "SAI Sports Platform"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Sports Authority of India"
!define APP_EXE "sai_sports_platform.exe"

; Include the built files
SetCompressor lzma
OutFile "SAI_Sports_Platform_Setup.exe"
InstallDir "$PROGRAMFILES\SAI Sports Platform"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "build\windows\runner\Release\*"
  CreateShortcut "$DESKTOP\SAI Sports Platform.lnk" "$INSTDIR\${APP_EXE}"
  CreateShortcut "$SMPROGRAMS\SAI Sports Platform.lnk" "$INSTDIR\${APP_EXE}"
SectionEnd
```

#### macOS App Bundle
1. Code sign the application:
```bash
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" SAI_Sports_Platform.app
```

2. Create DMG:
```bash
create-dmg --app-drop-link 600 185 --volname "SAI Sports Platform" --window-size 800 400 --icon-size 100 --text-size 16 SAI_Sports_Platform.dmg build/macos/Build/Products/Release/
```

#### Linux Packages
Create AppImage:
```bash
# Install appimage-builder
pip install appimage-builder

# Create AppImage
appimage-builder --recipe AppImageBuilder.yml
```

## Coaching Features Included

### Enhanced Coach Dashboard
- ✅ **Direct Athlete Communication**: Real-time messaging system
- ✅ **Personal Training Plans**: Custom plan creation and assignment
- ✅ **Session Scheduling**: Book and manage training sessions
- ✅ **Video Analysis**: Upload and analyze technique videos
- ✅ **Performance Analytics**: Comprehensive athlete metrics
- ✅ **Progress Tracking**: Monitor improvement over time
- ✅ **Injury Risk Assessment**: AI-powered injury prevention
- ✅ **Mental Training**: Psychological wellness monitoring
- ✅ **Resource Library**: Training templates and guidance tools

### New Messaging System
- Individual athlete conversations
- Group messaging capabilities
- Quick action buttons (schedule, send plans, video call)
- Message history and read receipts
- Integration with training plans

### Personal Training Features
- Custom plan creation per athlete
- Focus area selection (speed, strength, endurance, etc.)
- Progress tracking with visual indicators
- Session scheduling and management
- Resource library access
- Goal setting frameworks

## Testing Checklist

### Web Application Testing
- [ ] All dashboard tabs load correctly
- [ ] Messaging system works
- [ ] Personal training plan creation
- [ ] Session scheduling functionality
- [ ] Responsive design on different screen sizes
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Desktop Application Testing
- [ ] App launches and loads web content
- [ ] Window controls work (minimize, maximize, close)
- [ ] Proper error handling for network issues
- [ ] App icon displays correctly
- [ ] Installation and uninstallation process

## Security Considerations

### Web Application Security
- Use HTTPS in production
- Implement proper authentication
- Sanitize user inputs
- Secure API endpoints
- Regular security updates

### Desktop Application Security
- Code sign applications
- Use secure communication (HTTPS)
- Implement auto-update mechanism
- Regular dependency updates

## Performance Optimization

### Web Application
- Lazy loading for components
- Image optimization
- Code splitting
- Caching strategies
- CDN for static assets

### Desktop Application
- WebView caching
- Efficient memory management
- Background update checks
- Optimized bundle size

## Monitoring and Analytics

### Recommended Tools
- **Error Tracking**: Sentry or LogRocket
- **Analytics**: Google Analytics or Mixpanel
- **Performance**: Web Vitals, Lighthouse
- **Uptime Monitoring**: UptimeRobot or Pingdom

## Maintenance

### Regular Tasks
- Security updates
- Dependency updates
- Performance monitoring
- User feedback collection
- Feature usage analytics

### Backup Strategy
- Regular database backups
- Code repository backups
- Configuration backups
- Asset file backups

## Support and Documentation

### User Training
- Coach onboarding guides
- Video tutorials for features
- Best practices documentation
- FAQ section

### Technical Support
- Error reporting system
- Support ticket system
- Documentation updates
- Version release notes

## Scaling Considerations

### Infrastructure Scaling
- Load balancing for web app
- Database optimization
- CDN implementation
- Caching layers

### Feature Scaling
- Modular architecture
- Plugin system for extensions
- API for third-party integrations
- Multi-language support

This deployment guide ensures a comprehensive rollout of the SAI Sports Platform with all coaching features and desktop application support.