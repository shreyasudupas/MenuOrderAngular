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
    scope :"openid profile inventory.write inventory.read IdentityServerApi"

  },
  idsConfig:{
    imageServerPath:'https://localhost:5005/images/'
  },
  inventory:{
    baseUrl:"https://localhost:5003/api/",
    vendor:"https://localhost:5003/api/vendor",
    vendors:"https://localhost:5003/api/vendors",
    category:"https://localhost:5003/api/category",
    foodtype:"https://localhost:5003/api/foodtype",
    cuisineType:"https://localhost:5003/api/cuisine",
    vendorMenu:"https://localhost:5003/api/vendorMenus"
  },
};
