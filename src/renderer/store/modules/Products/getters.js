const getters = {
  productList: state => state.list,
  promotionList: state => state.list.filter((product) => {
    return product.type.toLowerCase() === 'promotion'
  }),
  itemList: state => state.list.filter((product) => {
    return product.type.toLowerCase() === 'item'
  })
}

export default getters
