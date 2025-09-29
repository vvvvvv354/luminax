# SAI Sports Platform - Flutter Desktop Wrapper

This Flutter application wraps the SAI Sports Platform web application for desktop deployment with native desktop features.

## Features

- **Native Desktop App**: Run the web application as a native desktop application
- **Cross-Platform**: Supports Windows, macOS, and Linux
- **Custom Window Controls**: Native window management and controls
- **Offline Detection**: Handle network connectivity issues gracefully
- **Auto-Updates**: Can be configured for automatic updates
- **App Icon**: Custom SAI Sports Platform branding

## Prerequisites

- Flutter SDK (3.0.0 or higher)
- For Windows: Visual Studio 2022 with C++ development tools
- For macOS: Xcode 13 or higher
- For Linux: GTK 3.0 development libraries

## Installation & Setup

### 1. Install Flutter Dependencies

```bash
cd flutter_wrapper
flutter pub get
```

### 2. Platform-Specific Setup

#### Windows
```bash
flutter config --enable-windows-desktop
```

#### macOS
```bash
flutter config --enable-macos-desktop
```

#### Linux
```bash
flutter config --enable-linux-desktop
sudo apt-get install libgtk-3-dev
```

### 3. Configure Web App URL

Edit `lib/main.dart` and update the `webAppUrl` constant:

```dart
// For development
static const String webAppUrl = 'http://localhost:3000';

// For production
static const String webAppUrl = 'https://your-production-domain.com';
```

## Development

### Run in Development Mode

```bash
# Run on Windows
flutter run -d windows

# Run on macOS
flutter run -d macos

# Run on Linux
flutter run -d linux
```

### Debug Mode
The app includes error handling and retry mechanisms for network issues. In debug mode, you can see console logs for troubleshooting.

## Building for Production

### Windows
```bash
flutter build windows --release
```
The executable will be in `build/windows/runner/Release/`

### macOS
```bash
flutter build macos --release
```
The app bundle will be in `build/macos/Build/Products/Release/`

### Linux
```bash
flutter build linux --release
```
The executable will be in `build/linux/x64/release/bundle/`

## Creating Installers

### Windows (NSIS)
1. Install NSIS (Nullsoft Scriptable Install System)
2. Create installer script using the built executable
3. Include Visual C++ Redistributable if needed

### macOS (DMG)
1. Use `create-dmg` tool or Xcode
2. Code sign the application for distribution
3. Notarize for Gatekeeper compatibility

### Linux (AppImage/Snap/DEB)
1. Use `appimage-builder` for AppImage
2. Use `snapcraft` for Snap packages
3. Use `dpkg-deb` for DEB packages

## Configuration

### App Icon
Place your app icons in:
- `windows/runner/resources/app_icon.ico` (Windows)
- `macos/Runner/Assets.xcassets/AppIcon.appiconset/` (macOS)
- `linux/` (Linux - varies by distribution)

### App Metadata
Update the following files with your app information:
- `pubspec.yaml` - App version and dependencies
- `windows/runner/Runner.rc` - Windows app metadata
- `macos/Runner/Info.plist` - macOS app metadata
- `linux/my_application.cc` - Linux app metadata

## Features & Customization

### Window Management
- Custom title bar with minimize/maximize/close buttons
- Configurable window size and position
- Window state persistence (can be added)

### Network Handling
- Automatic retry on connection failure
- Offline mode detection
- Error messages for connectivity issues

### Communication Bridge
The app includes a JavaScript bridge for communication between Flutter and the web app:

```javascript
// From web app, send message to Flutter
window.FlutterBridge.postMessage('your-message');
```

```dart
// In Flutter, handle messages from web app
void _handleWebMessage(String message) {
  // Process message from web app
}
```

## Deployment

### Development Deployment
1. Start your web application development server
2. Run the Flutter app pointing to localhost

### Production Deployment
1. Deploy your web application to production server
2. Update the `webAppUrl` in `main.dart`
3. Build and distribute the desktop app

### Auto-Updates (Optional)
Implement auto-update functionality using:
- `flutter_updater` package
- Custom update mechanism
- Store distribution (Microsoft Store, Mac App Store)

## Troubleshooting

### Common Issues

1. **WebView not loading**
   - Check if the web app URL is accessible
   - Verify network connectivity
   - Check CORS settings on your web server

2. **Build errors**
   - Ensure all platform dependencies are installed
   - Run `flutter clean` and `flutter pub get`
   - Check Flutter and platform-specific requirements

3. **Permission issues**
   - Camera/microphone permissions are configured in platform files
   - Update Info.plist (macOS) for additional permissions

### Debug Information
Enable debug logging by setting the Flutter build mode to debug and checking console output.

## Support

For issues specific to the Flutter wrapper:
1. Check Flutter documentation
2. Verify platform-specific setup
3. Test with a simple web URL first

For SAI Sports Platform features:
1. Check the main web application documentation
2. Verify API connectivity
3. Test in a regular web browser first

## License

This Flutter wrapper is part of the SAI Sports Platform project. See the main project for licensing information.