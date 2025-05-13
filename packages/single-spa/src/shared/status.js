import { apps } from "../utils/app"

// define application's lifecycle status
export const status = {
  NOT_LOADED: "NOT_LOADED",
  LOADING_SOURCE_CODE: "LOADING_SOURCE_CODE",
  LOAD_ERROR: "LOAD_ERROR",

  NOT_BOOTSTRAPPED: "NOT_BOOTSTRAPPED",
  BOOTSTRAPPING: "BOOTSTRAPPING",
  NOT_MOUNTED: "NOT_MOUNTED",

  MOUNTING: "MOUNTING",
  MOUNTED: "MOUNTED",

  UNMOUNTING: "UNMOUNTING"
}

/**
 * Check if the application is active
 * @param {{
 *  name: String, 
 *  loadApp: Function, 
 *  activeWhen: Function, 
 *  cusromProps: any, 
 *  status: String
 * }} app 
 */
export function isActive(app) {
  return app.status === status["MOUNTED"]
} 

/**
 * Check the application should be active 
 * @param {{
 *  name: String, 
 *  loadApp: Function, 
 *  activeWhen: Function, 
 *  cusromProps: any, 
 *  status: String
 * }} app 
 */
export function shouldBeActive(app) {
  return app.activeWhen(window.location)
}

/**
 * get all app status to ensure rerote method can category
 */
export function getAppChanges() {
  const appsToLoad = []  // app will load
  const appsToMount = []  // app will mount
  const appsToUnmount = []  // app will unmount

  // degin category
  apps.forEach(app => {
    let appShouldBeActive = shouldBeActive(app)
    switch(app.status) {
      case status["NOT_LOADED"]:
      case status["LOADING_SOURCE_CODE"]:
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break
      case status["NOT_BOOTSTRAPPED"]:
      case status["BOOTSTRAPPING"]:
      case status["NOT_MOUNTED"]:
        if (appShouldBeActive) {
          appsToMount.push(app)
        }     
        break
      case status["MOUNTED"]:
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
        break
      default:
        break  
    }
  })

  return {
    appsToLoad,
    appsToMount,
    appsToUnmount
  }
}