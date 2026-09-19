import nodemailer from 'nodemailer'

const recipients = (process.env.SMTP_TO || 'kanishka.utsav@gmail.com')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const form = await request.json()
    const fields = ['name', 'trip', 'plannedDate', 'phone']

    if (fields.some((field) => !String(form[field] || '').trim())) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients[0],
      bcc: recipients.slice(1),
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

    return new Response(JSON.stringify({ message: 'Callback request sent.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Unable to send callback email:', error)

    return new Response(JSON.stringify({ error: 'Unable to send the callback request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
