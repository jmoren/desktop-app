<template>
  <div id="app">
    <router-view/>
    <footer>
      <div class="path">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ name: 'tables' }">
            Inicio
          </el-breadcrumb-item>
          <el-breadcrumb-item 
            v-for="(path, index) in currentPath" 
            :key="index" 
            :to="{ name: path }">
            {{ path | capitalize }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="version">
        <el-tooltip 
          :content="tooltipMessage" 
          effect="dark" 
          placement="top">
          <span class="status">
            <a @click="confirmUpdateModal()">
              <span 
                :class="{'success': upToDate, 'danger': outdated, 'info': downloading }" 
                class="message-icon">
                <font-awesome-icon 
                  v-if="upToDate" 
                  icon="circle"/>
                <font-awesome-icon 
                  v-if="outdated" 
                  icon="circle"/>
                <font-awesome-icon 
                  v-if="downloading" 
                  icon="circle"/>
              </span>
            </a>
          </span>
        </el-tooltip>
        <span class="sep"><font-awesome-icon icon="ellipsis-v"/></span>
        <span class="info">{{ name }} {{ version }} &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
    <el-dialog
      :visible.sync="confirmUpdate"
      title="Actualizacion para instalar"
      width="30%">
      <span>Cerrar la aplicacion y actualizar?</span>
      <div 
        slot="footer" 
        style="text-align: right; margin: 0">
        <el-button 
          size="mini" 
          type="text" 
          @click="confirmUpdate = false">cancel</el-button>
        <el-button 
          type="primary" 
          size="mini" 
          @click="sendMessageUpdate()">confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
const appPackage = require("../../package.json");

export default {
  name: "Barmanager",
  components: { FontAwesomeIcon },
  data() {
    return {
      authors: appPackage.author,
      name: appPackage.name,
      version: appPackage.version,
      confirmUpdate: false,
      eventMsg: "wait",
      textMsg: "wait"
    };
  },
  computed: {
    upToDate() {
      return this.eventMsg === "notAvailable" || this.eventMsg === "dev";
    },
    outdated() {
      return this.eventMsg === "available" || this.eventMsg === "downloaded";
    },
    downloading() {
      return this.eventMsg === "downloading" || this.eventMsg === "checking";
    },
    currentPath() {
      let paths = this.$route.path.split("/");
      paths.shift();
      return paths;
    },
    tooltipMessage() {
      if (this.upToDate) {
        return "No hay actualizaciones";
      } else if (this.outdated) {
        return "Nueva actualizacion";
      } else if (this.downloading) {
        return "Bajando Actualizacion";
      } else {
        return "";
      }
    }
  },
  created() {
    ipcRenderer.send("ready-to-messages", {});

    ipcRenderer.on("message", (event, message) => {
      console.log(message);
      this.eventMsg = message.event;
      this.textMsg = message.message;
    });

    ipcRenderer.on("open-page", (event, page) => {
      this.$router.push({ name: page });
    });
  },
  methods: {
    confirmUpdateModal() {
      if (this.upToDate || this.downloading) {
        return false;
      }
      this.confirmUpdate = true;
    },
    sendMessageUpdate() {
      ipcRenderer.send("install-updates", {});
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Ubuntu");
html,
body {
  background: #e4e7ed;
  font-family: "Ubuntu", sans-serif;
  padding: 0px !important;
  margin: 0px !important;
  height: 100% !important;
  min-height: 100% !important;
}

#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100% !important;
  min-height: 100% !important;
  overflow-x: hidden;
  overflow-y: auto;
}

a {
  cursor: pointer;
  color: #409eff;
  text-decoration: none;
}
a:focus {
  outline: none;
}

.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
footer {
  position: absolute;
  bottom: 0px;
  left: 70px;
  right: 0px;
  height: 2.3em;
  line-height: 2.3em;
  background: #333;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  z-index: 11;
}

footer .path .el-breadcrumb {
  float: left;
  line-height: 2em;
  margin: 0px 5px 0px 10px;
  font-size: 12px;
}
footer .path .el-breadcrumb a,
footer .path .el-breadcrumb .el-breadcrumb__inner.is-link {
  color: #f1f1f1 !important;
}

footer .version {
  float: right;
  margin-right: 20px;
}
footer .sep {
  margin: 0px 10px;
}
footer .status .message-icon {
  margin-right: 5px;
}
footer .status .message-icon.success {
  color: #67c23a !important;
}
footer .status .message-icon.danger {
  color: #f56c6c !important;
}
footer .status .message-icon.info {
  color: #909399 !important;
}
</style>
