import http from 'node:http'
import nodemailer from 'nodemailer'

const port = Number(process.env.API_PORT || 3001)
const recipient = 'kanishka.utsav@gmail.com'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendJson = (response, status, payload) => {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

const server = http.createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/api/callback') {
    sendJson(response, 404, { error: 'Not found' })
    return
  }

  let body = ''
  request.on('data', (chunk) => { body += chunk })
  request.on('end', async () => {
    try {
      const form = JSON.parse(body)
      const fields = ['name', 'trip', 'plannedDate', 'phone']
      if (fields.some((field) => !String(form[field] || '').trim())) {
        sendJson(response, 400, { error: 'All fields are required.' })
        return
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipient,
        replyTo: process.env.SMTP_USER,
        subject: `Trip callback request from ${form.name}`,
        text: [
          `Name: ${form.name}`,
          `Trip interested in: ${form.trip}`,
          `Planned date: ${form.plannedDate}`,
          `Phone number: ${form.phone}`,
          `Comments: ${form.comments || 'None'}`,
        ].join('\n'),
      })

      sendJson(response, 200, { message: 'Callback request sent.' })
    } catch (error) {
      console.error('Unable to send callback email:', error)
      sendJson(response, 500, { error: 'Unable to send the callback request.' })
    }
  })
})

server.listen(port, () => {
  console.log(`Callback API listening on http://localhost:${port}`)
})
