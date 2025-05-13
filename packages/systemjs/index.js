/**
 * 原本的文件格式
 * {
 *  “imports”: {
 *    key: value...
 *  }
 * }
 * 
 * webpack 打包后的代码核心逻辑
 * System.register([...deps], function() {
 *	return {
 *		setters: [
 *	    function(module) {}
 *		],
 *	  execute: function() {}
 *   }
 * })
 */
const newMapUrl = new Map();
// 依赖解析的实现
function processScripts() {
  Array.from(document.getSelectors('script')).forEach(script => {
    if (script.type === 'systemjs-importmap') {
      const imports = JSON.parse(script.innerHTML).imports
      Object.entries(imports).forEach(([key, value]) => {
        newMapUrl.set(key, value)
      })
    }
  })
}

function loadSource(url) {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.src = newMapUrl.get(url) || url  // 支持 cdn 加载
      script.async = true // 异步加载
      document.head.appendChild(script)
      script.addEventListener('load', () => {
        let _lastRegiser = lastRegiser;
        lastRegiser = null;
        if (_lastRegiser) {
          resolve(_lastRegiser)
        }
        resolve(null)
      })
    } catch (error) {
      reject(error)
    }
  })
}

let set = new Set();
function saveGlobalProperty(name) {
  for (let key in window) {
    if (!set.has(key)) {
      set.add(key)
    }
  }
}
saveGlobalProperty();

// (function saveGlobalProperty(name) {
//   for (let key in window) {
//     if (!set.has(key)) {
//       set.add(key)
//     }
//   }
// })()

function getLastGlobalProperty() {
  // 实现获取得到 window 上新增属性
  for (let key in window) {
    if (!set.has(key)) {
      set.add(key)
      return window[key]
    } else {
      continue
    }
  }
}

let lastRegiser = null;
// 实现属于自己的 system.js
class System {
  // 实现模块加载器
  import(id) {
    return Promise.resolve(processScripts()).then(() => {
      // 在路径中实现查找对应的资源
      const lastSepIndex = location.href.lastIndexOf('/')
      const baseURL = location.href.slice(0, lastSepIndex + 1)
      if (id.startsWith("./")) {
        return baseURL + id.slice(2)
      } else if (id.startsWith("https://")) {
        return baseURL + id.slice(8)
      } else {
        return newMapUrl.get(id)
      }
    }).then(url => {
      let execute = null;
      // 根据 url 实现加载资源实现
      if (url) {
        return loadSource(url).then((register) => {
          if (register) {
            const [deps, declare] = register;
  
            // seetters 是一个用来保存加载过的资源的对象，
            // execute 是一个函数，用来执行模块的代码，渲染逻辑的实现吧
            const { setters, exe } = declare(() => {})
            execute = exe;
            return [deps, setters]
          }
        }).then(([deps, setters]) => {
          // 实现模块的加载
          // promise.all 确保都加载完并且说执行顺序不会因为加载时间从而乱序
          return Promise.all(deps.map((dep, index) => {
            return loadSource(dep).then(() => {
              // 加载完毕后，执行 setters 方法，
              // 每次添加一个文件 window 上多一个属性 window.xxx
              const newProperty = getLastGlobalProperty()
              setters[index](newProperty)
            })
          }))
        }).then(() => {
          // 执行模块的代码，渲染逻辑的实现吧
          return execute()
        })
      } else {
        return Promise.resolve()
      }
    })
  }

  register(deps, declare) {
    lastRegiser = [deps, declare]
  }
}