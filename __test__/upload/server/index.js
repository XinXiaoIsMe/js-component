const {
  resolve,
  extname
} = require('node:path')
const {
  writeFileSync
} = require('node:fs')
const express = require('express')
const bodyParser = require('body-parser')
const uploader = require('express-fileupload')

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(uploader({
  defParamCharset: 'utf8'
}))

// cross origin settings
app.all('*', (req, res, next) => {
  res.header('Access-control-allow-origin', '*')
  res.header('Access-control-allow-methods', 'GET,POST')
  next()
})

function upload(req, res, cb) {
  const { file } = req.files
  const filename = req.body.filename || file.name
  const type = extname(file.name)

  if (!file) {
    res.send({
      code: 1001,
      msg: 'No file uploaded!'
    })
    return
  }

  if (cb && !cb(type)) {
    res.send({
      code: 400,
      msg: 'The type is not allowed for uploading.'
    })
    return
  }

  const filePath = resolve(__dirname, `./upload_temp/${filename}`)
  writeFileSync(filePath, file.data)
  res.send({
    code: 200,
    msg: 'file is uploaded'
  })
}

// routes
app.post('/upload', (req, res) => upload(req, res))

app.post('/upload/pdf', (req, res) => upload(req, res, type => type === '.pdf'))

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('server started on port 3000...'))
