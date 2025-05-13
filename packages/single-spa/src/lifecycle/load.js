import { status } from "../shared"
import { composeFunc } from "../utils/flattenArrayToAsync"

// settle appsToLoad
/**
 * load app lifecycle
 * @param {{
 *  name: String, 
 *  loadApp: Function, 
 *  activeWhen: Function, 
 *  customProps: any, 
 *  status: String
 * }} app 
 */
export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== status["NOT_LOADED"]) return app

    app.status = status["LOADING_SOURCE_CODE"]
    return app.loadApp(app.customProps).then(current_app => {
      const {
        bootstrap,
        mount,
        unmount
      } = current_app

      app.status = status["NOT_BOOTSTRAPPED"]
      // save to app
      app.bootstrap = composeFunc(bootstrap)
      app.mount = composeFunc(mount)
      app.unmount = composeFunc(unmount)
      return app
    })
  })
}