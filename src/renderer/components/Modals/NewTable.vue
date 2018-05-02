<template>
  <el-dialog title="Nueva mesa" :close-on-click-modal="false" :before-close="closeModal" :visible="modalOpen">
    <el-form ref="form" :model="newTable" label-width="120px">
      <el-form-item label="Descripcion">
        <el-input v-model="newTable.description" placeholder="Nombre de la mesa"/>
      </el-form-item>
      <el-form-item label="Color">
        <el-select v-model="newTable.color" placeholder="selcciona color">
          <el-option v-for="(color, index) in colors" :key="index" :value="color.value" :label="color.title"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTable()">Guardar</el-button>
        <el-button type="default" @click="closeModal()">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapActions: tablesActions } = namespace('tables')

  export default {
    name: 'modal-new-table',
    data () {
      return {
        modalOpen: false,
        colors: [
          { value: 'is-success', title: 'Verde' },
          { value: 'is-danger', title: 'Rojo' },
          { value: 'is-warning', title: 'Amarillo' }
        ],
        newTable: {
          description: '',
          color: ''
        }
      }
    },
    created () {
      console.log('created new table')
      this.openModal()
    },
    methods: {
      ...tablesActions(['saveTable']),
      addTable () {
        this.saveTable(this.newTable).then(response => {
          console.log(response)
          this.closeModal()
        }).catch(error => {
          console.log(error)
        })
      },
      openModal () {
        this.modalOpen = true
      },
      closeModal () {
        this.modalOpen = false
        this.$emit('done')
      }
    }
  }
</script>