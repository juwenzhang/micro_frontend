/**
 * startApp is a function that starts the application.
 * main work is to exec the mount and unmount hooks.
 */

import { reroute } from "../shared";

export let start_app_is_execed = false 

function startApp() {
  start_app_is_execed = true
  reroute()
}

export default startApp;