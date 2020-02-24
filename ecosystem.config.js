module.exports = {
  apps: [{
    name: 'moon-api',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: ['src', 'yarn.lock', '.env'],
    max_memory_restart: '1G',
    env: {
      SERVICE_ENV: 'development',
    },
  }],
};