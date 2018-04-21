<template>
  <div id="app">
    <router-view></router-view>
    <footer>
      <div class="clearfix">
        <span class="authors">By {{ authors }} </span>
        <span class="version">{{ name }} {{ version }} - &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
  const appPackage = require('../../package.json')
  export default {
    name: 'barmanager',
    data () {
      return {
        authors: appPackage.author,
        name: appPackage.name,
        version: appPackage.version
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Ubuntu');
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  
  #app {
    font-family: 'Ubuntu', sans-serif;
    max-height: 100vh;
    min-height:  100vh;
    margin: 0px;
    padding: 0px;
  }

  .clearfix {
    clear: both;
  }

  footer {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 5px 10px;
    height: 30px;
    line-height: 30px;
    background: #666;
    color: #fff;
    width: 99%;
    font-size: 13px;
  }
  .authors { float: left; }
  .version { float: right; }
</style>
