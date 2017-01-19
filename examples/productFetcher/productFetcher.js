import Process from 'redux-saga-process'

import { call } from 'redux-saga/effects'

/*
  ProductFetcherProcess
    This is a fairly straight forward example of how you might build a 
    process which is used to handle fetching product data from a server,
    processing the results, optionally modify / normalize it, and dispatch 
    the results to our UI (which would be connected to the products key within 
    our store).
    
    We can store any data which does not pertain to our UI internally and only 
    dispatch a pure representation to the UI once it is ready.
*/

export default class ProductFetcherProcess extends Process {

  // this.history will contain data to throttle requests
  history = {};
  
  // Set a throttleTimeout property for throttling fetch requests.
  throttleTimeout = 30000
  
  // Reduce the 'products' key within our store.
  static config = { reduces: 'products' };
  
  // Reduce the product details state when product data is received
  static reducer = {
    productDetails: (state, action) => ({
      ...state,
      [action.productSKU]: action.data
    }),
    removeProducts: (state, action) => ({})
  };
  
  // call * getProduct method whenever GET_PRODUCT is dispatched.
  static actionRoutes = {
    getProduct: 'getProduct'
  };
  
  // yield* this.dispatch('removeProducts') dispatches
  //  { type: 'REMOVE_PRODUCTS' }
  // yield* this.dispatch('productDetails', productSKU, product) dispatches
  //  { type: 'PRODUCT_DETAILS', productSKU: productSKU, data: product }
  static actions = {
    removeProducts: null,
    productDetails: [ 'productSKU', 'data' ],
  };
  
  // Get the product asynchronously within our method (called within a fork by
  // the Process) and dispatch the product details when completed
  * getProduct({ type, productSKU, force, ...action }) {
    const now = Date.now()
    if ( 
       ! force && this.history[productSKU] 
      && now - this.history[productSKU] < this.throttleTimeout 
    ) {
      /* Only attempt fetch at most once every 30 seconds unless force = true */
      return
    }
    this.history[productSKU] = now
    const product = yield call(fetch(/*...fetch args...*/))
    if ( product && product.productSKU === productSKU ) {
      yield* this.dispatch('productDetails', productSKU, product)
    }
  }

}
