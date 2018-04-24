<template>
  <div>
    <div class="main-nav-bar">
      <div class="clearfix">
        <div class="go-back">
          <a @click="goBack()">
            <font-awesome-icon icon="arrow-left"/>    
          </a>
        </div>
        <div class="title">
          <slot name="title">Aca va el title</slot></div>
        <div class="controls"><slot name="controls">Aca van los botones</slot></div>
      </div>
    </div>
  </div>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  
  export default {
    name: 'page-header',
    components: { FontAwesomeIcon },
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style>
  .main-nav-bar {
    background: #f1f1f1;
    padding: 10px;
    position: fixed;
    width: 99%;
    z-index: 10000;
    margin: 0px;
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #d4d4d4;
  }
  .main-nav-bar .go-back {
    float: left;
    margin-right: 10px;
    font-size: 25px;
  }

  .main-nav-bar .clearfix {
    clear: both;
  }
  .main-nav-bar .title {
    color: #333;
    font-weight: bold;
    font-size: 25px;
    float: left;
  }

  .main-nav-bar .controls {
    float: right;
    margin-right: 5px;
  }
</style>
