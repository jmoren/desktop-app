<template>
  <div class="slot-content"><slot name="content">Aca va el content</slot></div>
</template>
<script>
  export default {
    name: 'page-content'
  }
</script>

<style>
  .slot-content {
    padding: 4.5em 0em 2em 0em;
    margin: 0px;
    height: 100%;
  }
</style>
