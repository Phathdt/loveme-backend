import NextCors from 'nextjs-cors'
import { GoogleSpreadsheet } from 'google-spreadsheet'

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID)
let init = false
let sheet = null

async function initGoogleSheetClient() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })

  await doc.loadInfo()

  sheet = doc.sheetsByIndex[0]
  init = true
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  if (!init) {
    await initGoogleSheetClient()
  }

  switch (req.method) {
    case 'POST':
      // append rows
      await sheet.addRow(req.body)

      res.status(200).json({ msg: 'ok' })
      break

    case 'GET':
      res.status(200).json({ records: [] })
      break

    default:
      res.status(200).json({ msg: 'ok' })
      break
  }
}
