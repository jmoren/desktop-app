<template lang="html">
  <div class="">
    Page Not Found
    <p>
      <router-link 
        :to="{ name: 'Login' }" 
        class="el-button">Go Login page</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style lang="css">
</style>
