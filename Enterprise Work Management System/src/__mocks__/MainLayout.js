const React = require('react');
const { Outlet } = require('react-router-dom');

// Minimal MainLayout mock for tests — renders child routes without WebSocket
const MainLayout = () => React.createElement('div', { 'data-testid': 'main-layout' }, React.createElement(Outlet));

module.exports = MainLayout;
module.exports.default = MainLayout;
