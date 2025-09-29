import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:window_manager/window_manager.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io' show Platform;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configure window for desktop platforms
  if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
    await windowManager.ensureInitialized();
    
    WindowOptions windowOptions = const WindowOptions(
      size: Size(1200, 800),
      minimumSize: Size(800, 600),
      center: true,
      backgroundColor: Colors.transparent,
      skipTaskbar: false,
      titleBarStyle: TitleBarStyle.normal,
      windowButtonVisibility: true,
      title: 'SAI Sports Platform',
    );
    
    windowManager.waitUntilReadyToShow(windowOptions, () async {
      await windowManager.show();
      await windowManager.focus();
    });
  }
  
  runApp(const SAISportsPlatformApp());
}

class SAISportsPlatformApp extends StatelessWidget {
  const SAISportsPlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SAI Sports Platform',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Roboto',
      ),
      home: const WebViewScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> with WindowListener {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _hasError = false;
  String _errorMessage = '';
  
  // Development server URL - change this to your production URL
  static const String webAppUrl = 'http://localhost:3000';
  
  @override
  void initState() {
    super.initState();
    _initializeWebView();
    
    // Add window listener for desktop
    if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
      windowManager.addListener(this);
    }
  }

  @override
  void dispose() {
    if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
      windowManager.removeListener(this);
    }
    super.dispose();
  }

  @override
  void onWindowClose() async {
    bool isPreventClose = await windowManager.isPreventClose();
    if (isPreventClose) {
      showDialog(
        context: context,
        builder: (_) {
          return AlertDialog(
            title: const Text('Confirm Close'),
            content: const Text('Are you sure you want to close the application?'),
            actions: [
              TextButton(
                child: const Text('No'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              TextButton(
                child: const Text('Yes'),
                onPressed: () {
                  Navigator.of(context).pop();
                  windowManager.destroy();
                },
              ),
            ],
          );
        },
      );
    }
  }

  void _initializeWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            // Update loading progress
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _hasError = false;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            setState(() {
              _isLoading = false;
              _hasError = true;
              _errorMessage = error.description;
            });
          },
          onNavigationRequest: (NavigationRequest request) {
            // Allow all navigation within the app
            return NavigationDecision.navigate;
          },
        ),
      )
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: (JavaScriptMessage message) {
          // Handle messages from web app if needed
          _handleWebMessage(message.message);
        },
      )
      ..loadRequest(Uri.parse(webAppUrl));
  }

  void _handleWebMessage(String message) {
    // Handle communication from web app
    try {
      // Parse message and handle accordingly
      // For example: notifications, file downloads, etc.
      print('Message from web app: $message');
    } catch (e) {
      print('Error handling web message: $e');
    }
  }

  void _reloadPage() {
    setState(() {
      _isLoading = true;
      _hasError = false;
    });
    _controller.reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Custom title bar for desktop
          if (Platform.isWindows || Platform.isLinux || Platform.isMacOS)
            _buildTitleBar(),
          
          // Main content
          Expanded(
            child: Stack(
              children: [
                // WebView
                if (!_hasError)
                  WebViewWidget(controller: _controller),
                
                // Error screen
                if (_hasError)
                  _buildErrorScreen(),
                
                // Loading indicator
                if (_isLoading)
                  _buildLoadingScreen(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTitleBar() {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: Colors.blue.shade700,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          const SizedBox(width: 16),
          Image.asset(
            'assets/icon/app_icon.png',
            height: 24,
            width: 24,
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.sports,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 8),
          const Text(
            'SAI Sports Platform',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const Spacer(),
          _buildWindowControls(),
        ],
      ),
    );
  }

  Widget _buildWindowControls() {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.minimize, color: Colors.white, size: 16),
          onPressed: () => windowManager.minimize(),
          tooltip: 'Minimize',
        ),
        IconButton(
          icon: const Icon(Icons.crop_square, color: Colors.white, size: 16),
          onPressed: () async {
            if (await windowManager.isMaximized()) {
              windowManager.unmaximize();
            } else {
              windowManager.maximize();
            }
          },
          tooltip: 'Maximize/Restore',
        ),
        IconButton(
          icon: const Icon(Icons.close, color: Colors.white, size: 16),
          onPressed: () => windowManager.close(),
          tooltip: 'Close',
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildLoadingScreen() {
    return Container(
      color: Colors.white,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text(
              'Loading SAI Sports Platform...',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorScreen() {
    return Container(
      color: Colors.white,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              const Text(
                'Failed to Load Application',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage.isNotEmpty 
                    ? _errorMessage 
                    : 'Please check your internet connection and try again.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: _reloadPage,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                  ),
                  const SizedBox(width: 16),
                  OutlinedButton.icon(
                    onPressed: () {
                      // Open settings or help
                    },
                    icon: const Icon(Icons.settings),
                    label: const Text('Settings'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}