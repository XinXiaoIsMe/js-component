/* eslint-disable no-console */
import Upload from '../../src/js/upload/index.js'

const upload1 = new Upload({
  el: '.js-upload-1',
  action: 'http://localhost:3000/upload',
  data: {
    filename: 'test.docx'
  }
})
upload1.on('on-success', (...args) => console.log(args))

const upload2 = new Upload({
  el: '.js-upload-2',
  action: 'http://localhost:3000/upload',
  multiple: true
})

const upload3 = new Upload({
  el: '.js-upload-3',
  action: 'http://localhost:3000/upload',
  data: {
    filename: 'test.docx'
  },
  accept: '.pdf'
})

console.log(upload1, upload2, upload3)
