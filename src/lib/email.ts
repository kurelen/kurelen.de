import nodemailer from "nodemailer";

const {
  MAIL_DRIVER = "ethereal",
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = "kurelen@noreply.de",
} = process.env;

async function createTransporter(): Promise<nodemailer.Transporter> {
  switch (MAIL_DRIVER) {
    case "smtp":
      return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT ?? 587),
        secure: false,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      });
    case "console":
      return nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
        newline: "unix",
      });
    default:
      if (MAIL_DRIVER !== "ethereal") {
        console.error(
          "Expected MAIL_DRIVER to be smtp, console or ethereal. Fallback to ethereal"
        );
      }
      const acc = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: acc.smtp.host,
        port: acc.smtp.port,
        secure: acc.smtp.secure,
        auth: { user: acc.user, pass: acc.pass },
      });
  }
}

export const mailer = await createTransporter();

export async function sendInviteEmail(to: string, link: string) {
  await mailer.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Deine Einladung für kurelen.de",
    text: `Hallo! Klicke auf folgenden Link, um dich zu registrieren:\n\n${link}\n\nDer Link ist 72 Stunden gültig.`,
    html: `<p>Hallo!</p><p><a href="${link}">Hier klicken</a>, um dich zu registrieren.</p><p>Der Link ist 72 Stunden gültig.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, link: string) {
  await mailer.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Passwort zurücksetzen",
    text: `Zum Zurücksetzen deines Passworts klicke:\n\n${link}\n\nDieser Link ist 60 Minuten gültig.`,
    html: `<p>Zum Zurücksetzen deines Passworts <a href="${link}">hier klicken</a>.</p><p>Gültig für 60 Minuten.</p>`,
  });
}
