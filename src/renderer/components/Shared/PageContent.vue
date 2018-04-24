<template>
  <div class="content">
    <slot name="content">Aca va el content</slot>
  </div>
</template>
<script>
  export default {
    name: 'page-content'
  }
</script>

<style>
  .main-content-view {
    padding: 0px;
    margin: 0px;
  }
</style>
