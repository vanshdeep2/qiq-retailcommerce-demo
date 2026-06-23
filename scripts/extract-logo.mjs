import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const html = fs.readFileSync(path.join(__dirname, '../../dd-exec.html'), 'utf8')
const match = html.match(/src="(data:image\/jpeg;base64,[^"]+)"/)
if (match) {
  const b64 = match[1].split(',')[1]
  fs.writeFileSync(path.join(__dirname, '../public/qiq-logo.jpg'), Buffer.from(b64, 'base64'))
  console.log('Extracted qiq-logo.jpg')
}
