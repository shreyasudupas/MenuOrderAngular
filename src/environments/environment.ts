// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth:{
    clientRoot :"http://localhost:4200",
    clientId : "menuAngularUI",
    redirectUri: window.location.origin,
    idpAuthority : "https://localhost:5006",
    scope :"openid profile IdentityServerApi basketApi inventoryApi"

  },
  idsConfig:{
    imageServerPath:'https://localhost:5005/images/'
  }
  ,
  baseV1Url:"http://localhost:5000/api/v1/",
  baseV2Url:"http://localhost:5000/api/v2/",
  userAPI:"https://localhost:5000/api/gateway/user/",
  //menuAPI:"https://localhost:5000/api/gateway/inventory/menu/",
  //vendorAPI:"https://localhost:5000/api/gateway/inventory/vendor/",
  vendorAPI:"https://localhost:5003/api/vendor",
  basketAPI:"https://localhost:5000/api/gateway/basketservice/",
  orderAPI:"https://localhost:5000/api/gateway/orders/",
  cartInfoAPI:"https://localhost:5000/api/gateway/cart-information/",
  vendorConfigAPI:"https://localhost:5000/api/gateway/cart-configuration/",
  IDSUserAPI:"https://localhost:5005/api/v1/User",
  IDSUtility:"https://localhost:5005/api/Utility",
  BasketAPI:"https://localhost:5000/api/basket"

};
