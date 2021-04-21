import Pubnub from 'pubnub'
import AgoraRtcEngine from "agora-electron-sdk";
<<<<<<< HEAD
import chAxios from 'axios';

export default class RoomController{
=======
import Ajax from './ajax'
import { reject, resolve } from 'core-js/fn/promise';
import chAxios from 'axios';

class RoomController{
>>>>>>> e7c7c6684b602171db4cc96ff0f53f36d8cbc3ef
  constructor(userId,chAuthToken,autoLeaveOnRoomEnded = true,clearListnersOnRoomLeave = true){
    this.currentRoom = null
    this.userId = userId
    this.chAuthToken = chAuthToken
    this.autoLeaveOnRoomEnded = autoLeaveOnRoomEnded
    this.clearListnersOnRoomLeave = clearListnersOnRoomLeave
    this.clearAllEventListners()
  }

  joinRoom(room){
    return new Promise((resolve,reject)=>{
       // joining on clubhouse server
      const url = "join_channel";
      const data = { channel: room };
      const headers = {
        Authorization: `Token ${this.authToken}`,
        "CH-UserID": this.userId
      };

      chAxios
        .post(url, data, { headers })
        .then(res => {
          try {
            await Promise.all([ this.joinRoomAgora(res.data.token,room),
              this.joinPubnub(res.data.pubnubToken,res.data.pubnub_origin,res.data.pubnub_heartbeat_value,res.data.pubnub_heartbeat_intreval)])
              this.currentRoom = room
              resolve(res.data)
          } catch (error) {
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        });
    })

  }
  joinRoomAgora(token,room){
    return new Promise((resolve,reject) => {
      const agoraAppId = "938de3e8055e42b281bb8c6f69c21f78";
      this.rtcEngine = new AgoraRtcEngine();
      this.rtcEngine.initialize(agoraAppId, 0xfffffffe);
      this.rtcEngine.disableVideo();
      if(this.currentRoom == room){
        resolve()
        return
      }
      const info = ''
      const uid = this.userId
      const joinChannelReturnCode = await this.rtcEngine.joinChannel(
        token,
        room,
        info,
        uid
      )

      if(joinChannelReturnCode < 0)
         reject('faild to join agora channel with code '+joinChannelReturnCode)
      else
        resolve()
      })

  }

  joinPubnub(token,origin,heartbeatValue,heartbeatInterval){
    const pnConfig = {
      subscribeKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d",
      publishKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
      uuid: this.userId,
      presenceTimeout: heartbeatValue,
      heartbeatInterval: heartbeatInterval,
      origin: origin,
      authKey: token
    };
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
    });
    const pubnub = new Pubnub(pnConfig);
    pubnub.subscribe({
      channels:['users.'+this.userId,'channel_user.'+channel+'.'+this.userId,'channel_all.'+channel]
    });
    this.pubnub = pubnub
  }

  userJoindEvent(profile)
  {
    this.userJoindEventListners.forEach(cb => cb(profile))
  }

  userLeftEvent(userId)
  {
    this.userLeftEventListners.forEach(cb => cb(userId))
  }

  roomEndedEvent(){
    this.roomEndedEventListners.forEach(cb => cb())
    if(this.autoLeaveOnRoomEnded)
      this.leaveRoom()
  }
  addListener(event,callback)
  {
    switch (event) {
      case 'user_joined':
        this.userJoindEventListners.push(callback)
        break;
      case 'user_left':
        this.userLeftEventListners.push(callback)
        break;
      case 'room_ended':
        this.roomEndedEventListners.push(callback)
        break;
      case 'inveted_to_speak':
        this.invetedToSpeakEventListners.push(callback)
        break;

    }
  }
  clearAllEventListners()
  {
    this.userJoindEventListners = []
    this.userLeftEventListners = []
    this.roomEndedEventListners = []
    this.invetedToSpeakEventListners = []
  }
  async leaveRoom(){
    return new Promise((resolve,reject) => {
      try {
        await this.rtcEngine.leaveChannel();
      } catch (error) {
        reject(error)
        return
      }

      const url = "leave_channel";
      const data = { channel: this.currentRoom, channel_id: null };
      const headers = {
        Authorization: `Token ${this.chAuthToken}`,
        "CH-UserID": this.userId
      };

      try {
        await chAxios.post(url, data, { headers });
      } catch (error) {
        reject(error)
        return
      }

<<<<<<< HEAD
      this.pubnub.stop()
=======
>>>>>>> e7c7c6684b602171db4cc96ff0f53f36d8cbc3ef
      this.currentRoom = null
      if(this.clearListnersOnRoomLeave)
        this.clearAllEventListners()

      resolve()
    })
  }
};
