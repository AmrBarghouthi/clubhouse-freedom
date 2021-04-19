<template>
  <q-page class="page">
    <div class="q-pa-md">
      <div dir="auto" class="topic">
        {{ roomInfo.topic }}
      </div>
      <div class="users-grid">
        <div
          v-for="speaker in usersCategorized.speakers"
          :key="speaker.user_id"
          class="text-center"
        >
          <q-avatar size="60px" square class="smooth-corners">
            <img :src="speaker.photo_url" />
          </q-avatar>
          <div class="q-mt-sm under-photo">
            <q-icon
              v-if="speaker.is_moderator"
              name="star"
              class="text-white bg-primary"
              style="border-radius: 100%"
            />
            <span
              style="margin-left: 3px;"
              :class="{ 'font-bold': isSpeakingNow(speaker.user_id) }"
            >
              {{ speaker.first_name }}
            </span>
          </div>
        </div>
      </div>
      <div class="subheading">
        Followed by the speakers
      </div>
      <div class="users-grid">
        <div
          v-for="user in usersCategorized.followedBySpeakers"
          :key="user.user_id"
          class="text-center"
        >
          <q-avatar size="60px" square class="smooth-corners">
            <img :src="user.photo_url" />
          </q-avatar>
          <div class="q-mt-sm">
            <span>{{ user.first_name }}</span>
          </div>
        </div>
      </div>
      <div class="subheading">
        Others in the room
      </div>
      <div class="users-grid">
        <div
          v-for="user in usersCategorized.others"
          :key="user.user_id"
          class="text-center"
        >
          <q-avatar size="60px" square class="smooth-corners">
            <img :src="user.photo_url" />
          </q-avatar>
          <div class="q-mt-sm">
            <span>{{ user.first_name }}</span>
          </div>
        </div>
      </div>
    </div>
    <q-footer class="bg-white text-black fixed-bottom q-pa-md footer">
      <q-btn
        label="Leave quietly"
        rounded
        no-caps
        icon="fas fa-hand-peace"
        flat
        class="bg-alabaster"
        @click="leaveRoom"
      />
      <div>
        <q-btn
          rounded
          no-caps
          icon="fas fa-plus"
          flat
          round
          class="bg-alabaster q-mr-md"
        />
        <q-btn
          rounded
          no-caps
          icon="fas fa-fist-raised"
          flat
          round
          class="bg-alabaster"
        />
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import _ from "lodash";
import chAxios from "src/ajax";
import AgoraRtcEngine from "agora-electron-sdk";
import Pubnub from "pubnub";

