// settle appsToUnmount lifeCycle
import { status } from "../shared"
import type { RegisterationType } from "@/types/registerApplicationType"

/**
 * unmount app lifecycle
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
export function toUnmountPromise(app: Required<RegisterationType>) {
  return Promise.resolve().then(() => {
    if (app.status !== status["MOUNTED"]) return app
    
    app.status = status["UNMOUNTING"]
    return app.unmount(app.customProps).then(() => {
      app.status = status["NOT_MOUNTED"]
      return app
    })
  })
}