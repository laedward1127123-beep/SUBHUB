// SubHub README 截图脚本：注入演示数据后截取仪表盘与订阅列表
const path = require('path')
const fs = require('fs')
const { chromium } = require('/Users/liao/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'docs', 'screenshots')
const BASE = 'http://localhost:3000'

const demo = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'demo-data.json'), 'utf8'))

const SETTINGS = {
  theme: 'light',
  accent: 'blue',
  defaultCurrency: 'CNY',
  viewMode: 'grid',
  yearDays: 365,
  dashboardCards: { monthly: true, yearly: true, count: true, upcoming: true, chart: true },
}

async function shot(page, hash, file, theme) {
  await page.evaluate(
    ({ subs, settings, theme }) => {
      localStorage.setItem('subhub.subscriptions', JSON.stringify(subs))
      localStorage.setItem('subhub.settings', JSON.stringify({ ...settings, theme }))
    },
    { subs: demo.subscriptions, settings: SETTINGS, theme },
  )
  await page.goto(`${BASE}/#${hash}`)
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('main h1', { timeout: 15000 })
  await page.waitForTimeout(1200) // 等 framer-motion 入场动画与图片渲染
  await page.screenshot({ path: path.join(OUT, file) })
  console.log('已保存', file)
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  let browser
  try {
    browser = await chromium.launch({ headless: true })
  } catch (e) {
    console.log('缓存 chromium 不可用，改用系统 Chrome')
    browser = await chromium.launch({ headless: true, channel: 'chrome' })
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })

  await shot(page, '/subscriptions', 'subscriptions-grid-light.png', 'light')
  await shot(page, '/dashboard', 'dashboard-light.png', 'light')
  await shot(page, '/subscriptions', 'subscriptions-grid-dark.png', 'dark')

  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