export default {
  name: "PageRoom",
  data() {
    return {
      roomInfo: {},
      speakingNowInfo: []
    };
  },
  computed: {
    userId() {
      return this.$store.getters["auth/userId"];
    },
    authToken() {
      return this.$store.getters["auth/authToken"];
    },
    usersCategorized() {
      return _.groupBy(this.roomInfo.users || [], user => {
        const isSpeaker = user.is_speaker;
        const isFollowedBySpeakers = user.is_followed_by_speaker && !isSpeaker;

        if (isSpeaker) return "speakers";
        if (isFollowedBySpeakers) return "followedBySpeakers";
        return "others";
      });
    }
  },
  created() {
    const agoraAppId = "938de3e8055e42b281bb8c6f69c21f78";
    this.rtcEngine = new AgoraRtcEngine();
    this.rtcEngine.initialize(agoraAppId, 0xfffffffe);
    this.rtcEngine.disableVideo();
    this.joinRoom();
  },
  beforeDestroy() {
    this.rtcEngine.release();
    this.pubnub.unsubscribeAll();
		this.pubnub.destroy();
  },
  methods: {
    joinRoom() {
      const url = "join_channel";
      const data = { channel: this.$route.params.roomCode };
      const headers = {
        Authorization: `Token ${this.authToken}`,
        "CH-UserID": this.userId
      };

      chAxios
        .post(url, data, { headers })
        .then(res => {
          this.roomInfo = res.data;
          this.joinRoomAgora();
          this.joinRoomPubnub();
        })
        .catch(() => {
          this.showFailedToJoinNotification();
          this.leaveRoomClubhouse();
          this.$router.push({ name: "index" });
        });
    },
    async joinRoomAgora() {
      const token = this.roomInfo.token;
      const channel = this.roomInfo.channel;
      const info = "";
      const uid = this.userId;

      const joinChannelReturnCode = await this.rtcEngine.joinChannel(
        token,
        channel,
        info,
        uid
      );

      if (joinChannelReturnCode < 0) {
        this.showFailedToJoinNotification();
        this.leaveRoomClubhouse();
        this.$router.push({ name: "index" });
      }
      this.rtcEngine.enableAudioVolumeIndication(200, 3, false);

      const callback = speakers => {
        if (_.find(speakers, speaker => speaker.uid === 0)) return;
        this.speakingNowInfo = speakers;
      };
      this.rtcEngine.on("groupAudioVolumeIndication", callback);
    },
    joinRoomPubnub() {
      console.log('joining pubnub')
      const pnConfig = {
        subscribeKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d",
        publishKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
        uuid: this.userId,
        presenceTimeout: this.roomInfo.pubnub_heartbeat_value,
        heartbeatInterval: this.roomInfo.pubnub_heartbeat_intreval,
        origin: this.roomInfo.pubnub_origin,
        authKey: this.roomInfo.pubnub_token
      };
      const pubnub = new Pubnub(pnConfig);
      const vueComponent = this
      pubnub.addListener({
        // Messages
        message: function(m) {
          switch (m.message.action){
            case 'join_channel':
              vueComponent.userJoindEvent(m.message.user_profile)
              break
            case 'leave_channel':
              vueComponent.userLeftEvent(m.message.user_id)
              break
            case 'end_channel':
              break
            case 'invite_speaker':
              break
            default:
              console.log({pubnubMessage: m})
          }

        },
        // Presence
        presence: function(p) {
          console.log({pubnubPrsence: p})
        },
        // Signals
        signal: function(s) {
          console.log({pubnubSignal: s})
        },
        objects: objectEvent => {
          console.log({pubnubObjects: objectEvent})
        },
        messageAction: function(ma) {
          console.log({pubnubMessageAction: ma})
        },
        status: function(s) {
          console.log({pubnubStatus: s})
        }
      });
      pubnub.subscribe({
        channels:['users.'+this.userId,'channel_user.'+this.roomInfo.channel+'.'+this.userId,'channel_all.'+this.roomInfo.channel]
      });
      this.pubnub = pubnub
    },
    userJoindEvent(profile) {
      let notInRoom = true
      for(let i=0;i<this.roomInfo.users.length;i++)
      {
        const user = this.roomInfo.users[i]
        if(user.user_id == profile.user_id){
          notInRoom = false
        }
      }
      if(notInRoom)
        this.roomInfo.users.push(profile)
      console.log('user added')
    },
    userLeftEvent(userId)
    {
      console.log(`removing ${userId}`)
      for(let i=0;i<this.roomInfo.users.length;i++)
      {
        const user = this.roomInfo.users[i]
        if(user.user_id == userId){
          this.roomInfo.users.splice(i, 1);
          break
        }
      }
    },
    async leaveRoom() {
      await this.leaveRoomAgora();
      await this.leaveRoomClubhouse();
      this.$router.push({ name: "index" });
    },
    async leaveRoomAgora() {
      return await this.rtcEngine.leaveChannel();
    },
    async leaveRoomClubhouse() {
      const url = "leave_channel";
      const data = { channel: this.$route.params.roomCode, channel_id: null };
      const headers = {
        Authorization: `Token ${this.authToken}`,
        "CH-UserID": this.userId
      };

      await chAxios.post(url, data, { headers });
    },
    showFailedToJoinNotification() {
      this.$q.notify({
        type: "negative",
        message: "An error occured while joing the room.",
        position: "top",
        timeout: 2500
      });
    },
    isSpeakingNow(userId) {
      return (
        this.speakingNowInfo.find(user => user.uid === userId) !== undefined
      );
    }
  }
};
</script>

<style scoped>
.page {
  background-color: white;
}

.topic {
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  justify-content: space-between;
  gap: 30px;
}

.under-photo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.subheading {
  color: grey;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.font-bold {
  font-weight: 700;
}
</style>
