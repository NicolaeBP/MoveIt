#!/bin/bash
# Post-installation script for MoveIt .deb package
# Configures udev rules and permissions for /dev/uinput access (Wayland mouse movement)

set -e

# Create udev rule for uinput access
cat > /etc/udev/rules.d/99-moveit-uinput.rules << 'EOF'
# MoveIt - Allow user access to /dev/uinput for mouse automation on Wayland
KERNEL=="uinput", SUBSYSTEM=="misc", GROUP="input", MODE="0660", TAG+="uaccess"
EOF

# Ensure the uinput kernel module is loaded
if ! lsmod | grep -q "^uinput"; then
  modprobe uinput 2>/dev/null || true
fi

# Ensure uinput loads on boot
if [ ! -f /etc/modules-load.d/moveit-uinput.conf ]; then
  echo "uinput" > /etc/modules-load.d/moveit-uinput.conf
fi

# Set SUID bit on chrome-sandbox for proper Electron sandboxing
if [ -f /opt/MoveIt/chrome-sandbox ]; then
  chown root:root /opt/MoveIt/chrome-sandbox
  chmod 4755 /opt/MoveIt/chrome-sandbox
fi

# Reload udev rules
udevadm control --reload-rules 2>/dev/null || true
udevadm trigger --subsystem-match=misc 2>/dev/null || true

# Add the installing user to the 'input' group as fallback for non-logind systems
if [ -n "$SUDO_USER" ]; then
  usermod -a -G input "$SUDO_USER" 2>/dev/null || true
elif [ -n "$USER" ] && [ "$USER" != "root" ]; then
  usermod -a -G input "$USER" 2>/dev/null || true
fi
