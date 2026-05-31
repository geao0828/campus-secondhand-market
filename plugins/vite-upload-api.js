import fs from 'fs'
import path from 'path'
import formidable from 'formidable'

const UPLOAD_PATH = '/api/upload/image'
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE = 5 * 1024 * 1024

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function getExtension(mimetype, originalFilename) {
  const fromName = path.extname(originalFilename || '').toLowerCase()
  if (fromName) return fromName
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
  }
  return map[mimetype] || '.jpg'
}

async function handleUpload(req, res) {
  const uploadRoot = path.resolve(process.cwd(), 'public/uploads')
  const form = formidable({
    maxFileSize: MAX_SIZE,
    allowEmptyFiles: false,
    multiples: false
  })

  try {
    const [fields, files] = await form.parse(req)
    const typeRaw = fields.type?.[0] ?? 'product'
    const type = typeRaw === 'avatar' ? 'avatar' : 'product'
    const file = files.file?.[0]

    if (!file) {
      sendJson(res, 400, { code: 400, message: '请选择要上传的文件', data: null })
      return
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      sendJson(res, 400, { code: 400, message: '仅支持 jpg、png、webp、gif 格式', data: null })
      return
    }

    const subDir = type === 'avatar' ? 'avatar' : 'product'
    const dir = path.join(uploadRoot, subDir)
    fs.mkdirSync(dir, { recursive: true })

    const ext = getExtension(file.mimetype, file.originalFilename)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    const destPath = path.join(dir, filename)

    fs.renameSync(file.filepath, destPath)

    const url = `/uploads/${subDir}/${filename}`
    sendJson(res, 200, { code: 200, message: '上传成功', data: { url, type } })
  } catch (err) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? '图片大小不能超过 5MB' : err.message || '上传失败'
    sendJson(res, 500, { code: 500, message, data: null })
  }
}

function uploadMiddleware(req, res, next) {
  const pathname = req.url?.split('?')[0]
  if (pathname !== UPLOAD_PATH) return next()
  if (req.method !== 'POST') {
    sendJson(res, 405, { code: 405, message: 'Method Not Allowed', data: null })
    return
  }
  handleUpload(req, res)
}

export function uploadApiPlugin() {
  const apply = (server) => {
    server.middlewares.use(uploadMiddleware)
  }
  return {
    name: 'vite-upload-api',
    configureServer: apply,
    configurePreviewServer: apply
  }
}
