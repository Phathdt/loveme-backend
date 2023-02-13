import NextCors from 'nextjs-cors'

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  switch (req.method) {
    case 'POST':
      console.log(req.body)

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
