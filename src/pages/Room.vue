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
      pubnub.addListener({
        // Messages
        message: function(m) {
          console.log({pubnubMessage: m})
          /*
          const channelName = m.channel; // Channel on which the message was published
          const channelGroup = m.subscription; // Channel group or wildcard subscription match (if exists)
          const pubTT = m.timetoken; // Publish timetoken
          const msg = m.message; // Message payload
          const publisher = m.publisher; // Message publisher
          */
        },
        // Presence
        presence: function(p) {
          console.log({pubnubPrsence: p})
          /*
          const action = p.action; // Can be join, leave, state-change, or timeout
          const channelName = p.channel; // Channel to which the message belongs
          const occupancy = p.occupancy; // Number of users subscribed to the channel
          const state = p.state; // User state
          const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
          const publishTime = p.timestamp; // Publish timetoken
          const timetoken = p.timetoken; // Current timetoken
          const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
          */
        },
        // Signals
        signal: function(s) {
          console.log({pubnubSignal: s})
          /*
          const channelName = s.channel; // Channel to which the signal belongs
          const channelGroup = s.subscription; // Channel group or wildcard subscription match, if any
          const pubTT = s.timetoken; // Publish timetoken
          const msg = s.message; // Payload
          const publisher = s.publisher; // Message publisher
          */
        },
        objects: objectEvent => {
          console.log({pubnubObjects: objectEvent})
          /*
          const channel = objectEvent.channel; // Channel to which the event belongs
          const channelGroup = objectEvent.subscription; // Channel group
          const timetoken = objectEvent.timetoken; // Event timetoken
          const publisher = objectEvent.publisher; // UUID that made the call
          const event = objectEvent.event; // Name of the event that occurred
          const type = objectEvent.type; // Type of the event that occurred
          const data = objectEvent.data; // Data from the event that occurred
          */
        },
        messageAction: function(ma) {
          console.log({pubnubMessageAction: ma})
          /*
          const channelName = ma.channel; // Channel to which the message belongs
          const publisher = ma.publisher; // Message publisher
          const event = ma.event; // Message action added or removed
          const type = ma.data.type; // Message action type
          const value = ma.data.value; // Message action value
          const messageTimetoken = ma.data.messageTimetoken; // Timetoken of the original message
          const actionTimetoken = ma.data.actionTimetoken; // Timetoken of the message action
          */
        },
        status: function(s) {
          console.log({pubnubStatus: s})
          /*
          const affectedChannelGroups = s.affectedChannelGroups; // Array of channel groups affected in the operation
          const affectedChannels = s.affectedChannels; // Array of channels affected in the operation
          const category = s.category; // Returns PNConnectedCategory
          const operation = s.operation; // Returns PNSubscribeOperation
          const lastTimetoken = s.lastTimetoken; // Last timetoken used in the subscribe request (type long)
          const currentTimetoken = s.currentTimetoken;
          /* Current timetoken fetched in subscribe response,
           * to be used in the next request (type long) */
          //const subscribedChannels = s.subscribedChannels; // Array of all currently subscribed channels

        }
      });
      pubnub.subscribe({
        channels:['users.'+this.userId,'channel_user.'+this.roomInfo.channel+'.'+this.userId,'channel_all.'+this.roomInfo.channel]
      });
      this.pubnub = pubnub
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
