// define route intercept
// first: exec reroute
// second: load calculate
// hashchange popstate realise intercept
// effect file, so we do not need to expose code to other file use

import { reroute } from "./reroute"

// hash router settle methods
function hashChangeHandler() {
  reroute(arguments)
}

window.addEventListener("hashchange", hashChangeHandler)
window.addEventListener("popstate", hashChangeHandler)

const captureEventListeners = {
  hashchange: [],
  popstate: []
}
const needListenerEvents = ["hashchange", "popstate"]
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function(eventName, callback) {
  if(needListenerEvents.includes(eventName) 
    && !captureEventListeners[eventName].some(
      listener => listener === callback)) {
    captureEventListeners[eventName].push(callback)
  }
  return originalAddEventListener.apply(this, arguments)
}

window.removeEventListener = function(eventName, callback) {
  if(needListenerEvents.includes(eventName) ) {
    captureEventListeners[eventName] = captureEventListeners[eventName]
      .filter(cb => cb !== callback) 
  }
  return originalRemoveEventListener.apply(this, arguments)
}


// history settle 
window.history.pushState = patchPolify(window.history.pushState, "pushState")
window.history.replaceState = patchPolify(window.history.replaceState, "replaceState")
function patchPolify() {
  return function() {
    const urlPre = window.location.href
    const pre = updateState.apply(this, arguments)
    const urlAfter = window.location.href
    if (urlPre !== urlAfter) {
      window.dispatchEvent(new PopStateEvent("popstate"))
    }
    return pre
  }
}


export function callCaptureEventListeners(_event) {
  if (_event) {
    const eventType = _event[0]["type"]
    if (needListenerEvents.includes(eventType)) {
      captureEventListeners[eventType].forEach(listener => {
        listener.apply(this, arguments)
      })
    }
  }
}
