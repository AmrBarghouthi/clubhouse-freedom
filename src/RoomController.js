import Pubnub from 'pubnub'
import AgoraRtcEngine from 'agora-electron-sdk'

export default class RoomController{
  constructor (userId,clubhouseApi,autoLeaveOnRoomEnded = true,clearListenersOnRoomLeave = true){
    this.currentRoom = null
    this.userId = userId
    this.clubhouseApi = clubhouseApi
    this.autoLeaveOnRoomEnded = autoLeaveOnRoomEnded
    this.clearListenersOnRoomLeave = clearListenersOnRoomLeave
    this.clearAllEventListeners()
  }

  getUserId (){
    return (typeof this.userId === 'function')?this.userId():this.userId
  }


  async joinRoom (room){
    return new Promise((resolve,reject)=>{
      // joining on clubhouse server

      this.clubhouseApi.joinChannel(room)
        .then(async res => {
          try {
            await Promise.all([ this.joinRoomAgora(res.token,room),
              this.joinPubnub(room,res.pubnub_token,res.pubnub_origin,res.pubnub_heartbeat_value,res.pubnub_heartbeat_intreval)])
            this.currentRoom = room
            resolve(res)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })

  }
  joinRoomAgora (token,room){
    return new Promise((resolve,reject) => {
      const agoraAppId = '938de3e8055e42b281bb8c6f69c21f78'
      this.rtcEngine = new AgoraRtcEngine()
      this.rtcEngine.initialize(agoraAppId, 0xfffffffe)
      this.rtcEngine.disableVideo()
      if (this.currentRoom == room){
        resolve()
        return
      }
      const info = ''
      const uid = this.getUserId()
      const joinChannelReturnCode = this.rtcEngine.joinChannel(
        token,
        room,
        info,
        uid,
      )
      this.rtcEngine.enableAudioVolumeIndication(200, 3, false)
      if (joinChannelReturnCode < 0)
        reject('faild to join agora channel with code '+joinChannelReturnCode)
      else
        resolve()
    })

  }

  joinPubnub (room,token,origin,heartbeatValue,heartbeatInterval){
    const pnConfig = {
      subscribeKey: 'sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d',
      publishKey: 'pub-c-6878d382-5ae6-4494-9099-f930f938868b',
      uuid: this.getUserId(),
      presenceTimeout: heartbeatValue,
      heartbeatInterval: heartbeatInterval,
      origin: origin,
      authKey: token,
    }

    const pubnub = new Pubnub(pnConfig)
    pubnub.addListener({
      // Messages
      message: (m)=> {
        switch (m.message.action){
          case 'join_channel':
            this.userJoindEvent(m.message.user_profile)
            break
          case 'leave_channel':
            this.userLeftEvent(m.message.user_id)
            break
          case 'end_channel':
            this.roomEndedEvent()
            break
          case 'invite_speaker':
            break
          default:
            console.log({pubnubMessage: m})
        }

      },
    })
    pubnub.subscribe({
      channels:['users.'+this.getUserId(),'channel_user.'+room+'.'+this.getUserId(),'channel_all.'+room],
    })
    this.pubnub = pubnub
  }

  userJoindEvent (profile)
  {
    this.userJoindEventListeners.forEach(cb => cb(profile))
  }

  userLeftEvent (userId)
  {
    this.userLeftEventListeners.forEach(cb => cb(userId))
  }

  roomEndedEvent (){
    this.roomEndedEventListeners.forEach(cb => cb())
    if (this.autoLeaveOnRoomEnded)
      this.leaveRoom()
  }

  addListener (event,callback)
  {
    switch (event) {
      case 'userJoined':
        this.userJoindEventListeners.push(callback)
        break
      case 'userLeft':
        this.userLeftEventListeners.push(callback)
        break
      case 'roomEnded':
        this.roomEndedEventListeners.push(callback)
        break
      case 'invetedToSpeak':
        this.invetedToSpeakEventListeners.push(callback)
        break
      case 'speakersVolumeUpdadetd':
        this.rtcEngine.on('groupAudioVolumeIndication', callback)
        break
      case 'userMuteChanged':
        this.rtcEngine.on('userMuteAudio', callback)
        break
    }
  }
  clearAllEventListeners ()
  {
    this.userJoindEventListeners = []
    this.userLeftEventListeners = []
    this.roomEndedEventListeners = []
    this.invetedToSpeakEventListeners = []
  }
  async leaveRoom (){
    return new Promise((resolve,reject) => {
      try {
        this.rtcEngine.leaveChannel()
        this.rtcEngine.release()
      } catch (error) {
        reject(error)
        return
      }


      try {
        this.clubhouseApi.leaveChannel(this.currentRoom)
          .then(()=>{
            this.pubnub.stop()
            this.currentRoom = null
            if (this.clearListenersOnRoomLeave)
              this.clearAllEventListeners()
            resolve()
          })
      } catch (error) {
        reject(error)
        return
      }
    })
  }
};