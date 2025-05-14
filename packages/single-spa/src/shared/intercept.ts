// define route intercept
// first: exec reroute
// second: load calculate
// hashchange popstate realise intercept
// effect file, so we do not need to expose code to other file use

import { reroute } from "./reroute"

// hash router settle methods
function hashChangeHandler() {
  reroute();
}

window.addEventListener("hashchange", hashChangeHandler)
window.addEventListener("popstate", hashChangeHandler)

const captureEventListeners: {
  hashchange: Array<Function>;
  popstate: Array<Function>;
} = {
  hashchange: [],
  popstate: []
}
const needListenerEvents = ["hashchange", "popstate"]
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function<K extends keyof WindowEventMap>(
  type: K, listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | undefined) {
  if(needListenerEvents.includes(type as string) 
    && !captureEventListeners[type as 'hashchange' | 'popstate'].some(
      cb => cb === listener)) {
    captureEventListeners[type as 'hashchange' | 'popstate'].push(listener as Function)
  }
  return originalAddEventListener.apply(this, [type, listener, options]);
}

window.removeEventListener = function<K extends keyof WindowEventMap>(
  type: K, listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | undefined) {
  if(needListenerEvents.includes(type as string) ) {
    captureEventListeners[type as 'hashchange' | 'popstate'] = 
      captureEventListeners[type as 'hashchange' | 'popstate'].filter(cb => cb !== listener as Function) 
  }
  return originalRemoveEventListener.apply(this, [type, listener, options]);
}


// history settle 
window.history.pushState = patchPolify(window.history.pushState, "pushState")
window.history.replaceState = patchPolify(window.history.replaceState, "replaceState")
function patchPolify(event: History["pushState"] | History["replaceState"], type: "pushState" | "replaceState") {
  return function(this: History, updateState: Function) {
    const urlPre = window.location.href
    const pre = updateState.apply(this, Array.from(Array.from(arguments).slice(1)));
    const urlAfter = window.location.href
    if (urlPre !== urlAfter) {
      window.dispatchEvent(new PopStateEvent("popstate"))
    }
    return pre
  }
}


export function callCaptureEventListeners(event: Event) {
  if (event) {
    const eventType = event.type;
    if (needListenerEvents.includes(eventType)) {
      captureEventListeners[eventType as "hashchange" | "popstate"].forEach(
        function(this: Window, listener) {
          listener.call(this, event);
        }
      );
    }
  }
}
