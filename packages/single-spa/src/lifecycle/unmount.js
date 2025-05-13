// settle appsToUnmount lifeCycle
import { status } from "../shared"

/**
 * unmount app lifecycle
 * @param {{
 *  name: String, 
 *  loadApp: Function, 
 *  activeWhen: Function, 
 *  cusromProps: any, 
 *  status: String,
 *  bootstrap: Array|Function
 *  mount: Array|Function
 *  unmount: Array|Function
 * }} app 
 */
export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== status["MOUNTED"]) {
      return app
    }
    app.status = status["UNMOUNTING"]
    return app.unmount(app.cusromProps).then(() => {
      app.status = status["NOT_MOUNTED"]
    })
  })
}