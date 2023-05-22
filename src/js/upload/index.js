import { getElement } from '../utils/dom.js'
import useAwait from '../utils/useAwait.js'
import JSEvent from '../event/index.js'

import http from './http.js'

export default class Upload extends JSEvent {
  constructor(options = {}) {
    super()

    this.options = options
    this.fileList = []
    this.name = options.name || 'file'
    this.el = getElement(options.el)

    if (!this.el)
      throw new TypeError('please pass a valid element or selector.')

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
    if (this.options.accept)
      this.oUploadInput.accept = this.options.accept
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
    const { files } = e.target
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

    const createFormDatas = (name, files, data) => {
      const formDatas = []
      files.forEach((file) => {
        const formData = new FormData()
        formData.append(name, file)
        if (typeof data === 'object') {
          for (const key in data) {
            if (data.hasOwnProperty(key))
              formData.append(key, data[key])
          }
        }
        formDatas.push(formData)
      })
      return formDatas
    }
    const createRequests = (datas) => {
      const requests = []
      datas.forEach(data => requests.push(http.post(action, data, { headers })))
      return Promise.all(requests)
    }
    const formDatas = createFormDatas(this.name, [...this.files], data)
    const [error, res] = await useAwait(createRequests(formDatas))

    if (error)
      this.emit('on-error', error, this.files, this.fileList)
    else
      this.emit('on-success', res, this.files, this.fileList)
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
