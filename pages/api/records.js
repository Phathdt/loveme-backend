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
      const rows = await sheet.getRows()

      let records = []

      rows.forEach((row) => {
        const record = {
          name: row.name,
          attend_type: row.attend_type,
          guest: row.guest,
          special_request: row.special_request,
          your_wish: row.your_wish,
          show: row.show,
        }

        records = [...records, record]
      })

      res.status(200).json({ records: records })
      break

    default:
      res.status(200).json({ msg: 'ok' })
      break
  }
}
