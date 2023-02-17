module.exports = {
  apps: [
    {
      script: "yarn production:server",
      name: "deLinZK Server",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
