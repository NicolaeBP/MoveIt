/* global process */
import { unlinkSync, renameSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';

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
  files: ['dist/**/*', 'assets/**/*', 'package.json', 'node_modules/**/*', 'native/**/*'],
  asarUnpack: ['**/*.node', '**/node_modules/bindings/**', '**/node_modules/@nut-tree-fork/**', '**/native/uinput/**'],
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
    target: ['AppImage', 'deb'],
    icon: 'assets/icon.png',
    category: 'Utility',
  },
  afterPack(context) {
    if (context.electronPlatformName !== 'linux') return;

    const execName = 'MoveIt';
    const execPath = join(context.appOutDir, execName);
    const binPath = join(context.appOutDir, `${execName}.bin`);

    renameSync(execPath, binPath);

    const wrapper = `#!/bin/bash
SCRIPT_DIR="$(dirname "$(readlink -f "\${BASH_SOURCE[0]}")")"

SANDBOX_FLAG=""
if [ -f /proc/sys/kernel/unprivileged_userns_clone ] && [ "$(cat /proc/sys/kernel/unprivileged_userns_clone)" = "0" ]; then
  SANDBOX_FLAG="--no-sandbox"
fi
if [ -f /proc/sys/kernel/apparmor_restrict_unprivileged_userns ] && [ "$(cat /proc/sys/kernel/apparmor_restrict_unprivileged_userns)" = "1" ]; then
  SANDBOX_FLAG="--no-sandbox"
fi

exec "\${SCRIPT_DIR}/${execName}.bin" \${SANDBOX_FLAG} "$@"
`;

    writeFileSync(execPath, wrapper);
    chmodSync(execPath, '755');

    try {
      unlinkSync(join(context.appOutDir, 'chrome-sandbox'));
    } catch {
      // Already absent
    }
  },
  deb: {
    depends: [],
    maintainer: 'Nicolae Balica <nicolaebalica@bpconsulting.pro>',
    packageName: 'MoveIt',
    synopsis: 'Professional mouse automation tool',
    description:
      'Keep your system active during presentations, testing, and remote sessions. Features smart scheduling, multilingual support, and a clean modern interface.',
    afterInstall: 'scripts/afterInstall.sh',
    afterRemove: 'scripts/afterRemove.sh',
  },
};

export default config;
