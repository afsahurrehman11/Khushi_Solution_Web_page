import { NextResponse } from 'next/server';

/*
 * Contact Form API Route
 * ----------------------
 * Primary: Stores the submission (logged server-side).
 * Optional: Sends confirmation email via Resend if RESEND_API_KEY is configured.
 *
 * For Netlify deployment, this API route works as a serverless function.
 * Alternatively, you can use Netlify Forms (add data-netlify="true" to the form)
 * and this API route as a fallback.
 */

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    /* Validate required fields */
    if (!body.name?.trim() || !body.email?.trim() || !body.subject?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    /* Validate email format */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    /* Log the submission (always works) */
    console.log('📧 New contact form submission:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      phone: body.phone || 'Not provided',
      timestamp: new Date().toISOString(),
    });

    /* Optional: Send confirmation email via Resend */
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@khushisolutions.com',
          to: notificationEmail,
          subject: `[Khushi Solutions] Contact: ${body.subject}`,
          text: `
New contact form submission:

Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || 'Not provided'}
Subject: ${body.subject}

Message:
${body.message}

---
Submitted at: ${new Date().toISOString()}
          `.trim(),
        });
      } catch (emailError) {
        /* Log email failure but don't fail the submission */
        console.error('Email notification failed:', emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch {
    console.error('Contact form error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
