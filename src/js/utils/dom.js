import { isType } from './type.js'

export function getElement(selector) {
  return isDom(selector)
    ? selector
    : isType(selector, 'string')
      ? document.querySelector(selector)
      : null
}

export function isDom(el) {
  return el instanceof HTMLElement
}
