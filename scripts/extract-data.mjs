import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const base = path.join(__dirname, '..', '..')
const outDir = path.join(__dirname, '..', 'src', 'data')

function extractBetween(html, start, end) {
  const i = html.indexOf(start)
  if (i < 0) throw new Error('start not found: ' + start)
  const j = html.indexOf(end, i)
  if (j < 0) throw new Error('end not found: ' + end)
  return html.slice(i + start.length, j)
}

fs.mkdirSync(outDir, { recursive: true })

const agentHtml = fs.readFileSync(path.join(base, 'dd-agent.html'), 'utf8')
const agentsBlock = extractBetween(agentHtml, 'const AGENT_ORDER =', 'const WK_LABELS')
const teamHtml = fs.readFileSync(path.join(base, 'dd-teamlead.html'), 'utf8')
const sparkBlock = extractBetween(teamHtml, 'const WK_LABELS =', 'const SPARK_PREVIEW_SLUGS')
const previewBlock = extractBetween(teamHtml, 'const SPARK_PREVIEW_SLUGS =', 'const sparkCharts')

const agentsOut = `// Extracted from dd-agent.html and dd-teamlead.html
export ${agentsBlock.trim()}

export ${sparkBlock.trim()}

export ${previewBlock.trim()}

export const COACHING_WEEK_INDEX = 2
export const DEFAULT_SLUG = 'ayanda-mbeki'
`
fs.writeFileSync(path.join(outDir, 'agents.js'), agentsOut)

const ccmHtml = fs.readFileSync(path.join(base, 'dd-ccm.html'), 'utf8')
const trendBlock = extractBetween(ccmHtml, 'const WK_LABELS =', 'const charts =')
fs.writeFileSync(
  path.join(outDir, 'ccmConstants.js'),
  `import { formatAht } from '../utils/format'

export ${trendBlock.trim()}
`
)

console.log('Extracted agents.js and ccm trend constants')
