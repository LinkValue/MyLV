function reportingFactory(path, options) {
  return [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [options],
  }, {
    module: 'good-squeeze',
    name: 'SafeJson',
  }, {
    module: 'good-file',
    args: [path],
  }]
}

module.exports = {
  host: {
    port: process.env.PORT || 8001,
  },
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' }),
    },
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  front: {
    featureFlipping: {
      holidays: true,
      offlineMode: true,
      pushNotifications: true,
      transport: true,
    },
    sentry: {
      dsn: '12183e96fee94f34bf55a85d0fe1c802',
      projectId: '418084',
    },
  },
  mailjet: {
    webAppUrl: 'https://mylv.link-value.fr',
  },
}
