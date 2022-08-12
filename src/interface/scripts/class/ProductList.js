import {ProductTile} from "./ProductTile";

export class ProductList {
  constructor() {


    this.initProductList();
  }

  initProductList() {
    const instance = this;

    const productTiles = document.querySelectorAll(".product-tile");

    for (let i = 0; i < productTiles.length; ++i) {
      new ProductTile(productTiles[i]);
    }

  }
}
