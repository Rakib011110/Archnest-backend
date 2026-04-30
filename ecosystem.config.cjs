module.exports = {
  apps: [
    {
      name: 'resellers-zone-backend',
      cwd: './server-code',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      exp_backoff_restart_delay: 100,
      min_uptime: '10s',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      out_file: './server-code/logs/pm2-out.log',
      error_file: './server-code/logs/pm2-error.log',
      merge_logs: true,
      time: true
    }
  ]
};
