<template>
  <div id="app">
    <transition name="fade" mode="out-in"
      <router-view/>
      <client-search ref="searchForm"></client-search>
    </transition>
    <footer>
      <span class="authors">By {{ authors }} </span>
      <div class="version">
        <a class="update-indicator" @click="confirmUpdateModal()">
          <span class="message-icon" :class="{'success': upToDate, 'danger': outdated, 'info': downloading }">
            <font-awesome-icon icon="check-circle" v-if="upToDate"></font-awesome-icon>
            <font-awesome-icon icon="exclamation-circle" pulse v-if="outdated"></font-awesome-icon>
            <font-awesome-icon icon="sync" spin v-if="downloading"></font-awesome-icon>
          </span>
          <span class="message">{{ textMsg }}</span>
        </a>
        <span class="info">{{ name }} {{ version }} &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
    <el-dialog
      title="Tips"
      :visible.sync="confirmUpdate"
      width="30%">
      <span>Cerrar la aplicacion y actualizar?</span>
      <div slot="footer" style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="confirmUpdate = false">cancel</el-button>
        <el-button type="primary" size="mini" @click="sendMessageUpdate()">confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import ClientSearch from '@/components/Shared/ClientSearch'
  const appPackage = require('../../package.json')

  export default {
    name: 'barmanager',
    components: { FontAwesomeIcon, ClientSearch },
    data () {
      return {
        authors: appPackage.author,
        name: appPackage.name,
        version: appPackage.version,
        confirmUpdate: false,
        eventMsg: 'wait',
        textMsg: 'wait'
      }
    },
    computed: {
      upToDate () {
        return (this.eventMsg === 'notAvailable' || this.eventMsg === 'dev')
      },
      outdated () {
        return (this.eventMsg === 'available' || this.eventMsg === 'downloaded')
      },
      downloading () {
        return (this.eventMsg === 'downloading' || this.eventMsg === 'checking')
      }
    },
    created () {
      console.log(this.$refs)

      ipcRenderer.send('ready-to-messages', {})

      ipcRenderer.on('message', (event, message) => {
        console.log(message)
        this.eventMsg = message.event
        this.textMsg = message.message
      })

      ipcRenderer.on('open-page', (event, page) => {
        this.$router.push({ name: page })
      })

      ipcRenderer.on('open-search', (event) => {
        this.$nextTick(() => {
          this.$refs.searchForm.open()
        })
      })
    },
    methods: {
      confirmUpdateModal () {
        if (this.upToDate || this.downloading) { return false }
        this.confirmUpdate = true
      },
      sendMessageUpdate () {
        ipcRenderer.send('install-updates', {})
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Ubuntu');

  html, body {
    height: 100% !important;
    width: 100% !important;
    overflow-x: hidden;
    background: #E4E7ED;
    font-family: 'Ubuntu', sans-serif;
    padding: 0px !important;
    margin: 0px !important;
  }

  .fade-leave-active {
    opacity: 0;
  }
  .fade-enter-active {
    transition: opacity 0.1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  footer {
    position: absolute;
    bottom: 0px;
    height: 30px;
    line-height: 30px;
    background: #333;
    color: #fff;
    font-size: 10px;
    padding: 3px 5px;
    width: 100%;
    z-index: 100001;
  }
  footer .version { float: right; margin-right: 20px;}
  footer .update-indicator .message { margin: 0px 10px 0px 5px; }
  footer .update-indicator .message-icon.success { color: #67C23A !important; }
  footer .update-indicator .message-icon.danger { color: #F56C6C !important; }
  footer .update-indicator .message-icon.info { color: #909399 !important; }
  footer .update-indicator:hover .message { border-bottom: solid 1px #f1f1f1; cursor: pointer;}
</style>
