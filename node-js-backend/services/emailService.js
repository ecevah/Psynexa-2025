const nodemailer = require("nodemailer");
const logger = require("../config/logger");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Email gönderme fonksiyonu
  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      logger.info(`Email başarıyla gönderildi: ${to}`);
      return true;
    } catch (error) {
      logger.error(`Email gönderme hatası: ${error.message}`);
      throw new Error("Email gönderilemedi");
    }
  }

  // Şifre sıfırlama emaili
  async sendPasswordResetEmail(email, resetUrl, userType = "client") {
    const subject =
      userType === "psychologist"
        ? "Şifre Sıfırlama - Psikolog Paneli"
        : "Şifre Sıfırlama";

    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Şifre Sıfırlama İsteği</h1>
                <p style="color: #666; font-size: 16px;">Merhaba,</p>
                <p style="color: #666; font-size: 16px;">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4CAF50; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px;
                              font-size: 16px;">
                        Şifremi Sıfırla
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">Bu link 1 saat sonra geçerliliğini yitirecektir.</p>
                <p style="color: #666; font-size: 14px;">Eğer şifre sıfırlama isteğinde bulunmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    Bu otomatik bir emaildir, lütfen cevaplamayınız.
                </p>
            </div>
        `;

    return this.sendEmail(email, subject, html);
  }

  // Hoşgeldin emaili
  async sendWelcomeEmail(email, name, userType = "client") {
    const subject =
      userType === "psychologist"
        ? "Hoş Geldiniz - Psikolog Paneli"
        : "Hoş Geldiniz";

    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Hoş Geldiniz!</h1>
                <p style="color: #666; font-size: 16px;">Merhaba ${name},</p>
                <p style="color: #666; font-size: 16px;">
                    Platformumuza hoş geldiniz! Hesabınız başarıyla oluşturuldu.
                </p>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
                    <p style="color: #666; font-size: 14px;">
                        Herhangi bir sorunuz olursa, destek ekibimizle iletişime geçebilirsiniz.
                    </p>
                </div>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    Bu otomatik bir emaildir, lütfen cevaplamayınız.
                </p>
            </div>
        `;

    return this.sendEmail(email, subject, html);
  }
}

module.exports = new EmailService();
