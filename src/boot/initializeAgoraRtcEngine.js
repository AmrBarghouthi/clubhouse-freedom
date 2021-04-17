import AgoraRtcEngine from 'agora-electron-sdk'

export default ({ Vue }) => {
  const agoraAppId = '938de3e8055e42b281bb8c6f69c21f78'
  const rtcEngine = new AgoraRtcEngine()
  rtcEngine.initialize(agoraAppId, 0xFFFFFFFE)
  rtcEngine.disableVideo()
  Vue.prototype.$rtcEngine = rtcEngine
}
