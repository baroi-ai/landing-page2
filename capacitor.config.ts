import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sharkyai.app',
  appName: 'Sharky AI',
  webDir: 'dist', // Or 'build'

  server: {
    // This tells Capacitor to treat your app as if it's served over HTTPS,
    // which is the modern standard for Android.
    androidScheme: 'https',

    // ✅ THE FIX: This explicitly allows your app to make insecure HTTP requests
    // (like to http://192.168.1.10:8000) during local development.
    // This setting has no effect on your production HTTPS URLs.
    cleartext: true,

    // This is good to keep for security. It ensures your app can't be
    // redirected to an unexpected domain.
    allowNavigation: ["api.sharkyai.xyz"],
  },
  
  // The Assets plugin is for the icon/splash screen generator and is correct.
  plugins: {
    Assets: {
      path: 'resources'
    }
  }
};

export default config;