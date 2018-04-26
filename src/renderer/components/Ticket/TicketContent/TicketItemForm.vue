<template>
  <div class="ticket-form">
    <el-form @keyup.enter.prevent="addEntry">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-autocomplete 
            v-model="productCode" 
            :fetch-suggestions="filterProductsByCode"
            :trigger-on-focus="false"
            style="width: 100%"
            placeholder="Codigo"
            @select="setProduct">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }">
              <div class="item-name">{{ item.code }}</div>
              <span class="item-description">{{ item.name }}</span>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="9">
          <el-autocomplete
            v-model="productName"
            :fetch-suggestions="filterProductsByName"
            :trigger-on-focus="false"
            style="width: 100%"
            placeholder="Seleccione Producto"
            @select="setProduct">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }">
              <div class="item-name">{{ item.name }}</div>
              <span class="item-description">{{ item.code }} - {{ item.description }}</span>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="2">
          <el-input type="number" placeholder="Cantidad" @change="updateSubTotal" v-model="item.quantity" min="1" step="1"/>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="Nota o comentario" v-model="item.comment" />
        </el-col>
        <el-col :span="3">
          <el-button-group>
            <el-button size="medium" type="primary" icon="el-icon-plus"></el-button>
            <el-button size="medium" type="primary" icon="el-icon-delete"></el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: productsGetters } = namespace('products')
  
  export default {
    name: 'ticket-items-form',
    data () {
      return {
        productCode: null,
        productName: null,
        item: {
          code: '',
          quantity: 1,
          subtotal: 0,
          product: {}
        }
      }
    },
    computed: {
      ...productsGetters(['productList'])
    },
    methods: {
      addEntry () {
        console.log('add entry')
      },
      setProduct (product) {
        this.item.product = product
        this.item.code = product.code
        this.productName = this.item.product.name
        this.productCode = String(this.item.product.code)
      },
      filterProductsByName (query, cb) {
        let result = this.productList.filter((product) => {
          return product.name.toLowerCase().match(this.productName)
        })

        cb(result)
      },
      filterProductsByCode (query, cb) {
        let result = this.productList.filter((product) => {
          let code = String(product.code)
          return code.match(this.productCode)
        })

        cb(result)
      },
      updateSubTotal () {
        let subtotal = Number(this.item.product.price) * Number(this.item.quantity)
        this.item.subtotal = subtotal
      }
    }
  }
</script>

<style>
  .ticket-top .ticket-form .el-autocomplete-suggestion li {
    line-height: 20px;
    padding: 3px 5px;
  }
  .ticket-top .ticket-form .el-autocomplete-suggestion .el-scrollbar {
    width: 200px !important;
  } 
  .item-name { font-weight: bold; }
  .item-description { color: #999; font-size: 12px; }
</style>
