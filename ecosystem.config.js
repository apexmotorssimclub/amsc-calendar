module.exports = {
  apps: [
    {
      name: 'amsc-calendar',
      script: 'npm',
      args: 'run start',
      cwd: '/root/amsc-calendar',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}; 