/* eslint-disable */
const { notarize } = require('@electron/notarize');
const path = require('path');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only notarize for macOS builds
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  console.log('🔐 Starting notarization process...');
  console.log('📦 App path:', appPath);
  console.log('⏳ This typically takes 5-10 minutes...');

  const startTime = Date.now();

  try {
    await notarize({
      tool: 'notarytool',
      appPath: appPath,
      keychainProfile: 'MoveIt-Notarization' // Using stored keychain credentials
    });

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Notarization successful! (took ${duration} seconds)`);
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.error(`❌ Notarization failed after ${duration} seconds`);
    console.error('Error details:', error.message);

    // Provide helpful troubleshooting info
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check Apple System Status: https://developer.apple.com/system-status/');
    console.log('2. Verify keychain credentials: xcrun notarytool history --keychain-profile "MoveIt-Notarization"');
    console.log('3. Check for new Apple agreements: https://developer.apple.com/account');

    throw error;
  }
};
