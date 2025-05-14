import { getAppChanges, shouldBeActive } from "./status"
import { toLoadPromise } from "../lifecycle/load"
import { toUnmountPromise } from "../lifecycle/unmount"
import { toBootstrapPromise } from "../lifecycle/bootstrap"
import { toMountPromise } from "../lifecycle/mount"
import { start_app_is_execed } from "../utils/start"
import { callCaptureEventListeners } from "./intercept"
import type { RegisterationType } from "@/types/registerApplicationType"

/**
 * realise let app to load
 * @param {*} appsToLoad 
 * @returns 
 */
export function LoadApps(appsToLoad: RegisterationType[]) {
  const loadAppPromises 
    = Promise.all(appsToLoad.map(app => toLoadPromise(app)))  // settle loadApp func
  return loadAppPromises.then(callEventListener)
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
export function performAppChange(
  appsToLoad: RegisterationType[], 
  appsToMount: Required<RegisterationType>[], 
  appsToUnmount: Required<RegisterationType>[]
) {
  const unMountAppPromises 
    = Promise.all(appsToUnmount.map(app => toUnmountPromise(app)))

  const loadPromises = Promise.all(appsToLoad.map(
    app => toLoadPromise(app).then(app => {
    return tryBootstrapAndMount(app, unMountAppPromises)
  })))  

  const mountPromises = Promise.all(appsToMount.map(
    app => tryBootstrapAndMount(app, unMountAppPromises)))  
  
  return Promise.all([loadPromises, mountPromises]).then((app) => {
    callEventListener()
  })
}

function callEventListener() {
  callCaptureEventListeners(new Event("reroute"))
}

export function tryBootstrapAndMount(
  app: Required<RegisterationType> | RegisterationType, 
  unMountAppPromises: Promise<any>
) {
  if (shouldBeActive(app)) {
    return toBootstrapPromise(app as Required<RegisterationType>)
      .then(app => unMountAppPromises
        .then(() => toMountPromise(app)))
  }
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
    ? performAppChange(appsToLoad, appsToMount, appsToUnmount)
    : LoadApps(appsToLoad)
}