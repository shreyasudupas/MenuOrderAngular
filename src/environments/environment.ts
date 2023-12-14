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
    scope :"openid profile inventory.write inventory.read notification.read notification.write order.read order.write IdentityServerApi"

  },
  idsConfig:{
    imageServerPath:'https://localhost:5006/images/',
    vendormail:"https://localhost:5006/api/mail/",
    vendorUserMapping:'https://localhost:5006/api/vendor-user-mapping',
    utility:'https://localhost:5006/api/utility',
    imageUrl:'https://localhost:5006/ids-images/',
    vendor:'https://localhost:5006/api/vendor/',
    location:{
      forward:'https://localhost:5006/api/location/forward?locationQuery={query}',
      reverse:"https://localhost:5006/api/location/reverse?latitude={latitude}&longitude={longitude}"
    }
  },
  inventory:{
    baseUrl:"https://localhost:5003/api/",
    vendor:"https://localhost:5003/api/vendor",
    vendors:"https://localhost:5003/api/vendors",
    category:"https://localhost:5003/api/category",
    foodtype:"https://localhost:5003/api/foodtype",
    cuisineType:"https://localhost:5003/api/cuisine",
    vendorMenu:"https://localhost:5003/api/vendorMenus",
    imageMenu: "https://localhost:5003/api/menuimage"
  },
  orderService: {
    cartInformation: 'https://localhost:5005/api/cartInformation'
  },
  sagaService:{
    payment: 'https://localhost:5007/api/payment'
  },
  notification: 'https://localhost:5004/api/notification',
  imagePath:'https://localhost:5003/app-images/',
  location:{
    // forwardGeoCoding: 'https://geocode.maps.co/search?q={query}',
    // reverseGeoCoding: 'https://geocode.maps.co/reverse?lat={latitude}&lon={longitude}',
    clientsIpAddress:'https://jsonip.com',
    geolocationByIpAddress: 'http://ip-api.com/json/{ipAddress}'
  },
  EncryptKey:'1203199320052021',
  EncryptIV: '1203199320052021'
};
