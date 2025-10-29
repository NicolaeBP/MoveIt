/**
 * Windows Code Signing Script
 * Signs Windows executables using SSL.com eSigner
 *
 * This script is called by electron-builder's signtoolOptions.sign
 * electron-builder calls this for each file that needs signing:
 * 1. App executable (MoveIt.exe) in unpacked directory
 * 2. Final NSIS installer (MoveIt Setup X.X.X.exe)
 */

/* eslint-disable */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const envPath = path.join(__dirname, '../.env.local');

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
}

// Path to CodeSignTool installation (relative to scripts directory)
const CODE_SIGN_TOOL = path.join(__dirname, '../tools/CodeSignTool/CodeSignTool.sh');

const TEMP_DIR = path.join(__dirname, '../release/temp-sign');

/**
 * Custom signing function called by electron-builder for each file
 * @param {Object} configuration - CustomWindowsSignTaskConfiguration
 * @param {string} configuration.path - Path to file to sign (.exe)
 * @param {string} configuration.hash - Signing algorithm (sha1 or sha256)
 * @param {boolean} configuration.isNest - Whether this is nested signing
 * @returns {Promise<void>}
 */
exports.default = async function (configuration) {
  const { path: filePath, hash } = configuration;

  if (process.env.SKIP_SIGNING === 'true') {
    console.log('⚠️  Windows signing skipped - SKIP_SIGNING=true');
    return;
  }

  const USER_NAME = process.env.WINDOWS_SIGN_USER_NAME;
  const USER_PASSWORD = process.env.WINDOWS_SIGN_USER_PASSWORD;
  const CREDENTIAL_ID = process.env.WINDOWS_SIGN_CREDENTIAL_ID;
  const USER_TOTP = process.env.WINDOWS_SIGN_USER_TOTP;

  if (!USER_NAME || !USER_PASSWORD || !CREDENTIAL_ID || !USER_TOTP) {
    console.warn('⚠️  Windows signing skipped - credentials not set');
    return;
  }

  if (!fs.existsSync(CODE_SIGN_TOOL)) {
    console.error(`❌ CodeSignTool not found at: ${CODE_SIGN_TOOL}`);
    throw new Error('CodeSignTool not installed');
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const fileName = path.basename(filePath);
  console.log(`🔏 Signing (${hash}): ${fileName}`);

  // Build CodeSignTool command - call java directly to avoid shell argument splitting
  // The CodeSignTool.sh uses $@ without quotes, causing issues with spaces in filenames
  const codeSignToolDir = path.dirname(CODE_SIGN_TOOL);
  const jarPath = path.join(codeSignToolDir, 'jar/code_sign_tool-1.3.2.jar');

  const args = [
    '-jar',
    jarPath,
    'sign',
    `-input_file_path=${filePath}`,
    `-output_dir_path=${TEMP_DIR}`,
    `-credential_id=${CREDENTIAL_ID}`,
    `-username=${USER_NAME}`,
    `-password=${USER_PASSWORD}`,
    `-totp_secret=${USER_TOTP}`,
  ];

  try {
    const result = spawnSync('java', args, {
      stdio: 'inherit',
      timeout: 120000,
      cwd: codeSignToolDir,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`CodeSignTool exited with code ${result.status}`);
    }

    const fileDir = path.dirname(filePath);
    const signedFile = path.join(TEMP_DIR, fileName);

    if (!fs.existsSync(signedFile)) {
      throw new Error(`Signed file not found: ${signedFile}`);
    }

    fs.renameSync(signedFile, path.join(fileDir, fileName));

    console.log(`✅ Signed (${hash}): ${fileName}`);
  } catch (error) {
    console.error(`❌ Signing failed for ${fileName}`);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    throw error;
  }
};
