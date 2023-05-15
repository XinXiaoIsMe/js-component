const toStr = Object.prototype.toString
export function isType(arg) {
    return toStr.call(arg).slice(8, -1).toLowerCase()
}
