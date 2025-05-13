import { getAppChanges } from "./status"
import { toLoadPromise } from "../lifecycle/load"
import { toUnmountPromise } from "../lifecycle/unmount"
import { start_app_is_execed } from "../utils/start"

/**
 * realise let app to load
 * @param {*} appsToLoad 
 * @returns 
 */
export function LoadApps(appsToLoad) {
  const loadAppPromises 
    = Promise.all(appsToLoad.map(app => toLoadPromise(app)))  // settle loadApp func
  return loadAppPromises
  // test code 
  // register apps have three property
  // 1.bootstrap
  // 2.mount
  // 3.unmount
  // Promise.all(appsToLoad.map(app => toLoadPromise(app))).then(() => {
  //   console.log([...appsToLoad]) 
  // })  
}

/**
 * realise unmount unneed apps, start and mount need apps
 */
export function performAppChange(appsToMount, appsToUnmount) {
  const unMountAppPromises 
    = Promise.all(appsToUnmount.map(app => toUnmountPromise(app)))

  
}

/**
 * when register a new application, then methods must be exec
 */
export function reroute() {
  const { 
    appsToLoad, 
    appsToMount, 
    appsToUnmount 
  } = getAppChanges()
  // console.log(appsToLoad, appsToMount, appsToUnmount);

  return start_app_is_execed 
    ? performAppChange(appsToMount, appsToUnmount)
    : LoadApps(appsToLoad)
}