import http from './http.js'
import { getElement } from '../utils/dom.js'
import useAwait from '../utils/useAwait.js'
import JSEvent from '../event/index.js'

export default class Upload extends JSEvent {
    constructor(options = {}) {
        super()

        this.options = options
        this.fileList = []
        this.el = getElement(options.el)

        if (!this.el) {
            throw new TypeError('please pass a valid element or selector.')
        }

        this._handleUploadClick = this.handleUploadClick.bind(this)

        this._init()
    }

    _init() {
        this._render()
        this._bindEvent()
    }

    _render() {
        this.oUploadInput = document.createElement('input')
        this.oUploadInput.type = 'file'
        if (this.options.accept) this.oUploadInput.accept = this.options.accept
        this.oUploadInput.multiple = !!this.options.multiple
        this.oUploadInput.style.display = 'none'
        this.oUploadInput.onclick = e => e.stopPropagation()
        this.oUploadInput.onchange = this.handleFileUpload.bind(this)
        this.el.appendChild(this.oUploadInput)
    }

    _bindEvent() {
        this.on('click', this._handleUploadClick, true)
    }

    handleUploadClick() {
        this.oUploadInput.click()
    }

    handleFileUpload(e) {
        console.log(this, e, e.target.files)
        const { files } = e.target.files
        this.files = files
        this.fileList.push(...files)
        this.emit('on-change', files, this.fileList)
        this.handleUpload()
    }

    async handleUpload() {
        const {
            httpRequest,
            action,
            headers,
            data
        } = this.options
        if (httpRequest) {
            httpRequest(this.files)
            return
        }

        const formData = new FormData()
        formData.append('file', this.files)
        formData.append('data', JSON.stringify(data))

        const [error, res] = await useAwait(http({
            type: 'POST',
            url: action,
            data: formData,
            headers
        }))

        if (error) {
            this.emit('on-error', error, this.files, this.fileList)
        } else {
            this.emit('on-success', res, this.files, this.fileList)
        }
    }

    reset() {
        this.el = null
        this.files = null
        this.oUploadInput = null
        this.options = {}
        this.fileList = []
    }

    destroy() {
        this.off('click', this._handleUploadClick, true)
        this.oUploadInput.onclick = null
        this.el.remove()
        this.reset()
    }
}
