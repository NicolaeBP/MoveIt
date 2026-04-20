const path = require('path');

let addon = null;

try {
  addon = require(path.join(__dirname, 'build', 'Release', 'moveit_uinput.node'));
} catch {
  addon = null;
}

module.exports = addon;
