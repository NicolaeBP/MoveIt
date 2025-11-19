/* eslint-disable */
/**
 * Windows Code Signing Script - YubiKey Edition
 * Signs Windows executables using YubiKey PIV hardware token
 *
 * Certificate Details:
 * - Slot: 9a (PIV Authentication)
 * - Algorithm: ECCP384
 * - Subject: BP Consulting
 * - Issuer: SSL.com Code Signing Intermediate CA ECC R2
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// Load environment variables from .env or .env.local
const envPaths = [
  path.join(__dirname, '../.env.local'),
  path.join(__dirname, '../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    break; // Use first found env file
  }
}

/**
 * Custom signing function called by electron-builder
 * @param {Object} configuration
 * @param {string} configuration.path - Path to file to sign
 * @param {string} configuration.hash - Signing algorithm (sha256/sha384)
 */
exports.default = async function (configuration) {
  const { path: filePath, hash } = configuration;

  // Check if signing should be skipped
  if (process.env.SKIP_SIGNING === 'true') {
    console.log('⚠️  Windows signing skipped - SKIP_SIGNING=true');
    return;
  }

  const YUBIKEY_PIN = process.env.YUBIKEY_PIN;
  const YUBIKEY_SLOT = process.env.YUBIKEY_SLOT || 'AUTHENTICATION'; // Default to slot 9a

  if (!YUBIKEY_PIN) {
    console.warn('⚠️  Windows signing skipped - YUBIKEY_PIN not set');
    console.warn('   Set YUBIKEY_PIN in .env or .env.local file');
    return;
  }

  const fileName = path.basename(filePath);
  console.log(`🔏 Signing (${hash}): ${fileName}`);

  // jsign command with PIV storetype for YubiKey
  const args = [
    '--storetype', 'PIV',
    '--storepass', YUBIKEY_PIN,
    '--alias', YUBIKEY_SLOT,
    '--tsaurl', 'http://timestamp.digicert.com',
    '--tsmode', 'RFC3161',
    '--replace',  // Sign in-place (overwrites original file)
    filePath
  ];

  try {
    const result = spawnSync('jsign', args, {
      stdio: 'inherit',
      timeout: 120000, // 2 minute timeout
    });

    if (result.error) {
      if (result.error.code === 'ENOENT') {
        throw new Error('jsign not found - install with: brew install jsign');
      }
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`jsign exited with code ${result.status}`);
    }

    console.log(`✅ Signed (${hash}): ${fileName}`);
  } catch (error) {
    console.error(`❌ Signing failed for ${fileName}`);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    throw error;
  }
};
