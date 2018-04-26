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
    padding: 70px 0px 45px 0px;
    margin: 0px;
  }
</style>
