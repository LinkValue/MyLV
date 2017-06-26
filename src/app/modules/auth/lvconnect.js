import LVConnectSDK from 'sdk-lvconnect'

export const cracraEndpoint = `${window.location.protocol}//${window.location.host}`

LVConnectSDK.overrideLVConnectEndpoint('http://localhost:8000')

export const lvConnect = new LVConnectSDK({
  mode: 'proxy',
  appId: process.env.APP_ID,
  redirectUri: `${cracraEndpoint}/auth`,
  tokenEndpoint: '/api/auth'
})