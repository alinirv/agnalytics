const events = {
  viewProduct: "View_Product",
  clickProductList: "Click_Product_List",
  viewProductList: "View_Product_List",
  viewBanner: "View_Banner",
  clickBanner: "Click_Banner",
  addToCart: "Add_Product",
  removeCart: "Remove_Product",
  checkout: "Checkout",
  purchase: "Purchase",
  viewCart: "View_Cart", // Adicionado novo evento
};

const productLists = {
  home: "Home",
  compacto: "Compacto",
  sedan: "Sedan",
  esportivo: "Esportivo",
};

const carModels = {
  p206: {
    product_brand: "Peugeot",
    product_cat: "Compacto",
    product_id: "C01",
    product_name: "Peugeot 206",
    product_price: 18000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  gol: {
    product_brand: "Volkswagen",
    product_cat: "Compacto",
    product_id: "C02",
    product_name: "Gol",
    product_price: 14000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  mx5: {
    product_brand: "Mazda",
    product_cat: "Esportivo",
    product_id: "C03",
    product_name: "MX-5",
    product_price: 25000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  impreza: {
    product_brand: "Subaru",
    product_cat: "Esportivo",
    product_id: "C04",
    product_name: "Impreza",
    product_price: 20000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  fusion: {
    product_brand: "Ford",
    product_cat: "Sedan",
    product_id: "C05",
    product_name: "Fusion",
    product_price: 28000,
    product_quantity: "1",
    product_sku: "Alure",
  },
  charger: {
    product_brand: "Dodge",
    product_cat: "Sedan",
    product_id: "C06",
    product_name: "Charger",
    product_price: 35000,
    product_quantity: "1",
    product_sku: "Alure",
  },
};

const bannersData = {
  home: {
    creative_name: "Banner Esportivos",
    creative_slot: 1,
    promotion_name: "Promo Esportivos",
    promotion_url: "http://localhost:8080/CategoryPages/esportivo.html",
    promotion_href:
      "https://www.hojeemdia.com.br/image/policy:1.787953.1628830062:1628830062/image.jpg?w=1280&",
  },
  esportivo: {
    creative_name: "Banner MX-5",
    creative_slot: 1,
    promotion_name: "Promo MX-5",
    promotion_url: "http://localhost:8080/ProductPages/produto3.html",
    promotion_href:
      "https://s3.us-east-2.amazonaws.com/prod.mm.com/img/articles/Lead1_VHaUGFh.jpeg",
  },
};

sessionStorage.pixelCart = sessionStorage.pixelCart || JSON.stringify([]);
sessionStorage.pixelTransactions = sessionStorage.pixelTransactions || 0;

let cart = JSON.parse(sessionStorage.pixelCart);
let transactions = parseInt(sessionStorage.pixelTransactions);

if (typeof dataLayer === "undefined") {
  window.dataLayer = [];
}

function syncCartWithSessionStorage() {
    sessionStorage.pixelCart = JSON.stringify(cart);
}

function dlEvent({
  event,
  listProperties = {},
  itemsList = [],
  itemProperties = {},
  bannerProperties = {},
} = {}) {
  if (event) {
    let ecommerce = {};

    if (itemsList.length === 0 && Object.keys(itemProperties).length > 0) {
      itemsList.push(itemProperties);
    }

    if (listProperties.listName) {
      ecommerce.list = listProperties.listName;
    }

    if (listProperties.index) {
      ecommerce.index = listProperties.index;
    }
    ecommerce.items = itemsList;

    if (event === events.viewProductList) {
      ecommerce.items = getList(listProperties.listName);
    }

    if (event === events.viewBanner || event == events.clickBanner) {
      ecommerce.promotions = bannerProperties;
      console.log(ecommerce.promotions);
    }

    if (event === events.addToCart) {
      cart.push(itemProperties);
      syncCartWithSessionStorage();
      console.log("------Item adicionado ao carrinho------", cart);
    }

    if (event === events.removeCart) {
      cart = removeItem(cart, itemProperties);
      syncCartWithSessionStorage();
      console.log("------Item removido do carrinho------", cart);
    }

    if (event === events.checkout) {
      ecommerce.total = getTotalValue(cart);
      ecommerce.items = Array.from(cart);
      syncCartWithSessionStorage();
    }

    if (event === events.purchase) {
      ecommerce.total = getTotalValue(cart);
      ecommerce.items = Array.from(cart);
      ecommerce.transaction = registerTransaction();
      syncCartWithSessionStorage();
    }

    if (event === events.viewCart) {
      ecommerce.items = Array.from(cart);
      console.log("------Visualização do carrinho------", cart);
    }

    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: event,
      ecommerce: ecommerce,
    });
  }
}

function removeItem(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].product_id === item.product_id) {
      arr.splice(i, 1);
      return arr;
    }
  }
  console.log("Produto não encontrado");
  return arr;
}

function getTotalValue(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i].product_price;
  }
  return total;
}

function registerTransaction() {
  transactions++;
  cart = [];
  sessionStorage.pixelTransactions = transactions;
  syncCartWithSessionStorage();
  return (
    "T-PDX" +
    transactions.toLocaleString("pt-BR", {
      minimumIntegerDigits: 4,
    })
  );
}

function getList(listName) {
  const aux = [];
  for (const key in carModels) {
    if (carModels[key].product_cat === listName || listName === productLists.home) {
      aux.push(carModels[key]);
    }
  }
  return aux;
}

function loadHomeEvents() {
  dlEvent({ event: events.viewProductList, listProperties: { listName: productLists.home } });
  dlEvent({ event: events.viewBanner, bannerProperties: bannersData.home });
}
