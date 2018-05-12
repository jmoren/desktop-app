<template>
  <div class="page-content">
    <slot name="content">Aca va el content</slot>
  </div>
</template>
<script>
export default {
  name: "PageContent"
};
</script>

<style>
.page-content {
  padding: 4.5em 0em 2em 0em;
  margin: 0px;
  min-height: 100%;
}
</style>
