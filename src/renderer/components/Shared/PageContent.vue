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
  .content {
    padding: 71px 0px 35px 0px;
    margin: 0px;
  }
</style>
