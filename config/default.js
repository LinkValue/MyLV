module.exports = {
  server: {},
  host: {
    hostname: null,
    port: 8001,
  },
  logs: {
    reporters: {
      consoleReporter: [{
        module: 'good-console',
        args: [{ log: '*', response: '*', worker: '*' }],
      }, 'stdout'],
    },
  },
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'cracra',
    config: {
      useMongoClient: true,
    },
  },
  lvconnect: {
    appId: null,
    appSecret: null,
    endpoint: 'https://lvconnect.link-value.fr',
  },
  cracra: {
    lunchesRoles: ['hr', 'board', 'business'],
    partnersRoles: ['hr', 'board'],
  },
  pushNotifications: {
    email: 'mailto:no-reply@link-value.fr',
    privateKey: 'k1LSA-U-MFcGpo6lj-7WGjG5nHrSUencWBk4q4Z1z7k',
  },
  front: {
    featureFlipping: {
      holidays: true,
      transport: true,
      offlineMode: true,
      pushNotifications: true,
    },
    push: {
      publicKey: 'BP60hTFwFmaPMsbx_lQ7loJLWsnyXBIe218Qa46RXtZMhCgicLl6MoTo7idYG35W0jKTF5U7MB6GfI-i_H7-Mjk',
    },
  },
}
