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
export function toMountPromise(app: Required<RegisterationType>) {
  if (app.status !== status["NOT_MOUNTED"]) return app
  app.status = status["MOUNTING"]
  return app.bootstrap(app.customProps).then(() => {
    app.status = status["MOUNTED"]
    return app
  })
}