#!/bin/bash
# Post-removal script for MoveIt .deb package
# Cleans up udev rules and module loading config

set -e

rm -f /etc/udev/rules.d/99-moveit-uinput.rules
rm -f /etc/modules-load.d/moveit-uinput.conf

udevadm control --reload-rules 2>/dev/null || true
