<template>
  <el-dialog
    :fullscreen="true"
    :close-on-press-escape="true"
    :visible.sync="itemFormOpen"
    title="Agregar Item"
    style="z-index: 1000">
    <div>
      <el-row :gutter="20">
        <el-col
          :span="8"
          style="position: relative">
          <h1 class="text-center">
            Categorias
            <span
              v-if="newEntry.category.id"
              class="column-status">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input
              v-model="categoryCriteria"
              placeholder="Filtrar Categoria"
              clearable/>
          </div>
          <div class="filter-bar">
            <el-button
              type="primary"
              size="mini"
              style="padding: .477em"
              @click="scopeCategories('')" >
              Todas
            </el-button>
            <el-button-group>
              <el-button
                v-for="(catName, index) in uniqCategories"
                :key="index"
                type="warning"
                size="mini"
                style="padding: .477em"
                @click="scopeCategories(catName)" >
                {{ catName | capitalize }}
              </el-button>
            </el-button-group>
          </div>
          <div class="list">
            <ul>
              <li
                v-for="(category, index) in filteredCategories"
                :key="index"
                @click="setCategory(category)">
                <span style="float: left"><b>{{ category.name }}</b></span>
                <span style="float: right">{{ category.zone }}</span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col
          :span="8"
          style="position: relative">
          <h1 class="text-center">
            Producto
            <span
              v-if="newEntry.product.id"
              class="column-status">
              <i class="el-icon-check"></i>
            </span>
          </h1>
          <div class="form">
            <el-input
              v-model="productCriteria"
              placeholder="Filtrar Producto"
              clearable/>
          </div>
          <div class="filter-bar">
            <el-button-group>
              <el-button
                v-for="(letter, index) in letters"
                :key="index"
                :class="{ 'letter-active': currentLetter === letter }"
                size="mini"
                style="padding: .45em"
                @click="indexBy(letter)">
                {{ letter | capitalize }}
              </el-button>
            </el-button-group>
          </div>
          <div class="list">
            <ul v-if="filteredProducts.length > 0">
              <li
                v-for="(product, index) in filteredProducts"
                :key="index"
                @click="setProduct(product)">
                {{ product.name }}
              </li>
            </ul>
            <div v-else>
              <el-alert
                type="info"
                title="No hay items en esta categoria o con ese nombre"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <div class="item-form-3">
              <h1 class="text-center">Confirmar {{ newEntry.quantity }}</h1>
              <div
                style="font-size: 20px; margin-bottom: 10px"
                class="el-input__inner">
                {{ newEntry.product.name | capitalize }}
                <span style="color: #999; float: right; font-size: 17px">{{ newEntry.category.name | capitalize }}</span>
              </div>
              <div v-if="newEntry.product.id">
                <div style="margin-bottom: 10px">
                  <el-button-group style="width: 100%;">
                    <el-button
                      type="primary"
                      style="width: 50%;"
                      @click="increaseQty()">
                      <font-awesome-icon icon="plus"/>
                    </el-button>
                    <el-button
                      :disabled="newEntry.quantity === 1"
                      type="default"
                      style="width: 50%;"
                      @click="decreaseQty()">
                      <font-awesome-icon icon="minus"/>
                    </el-button>
                  </el-button-group>
                </div>
                <div style="margin-bottom: 10px">
                  <el-input
                    :rows="4"
                    v-model="newEntry.comment"
                    type="textarea"
                    placeholder="Comentarios"/>
                </div>
                <div style="margin-bottom: 10px">
                  <el-button
                    type="success"
                    @click="createEntry()">
                    <font-awesome-icon icon="check"/>
                  </el-button>
                  <el-button
                    type="default"
                    @click="reset()">
                    <font-awesome-icon icon="trash"/>
                  </el-button>
                </div>
              </div>
            </div>
            <div>
              <el-table
                :data="entries"
                style="width: 100%"
                height="430">
                <el-table-column
                  label="Producto"
                  width="300">
                  <template slot-scope="scope">
                    {{ scope.row.item.name }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="Cant"/>
                <el-table-column
                  prop="updated_time"
                  label="Hora"/>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { createNamespacedHelpers as namespace } from "vuex";
const { mapGetters: categoryGetters } = namespace("categories");
const { mapGetters: productGetters } = namespace("products");
const { mapGetters: ticketGetters } = namespace("tickets");
const { mapGetters: entriesGetters, mapActions: entriesActions } = namespace(
  "entries"
);

export default {
  name: "ModalTicketItemForm",
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      letters: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
      ],
      itemFormOpen: false,
      categoryCriteria: "",
      productCriteria: "",
      scopedProducts: [],
      currentScope: "",
      currentLetter: "",
      newEntry: {
        category: {},
        product: {},
        quantity: 1,
        comment: ""
      }
    };
  },
  computed: {
    ...ticketGetters(["ticket"]),
    ...categoryGetters(["categoryList"]),
    ...productGetters(["itemList"]),
    ...entriesGetters(["entries"]),
    uniqCategories() {
      let catNames = _.map(this.categoryList, cat => {
        return cat.zone;
      });
      return _.uniq(catNames);
    },
    scopedCategories() {
      if (this.currentScope) {
        return this.categoryList.filter(category => {
          return category.zone === this.currentScope;
        });
      } else {
        return this.categoryList;
      }
    },
    productsIndexed() {
      if (this.currentLetter) {
        let regexp = new RegExp(`^${this.currentLetter}.*`);
        return this.scopedProducts.filter(prod => {
          return prod.name.toLowerCase().match(regexp);
        });
      } else {
        return this.scopedProducts;
      }
    },
    filteredProducts() {
      if (this.newEntry.category.id) {
        if (this.productCriteria) {
          return this.productsIndexed.filter(prod => {
            return prod.name
              .toLowerCase()
              .match(this.productCriteria.toLowerCase());
          });
        } else {
          return this.productsIndexed;
        }
      } else {
        return [];
      }
    },
    filteredCategories() {
      if (this.categoryCriteria) {
        return this.scopedCategories.filter(cat => {
          return cat.name
            .toLowerCase()
            .match(this.categoryCriteria.toLowerCase());
        });
      } else {
        return this.scopedCategories;
      }
    }
  },
  methods: {
    ...entriesActions(["addTicketEntry"]),
    open() {
      this.itemFormOpen = true;
    },
    close() {
      this.itemFormOpen = false;
    },
    indexBy(letter) {
      if (this.currentLetter === letter) {
        this.currentLetter = "";
      } else {
        this.currentLetter = letter;
      }
    },
    createEntry() {
      let params = {
        subtotal:
          parseFloat(this.newEntry.product.price) *
          parseInt(this.newEntry.quantity),
        quantity: this.newEntry.quantity,
        comment: this.newEntry.comment,
        ticket_id: this.ticket.id,
        ticketable_id: this.newEntry.product.id,
        ticketable_type: this.newEntry.product.type
      };

      this.addTicketEntry({ ticketId: this.ticket.id, entry: params })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    reset() {
      this.newEntry = {
        category: {},
        product: {},
        quantity: 1,
        comment: ""
      };
    },
    setProduct(product) {
      this.newEntry.product = product;
    },
    scopeCategories(scope) {
      this.currentScope = scope;
    },
    setCategory(category) {
      if (category) {
        this.newEntry.category = category;
        this.scopedProducts = this.itemList.filter(prod => {
          return prod.category_id === this.newEntry.category.id;
        });
      } else {
        this.newEntry.category = {};
        this.scopedProducts = [];
      }
    },
    increaseQty() {
      this.newEntry.quantity = this.newEntry.quantity + 1;
    },
    decreaseQty() {
      this.newEntry.quantity = this.newEntry.quantity - 1;
    }
  }
};
</script>
<style scoped>
.list {
  margin: 10px 0px;
}
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
  padding: 0px;
}
.list ul li:hover {
  background: #f1f1f1;
}
.list ul li {
  cursor: pointer;
}
.filter-bar {
  margin: 10px 0px;
  font-size: 13px;
}
.column-status {
  position: absolute;
  right: 0;
  top: 10px;
  color: #67c23a;
}
.entry-list {
  list-style: none;
  margin: 0px;
  padding: 0px;
}
.entry-list-item {
  border-bottom: dashed 1px #ccc;
  padding: 5px 0px;
  margin-bottom: 5px;
}

.item-form-3 {
  height: 330px;
  border-bottom: dashed 1px rgba(120, 120, 120, 1);
}
.letter-active {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>
