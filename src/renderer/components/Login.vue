<template>
  <div class="login">
    <div class="content">
      <div class="logo">
        <img id="logo" src="~@/assets/bar3-1.png" alt="Barmanager V3">
      </div>
      <el-card>
        <el-form :model="credentials" :disabled="!enableLogin">
          <el-form-item>
            <el-input type="text" v-model="credentials.email" placeholder="Email o nombre de usuario"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="credentials.password" placeholder="Contraseña"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button style="width: 100%; background: #C70039;color: #fff;" @click="doLogin()">Login</el-button>
          </el-form-item>
        </el-form>
        <div class="component">
          {{ connectionMessage }}
          <span :class="{'danger': !connectionOk, 'success': connectionOk}">
            <i :class="{'el-icon-loading': !connectionOk, 'el-icon-success': connectionOk }"></i></span>
          </span>
        </div>
      </el-card>
      <system-information></system-information>
    </div>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  import SystemInformation from './Admin/SystemInformation'
  const { mapGetters: authGetters, mapActions: authActions } = namespace('auth')

  export default {
    name: 'login',
    components: { SystemInformation },
    data () {
      return {
        connectionOk: false,
        connectionMessage: 'Conectando al servidor',
        enableLogin: false,
        credentials: {
          email: '',
          password: ''
        }
      }
    },
    computed: {
      ...authGetters(['currentUser'])
    },
    created () {
      this.checkConnection()
    },
    methods: {
      ...authActions(['login']),
      checkConnection () {
        this.$http.get('http://localhost:3000/ping').then(response => {
          this.connectionOk = true
          this.connectionMessage = 'Conectado al servidor'
          this.enableLogin = true
        }).catch(error => {
          console.log(error)
        })
      },
      doLogin () {
        this.login(this.credentials).then(response => {
          this.$router.push({ name: 'Tables' })
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
  .login {
    background: #909399;
    height: 100vh;
    margin: 0px;
  }
  .login .content { height: 100vh; padding: 0px 50px; background: #fff; width: 30%; margin: auto; }
  .login .logo { width: 60%; margin: auto; padding-top: 50px; }
  .login img { width: 100%; }
  .login .component {
    font-size: 13px;
    margin-top: 20px;
  }
  .login .success { color: #67C23A; }
  .login .danger { color: #909399; }
</style>
