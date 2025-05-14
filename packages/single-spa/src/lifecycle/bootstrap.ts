import { status } from "../shared";
import type { RegisterationType } from "@/types/registerApplicationType"

/**
 * bootstrap app lifecycle
 * @param {{
 *  name: String, 
 *  loadApp: Function, 
 *  activeWhen: Function, 
 *  customProps: any, 
 *  status: String,
 *  bootstrap: Array|Function
 *  mount: Array|Function
 *  unmount: Array|Function
 * }} app 
 */
export function toBootstrapPromise(app: Required<RegisterationType>) {
  return Promise.resolve().then(() => {
    if (app.status !== status["NOT_BOOTSTRAPPED"]) return app
    app.status = status["BOOTSTRAPPING"]
    return app.bootstrap(app.customProps).then(() => {
      app.status = status["NOT_MOUNTED"]
      return app
    })
  })
}