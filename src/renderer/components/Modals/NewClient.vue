<template>
  <el-dialog title="Nuevo Cliente" :close-on-click-modal="false" :before-close="closeModal" :visible="modalOpen">
    <el-form ref="form" :model="newTable" label-width="180px">
      <el-form-item label="Nombre Completo">
        <el-input v-model="newClient.name" placeholder="Nombre completo"/>
      </el-form-item>
      <el-form-item label="Direccion">
        <el-input v-model="newClient.address" placeholder="Direccion"/>
      </el-form-item>
      <el-form-item label="Direccion (Referencia)">
        <el-input v-model="newClient.address_complement" placeholder="Referencia para ubicar"/>
      </el-form-item>
      <el-form-item label="Telefono">
        <el-input v-model="newClient.phone" placeholder="Telefono"/>
      </el-form-item>
      <el-form-item label="DNI">
        <el-input v-model="newClient.dni" placeholder="DNI"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addClient()">Guardar</el-button>
        <el-button type="default" @click="closeModal()">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapActions: clientsActions } = namespace('clients')

  export default {
    name: 'modal-new-client',
    data () {
      return {
        modalOpen: false,
        newClient: {
          name: '',
          phone: '',
          address: '',
          address_complement: '',
          dni: ''
        }
      }
    },
    created () {
      console.log('created new table')
      this.openModal()
    },
    methods: {
      ...clientsActions(['saveClient']),
      addClient () {
        this.saveClient(this.newClient).then(response => {
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