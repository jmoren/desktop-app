<template>
  <el-dialog :fullscreen="true" :close-on-press-escape="true" 
    :visible.sync="itemFormOpen" title="Agregar Item" style="z-index: 1000">
    <div>
      <el-row :gutter="10">
        <el-col :span="8" style="position: relative">
          <h1 class="text-center">
            Categorias
            <span class="column-status" v-if="newEntry.category.id">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input v-model="categoryCriteria" placeholder="Filtrar Categoria" clearable/>
          </div>
          <div class="filter-bar">
            <el-button type="warning" v-for="(catName, index) in uniqCategories" :key="index" 
                @click="scopeCategories(catName)" >
              {{ catName | capitalize }}
            </el-button>
            <el-button type="primary" style="float: right" @click="scopeCategories('')" >
              Todas
            </el-button>
          </div>
          <div class="list">
            <ul>
              <li v-for="(category, index) in scopedCategories" :key="index" @click="setCategory(category)">
                <span style="float: left"><b>{{ category.name }}</b></span>
                <span style="float: right">{{ category.zone }}</span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8" style="position: relative">
          <h1 class="text-center">
            Promocion
            <span class="column-status" v-if="newEntry.product.id">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input v-model="productCriteria" placeholder="Filtrar Promos" clearable/>
          </div>
          <div class="list">
            <ul v-if="filteredProducts.length > 0">
              <li v-for="(product, index) in filteredProducts" :key="index" @click="setProduct(product)">
                {{ product.name }}
              </li>
            </ul>
            <div v-else>
              <el-alert type="info" title="No hay promociones en esta categoria o con ese nombre"/>
            </div>  
          </div>
        </el-col>
        <el-col :span="8">
          <h1 class="text-center">Confirmar {{ newEntry.quantity }}</h1>
          <div style="font-size: 20px; margin-bottom: 10px" class="el-input__inner">
            {{ newEntry.product.name | capitalize }}
            <span style="color: #999; float: right; font-size: 17px">{{ newEntry.category.name | capitalize }}</span>
          </div>
          <div v-if="newEntry.product.id">
            <div style="margin-bottom: 10px">
              <el-button-group style="width: 100%;">
                <el-button type="primary" @click="increaseQty()" style="width: 50%;">
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                </el-button>
                <el-button type="default" @click="decreaseQty()" :disabled="newEntry.quantity === 1" style="width: 50%;">
                  <font-awesome-icon icon="minus"></font-awesome-icon>
                </el-button>
              </el-button-group>
            </div>
            <div style="margin-bottom: 10px">
              <el-input type="textarea" :rows="4" placeholder="Comentarios" v-model="newEntry.comment"/>
            </div>
            <div style="margin-bottom: 10px">
              <el-button type="success" @click="addEntry()">
                <font-awesome-icon icon="check"></font-awesome-icon>
              </el-button>
              <el-button type="default" @click="reset()">
                <font-awesome-icon icon="trash"></font-awesome-icon>
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import _ from 'lodash'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: categoryGetters } = namespace('categories')
  const { mapGetters: productGetters } = namespace('products')

  export default {
    name: 'modal-ticket-promo-form',
    components: {
      FontAwesomeIcon
    },
    data () {
      return {
        itemFormOpen: false,
        categoryCriteria: '',
        productCriteria: '',
        scopedProducts: [],
        currentScope: '',
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
      ...productGetters(['promotionList']),
      uniqCategories () {
        let catNames = _.map(this.categoryList, (cat) => {
          return cat.zone
        })
        return _.uniq(catNames)
      },
      scopedCategories () {
        if (this.currentScope) {
          return this.categoryList.filter((category) => {
            return category.zone === this.currentScope
          })
        } else {
          return this.categoryList
        }
      },
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
          return this.scopedCategories.filter((cat) => {
            return cat.name.toLowerCase().match(this.categoryCriteria.toLowerCase())
          })
        } else {
          return this.scopedCategories
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
      addEntry () {
        console.log('Add entry')
      },
      reset () {
        this.newEntry = {
          category: {},
          product: {},
          quantity: 1,
          comment: ''
        }
      },
      setProduct (product) {
        this.newEntry.product = product
      },
      scopeCategories (scope) {
        this.currentScope = scope
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
      },
      increaseQty () {
        this.newEntry.quantity = this.newEntry.quantity + 1
      },
      decreaseQty () {
        this.newEntry.quantity = this.newEntry.quantity - 1
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
  .filter-bar {
    margin: 10px 0px;
    font-size: 13px;
  }
  .column-status {
    position: absolute;
    right: 0;
    top: 10px;
    color: #67C23A;
  }
</style>