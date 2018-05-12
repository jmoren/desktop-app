<template>
  <div class="system-info">
    <div class="title">Informacion del Sistema</div>
    <el-row 
      :gutter="20" 
      class="item">
      <el-col 
        :span="8" 
        class="name">VueJS:</el-col>
      <el-col 
        :span="16" 
        class="value">{{ vue }}</el-col>
    </el-row>
    <el-row 
      :gutter="20" 
      class="item">
      <el-col 
        :span="8" 
        class="name">Electron:</el-col>
      <el-col 
        :span="16" 
        class="value">{{ electron }}</el-col>
    </el-row>
    <el-row 
      :gutter="20" 
      class="item">
      <el-col 
        :span="8" 
        class="name">NodeJS:</el-col>
      <el-col 
        :span="16" 
        class="value">{{ node }}</el-col>
    </el-row>
    <el-row 
      :gutter="20" 
      class="item">
      <el-col 
        :span="8" 
        class="name">Plataforma:</el-col>
      <el-col 
        :span="16" 
        class="value">{{ platform }}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      electron: process.versions["atom-shell"],
      node: process.versions.node,
      platform: require("os").platform(),
      vue: require("vue/package.json").version
    };
  }
};
</script>

<style scoped>
.system-info {
  margin-top: 50px;
}
.title {
  color: #888;
  font-size: 13px;
  margin-bottom: 20px;
}

.items {
  margin-top: 8px;
}

.item {
  margin-bottom: 5px;
  border-bottom: solid 1px #f1f1f1;
  line-height: 40px;
  height: 40px;
  font-size: 13px;
}

.item .name {
  color: #6a6a6a;
  font-weight: bold;
}

.item .value {
  color: #4b4c5b;
  font-weight: bold;
  text-align: right;
}
</style>
