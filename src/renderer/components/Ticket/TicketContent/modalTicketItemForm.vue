<template>
  <el-dialog :fullscreen="true" :close-on-press-escape="true" 
              :modal="false" :visible.sync="itemFormOpen" title="Agregar Item" style="z-index: 1000">
    <div>
      <el-row :gutter="10">
        <el-col :span="8">
          <h1>
            Categorias
            <span style="float: right; color: #67C23A;" v-if="newEntry.category.id">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input v-model="categoryCriteria" placeholder="Filtrar Categoria" clearable/>
          </div>
          <div class="list">
            <ul>
              <li v-for="(category, index) in filteredCategories" :key="index" @click="setCategory(category)">
                <span style="float: left"><b>{{ category.name }}</b></span>
                <span style="float: right">{{ category.zone }}</span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <h1>
            Producto
            <span style="float: right; color: #67C23A;" v-if="newEntry.product.id">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input v-model="productCriteria" placeholder="Filtrar Producto" clearable/>
          </div>
          <div class="list">
            <ul>
              <li v-for="(product, index) in filteredProducts" :key="index" @click="setProduct(product)">
                {{ product.name }}
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8">
          <h1>Confirmar</h1>
          
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: categoryGetters } = namespace('categories')
  const { mapGetters: productGetters } = namespace('products')

  export default {
    name: 'modal-ticket-item-form',
    data () {
      return {
        itemFormOpen: false,
        categoryCriteria: '',
        productCriteria: '',
        scopedProducts: [],
        newEntry: {
          category: {},
          product: {},
          quantity: 1,
          comment: ''
        }
      }
    },
    computed: {
      ...categoryGetters(['categoryList']),
      ...productGetters(['productList']),
      filteredProducts () {
        if (this.newEntry.category.id) {
          if (this.productCriteria) {
            return this.scopedProducts.filter((prod) => {
              return prod.name.toLowerCase().match(this.productCriteria.toLowerCase())
            })
          } else {
            return this.scopedProducts
          }
        } else {
          return []
        }
      },
      filteredCategories () {
        if (this.categoryCriteria) {
          return this.categoryList.filter((cat) => {
            return cat.name.toLowerCase().match(this.categoryCriteria.toLowerCase())
          })
        } else {
          return this.categoryList
        }
      }
    },
    methods: {
      open () {
        this.itemFormOpen = true
      },
      close () {
        this.itemFormOpen = false
      },
      setProduct (product) {
        this.newEntry.product = product
      },
      setCategory (category) {
        if (category) {
          this.newEntry.category = category
          this.scopedProducts = this.productList.filter((prod) => {
            return prod.category_id === this.newEntry.category.id
          })
        } else {
          this.newEntry.category = {}
          this.scopedProducts = []
        }
      }
    }
  }
</script>
<style scoped>
  .list { margin: 10px; }
  .list ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  .list ul li {
    line-height: 45px;
    height: 45px;
    background: #fff;
    border-bottom: solid 1px #f1f1f1;
    padding: 0px 5px;
  }
  .list ul li:hover { background: #f1f1f1; }
  .list ul li { cursor: pointer; }
</style>