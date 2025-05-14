/**
 * main func is to match the route and load the app --> bootstrap
 * registerApplication is to register the app and save the app state
 */
import { status, reroute } from "@/shared/index";
import type { RegisterationType } from "@/types/registerApplicationType";

// define date protocols
export const apps: Array<RegisterationType|Required<RegisterationType>> = []

/**
 * single-spa registerApplication 
 * @param {String} appName 
 * @param {Function} loadApp 
 * @param {Function} activeWhen 
 * @param {Object|null|undefined} customProps 
 */
function registerApplication(
  appName: string, 
  loadApp: () => Promise<any>, 
  activeWhen: (location: string) => boolean, 
  customProps?: any
): void {
  // save state
  const registeration: RegisterationType = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: status["NOT_LOADED"],
  }
  apps.push(registeration)
  // update app state: notbootstrapped --> bootstrap --> mount --> unmount
  /**
   * state update process:
   * =======================================================================
   * |                              Not_Loaded                             |
   * |                                  |                                  |
   * |          Load_Error <—— Loading_source_code                         | 
   * |                                  |                                  |
   * |    Skip_Because_Broken <—— Not_Bootstrapped                         |
   * |                                  |                                  |
   * |                             Bootstrapping                           |
   * |                                  |                                  |
   * |                             Not_Mounted  <——————                    |
   * |                                  |             |                    |
   * |                    |—————————— Mounted      Unmounting              |
   * |                    |             |             |                    |
   * |                    ——————————  Updating     UnLoading               |
   * =======================================================================
   */

  // rewrite route
  reroute()
}

export default registerApplication;