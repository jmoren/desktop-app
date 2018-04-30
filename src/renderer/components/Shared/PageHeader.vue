<template>
  <div class="main-nav-bar">
    <a @click="goBack()" class="go-back">
      <font-awesome-icon icon="arrow-left"/>    
    </a>
    <div class="title">
      <slot name="title">Aca va el title</slot>
    </div>
    <div class="sub-items">
      <slot name="sub-items"></slot>
    </div>
    <div class="controls">
      <slot name="controls">Aca van los botones</slot>
    </div>
    <a class="menu-help"><font-awesome-icon icon="ellipsis-v"/></a>
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
    padding: 0px 10px;
    position: fixed;
    width: 99%;
    margin: 0px;
    height: 4.45em;
    line-height: 4.45em;
    border-bottom: solid 1px #d4d4d4;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    justify-content: space-between;
    align-items: stretch;
  }
  .main-nav-bar  .go-back {
    float: left;
    height: 4.5em;
    margin-right: 10px;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
  }

  .main-nav-bar .title {
    color: #333;
    font-weight: bold;
    font-size: 30px;
    flex-grow: 1;
  }

  .main-nav-bar .controls {
    text-align: right;
    flex-grow: 1;
  }
  .main-nav-bar .menu-help {
    float: right;
    margin-left: 30px;
    margin-right: 20px;
    font-size: 30px;
  }

  .main-nav-bar .sub-items {
    flex-grow: 2;
  }
</style>
