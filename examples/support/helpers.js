
exports.strip = function(str) {
  return str.split('*\\/').join('*/');
};
