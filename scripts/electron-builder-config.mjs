/* global process */
/**
 * electron-builder configuration
 * Main configuration for packaging the application
 */

/**
 * electron-builder configuration
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: 'com.nicolaebalica.moveit',
  productName: 'MoveIt',
  executableName: 'MoveIt',
  afterSign: 'scripts/notarize.cjs',
  directories: {
    output: 'release',
    buildResources: 'build',
  },
  files: ['dist/**/*', 'assets/**/*', 'package.json', 'node_modules/**/*'],
  mac: {
    category: 'public.app-category.utilities',
    target: ['dmg', 'zip'],
    icon: 'assets/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'entitlements.mac.plist',
    entitlementsInherit: 'entitlements.mac.plist',
    ...(process.env.SKIP_SIGNING !== 'true' && {
      identity: 'Nicolae Balica (72Z547BVVA)',
    }),
  },
  mas: {
    type: 'distribution',
    category: 'public.app-category.utilities',
    icon: 'assets/icon.icns',
    entitlements: 'entitlements.mas.plist',
    entitlementsInherit: 'entitlements.mas.inherit.plist',
    provisioningProfile: 'build/MoveIt_Mac_App_Store.provisionprofile',
    hardenedRuntime: false,
    gatekeeperAssess: false,
    binaries: [],
    identity: 'Nicolae Balica (72Z547BVVA)',
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32'],
      },
    ],
    icon: 'assets/icon.ico',
    artifactName: '${productName} Setup ${version}.${ext}',
    signtoolOptions: {
      sign: './scripts/sign-windows-yubikey.cjs',
    },
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'MoveIt',
  },
  linux: {
    target: 'AppImage',
    icon: 'assets/icon.png',
  },
};

export default config;
