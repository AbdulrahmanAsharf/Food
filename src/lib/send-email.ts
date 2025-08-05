import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(email: string, name: string, orderId: string) {
  try {
    const data = await resend.emails.send({
      from: 'YourStore <orders@yourstore.com>',
      to: [email],
      subject: 'تم تأكيد طلبك',
      html: `
        <h2>مرحبًا ${name} 👋</h2>
        <p>تم تأكيد طلبك بنجاح 🎉</p>
        <p>رقم الطلب: <strong>${orderId}</strong></p>
      `,
    });

    console.log('✅ Email sent:', data);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}
