module.exports = {
  apps: [
    {
      name: "app",
      script: "src/api/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "poller",
      script: "src/poller/index.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "workflow",
      script: "src/workflow/index.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "jobs",
      script: "src/jobs/index.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
