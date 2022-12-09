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
  inventoryBaseUrl:"https://localhost:5003/api/vendors",
};
