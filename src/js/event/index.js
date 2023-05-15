import { isType } from '../utils/type.js'

export default class JSEvent {
  constructor() {
    this._events = {}
    this._nativeEventOptionMap = new Map() // 保存addEventListener的选项
  }

  on(eventName, cb, isNative = false, nativeEventOptions = false) {
    this._events[eventName] = this._events[eventName] || []
    this._events[eventName].push(cb)

    if (isNative) {
      this.el.addEventListener(eventName, cb, nativeEventOptions)
      const nativeEventOptionsCache = this._nativeEventOptionMap.get(cb) || []
      nativeEventOptionsCache.push(nativeEventOptions)
    }
  }

  emit(eventName, ...args) {
    const cbs = this._events[eventName] || []
    cbs.forEach(cb => cb(...args))
  }

  off(eventName, cb, isNative = false) {
    if (!this._events[eventName])
      return

    const cbs = this._events[eventName]
    if (isType(cb, 'function')) {
      isNative && this.el.removeEventListener(
        eventName,
        cbs,
        this._nativeEventOptionMap.get(cb).shift()
      )
      this._events[eventName] = cbs.filter(_cb => _cb !== cb)
    }
    else {
      isNative && cbs.forEach(_cb => this.el.removeEventListener(
        eventName,
        _cb,
        this._nativeEventOptionMap.get(_cb).shift())
      )
      Reflect.deleteProperty(this._events, eventName)
    }
  }
}
