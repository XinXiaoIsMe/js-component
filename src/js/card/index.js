import { getElement } from '../utils/dom.js'
import JSEvent from '../event/index.js'

export default class Card extends JSEvent {
    constructor(options = {
        el: '',
        class: '',
        shadow: 'always'
    }) {
        super()

        this.options = options
        this.el = getElement(options.el)

        if (!this.el) {
            throw new TypeError('please pass a valid element or selector.')
        }

        this._init()
    }

    _init() {
        this._render()
    }

    _render() {
        this.el.className += (this.options.class || '')
        this.el.dataset.component = 'card'

        const shadow = this.options.shadow
        this.el.className += shadow === 'always'
            ? ' always-shadow'
            : shadow === 'hover'
                ? ' hover-shadow'
                : ''
    }

    destroy() {
        this.el && this.el.remove()
        this.el = this.options = null
    }
}