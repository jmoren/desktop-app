<template>
  <div id="app">
    <router-view></router-view>
    <footer>
      <span class="authors">By {{ authors }} </span>
      <div class="version">
        <span class="update-indicator" @click="confirmUpdate = true">
          <span class="message-icon" style="color: #F56C6C"><font-awesome-icon icon="exclamation-circle"></font-awesome-icon></span>
          <span class="message">{{ message }}</span>
        </span>
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
  const appPackage = require('../../package.json')

  export default {
    name: 'barmanager',
    components: { FontAwesomeIcon },
    data () {
      return {
        authors: appPackage.author,
        name: appPackage.name,
        version: appPackage.version,
        confirmUpdate: false,
        message: ''
      }
    },
    mounted () {
      console.log('mounted app')
      ipcRenderer.on('message', (event, message) => {
        console.log(message)
        this.event = message.event
        this.message = message.message
      })
    },
    methods: {
      sendMessageUpdate () {
        ipcRenderer.send('install-updates', {})
        console.log('send message to update')
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

  #wrapper {
    height: 100vh;
  }
  footer {
    position: absolute;
    bottom: 0px;
    height: 20px;
    line-height: 20px;
    background: #333;
    color: #fff;
    font-size: 10px;
    padding: 3px 5px;
    width: 100%;
  }
  footer .version { float: right; margin-right: 20px;}
  footer .update-indicator { margin-right: 10px; }
  footer .update-indicator:hover .message { border-bottom: solid 1px #f1f1f1; cursor: pointer;}
</style>
