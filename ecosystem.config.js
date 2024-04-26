const path = require('path');

console.log('ecosystem.config.js' + __dirname);

module.exports = {
  apps: [
    {
      name: 'milvus-typebot-builder',
      cwd: path.join(__dirname, '/apps/builder'),
      script: 'pnpm',
      args: 'start -p 3000',
    },
    {
      name: 'milvus-typebot-viewer',
      cwd: path.join(__dirname, '/apps/viewer'),
      script: 'pnpm',
      args: 'start -p 3001',
    }
  ]
};