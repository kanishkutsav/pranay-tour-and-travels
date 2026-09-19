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
    const name = String(form.name || '').trim()
    const trip = String(form.trip || '').trim()
    const plannedDate = String(form.plannedDate || '').trim()
    const phone = String(form.phone || '').trim()

    if (name.length < 2) {
      return new Response(JSON.stringify({ error: 'Name must be at least 2 characters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!trip) {
      return new Response(JSON.stringify({ error: 'Trip interested in is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid 10-digit Indian mobile number.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients[0],
      bcc: recipients.slice(1),
      replyTo: process.env.SMTP_USER,
      subject: `Trip callback request from ${name}`,
      text: [
        `Name: ${name}`,
        `Trip interested in: ${trip}`,
        `Planned date: ${plannedDate || 'Not specified'}`,
        `Phone number: ${phone}`,
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
