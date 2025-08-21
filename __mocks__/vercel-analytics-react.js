// Simple Jest stub for @vercel/analytics/react
const React = require('react');

function Analytics() {
  return React.createElement(React.Fragment, null);
}

module.exports = { Analytics };
