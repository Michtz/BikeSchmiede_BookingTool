'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBikeConfiguration(data: any, total: number) {
  if (!data.email) {
    console.error('Email sending failed: No customer email provided.');
    return { success: false };
  }

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333;">Deine ODIN Roadbike Konfiguration</h1>
      <p>Vielen Dank für deine Anfrage! Hier ist deine Zusammenfassung:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Rahmen:</strong></td>
          <td style="padding: 10px 0;">${data.frame}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Gruppe:</strong></td>
          <td style="padding: 10px 0;">${data.gruppe}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Laufräder:</strong></td>
          <td style="padding: 10px 0;">${data.laufrader}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Reifen:</strong></td>
          <td style="padding: 10px 0;">${data.reifen}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Tretlager:</strong></td>
          <td style="padding: 10px 0;">${data.tretlager}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Lenkerband:</strong></td>
          <td style="padding: 10px 0;">${data.lenkerband}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px 0;"><strong>Sattel:</strong></td>
          <td style="padding: 10px 0;">${data.sattel}</td>
        </tr>
      </table>
      <h2 style="margin-top: 30px; color: #111;">Gesamtpreis: ${total} €</h2>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">Wir haben deine Anfrage erhalten und werden uns bald bei dir melden.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">ODIN Bikes | <a href="https://odinbikes.ch" style="color: #999;">odinbikes.ch</a></p>
    </div>
  `;

  try {
    // 1. Send confirmation email to the customer
    const customerResponse = await resend.emails.send({
      from: 'ODIN Bikes <info@odinbikes.ch>',
      to: [data.email],
      subject: 'Deine Traumrad-Konfiguration | ODIN Bikes',
      html: emailHtml,
    });

    // 2. Send notification email to the admin (ODIN Bikes)
    const adminResponse = await resend.emails.send({
      from: 'ODIN Bikes <info@odinbikes.ch>',
      to: ['info@odinbikes.ch'],
      subject: `Neue Konfigurationsanfrage: ${data.email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Neue Anfrage erhalten</h2>
          <p>Kunde: <strong>${data.email}</strong></p>
          <hr />
          ${emailHtml}
        </div>
      `,
    });

    console.log('Customer Email Result:', customerResponse);
    console.log('Admin Email Result:', adminResponse);

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false };
  }
}
