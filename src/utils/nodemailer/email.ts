import nodemailer, {
  SendMailOptions,
  Transport,
  Transporter,
  createTransport,
} from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class Email {
  private transpoter: nodemailer.Transporter;
  // FOR CONNECTION
  private host: string = process.env.SMTP_HOST;
  private port: number = +process.env.SMTP_PORT;
  private user: string = process.env.SMTP_USER;
  private pass: string = process.env.SMTP_PASS;

  private from: string = "Sync Me";

  // SENDMAIL OPTIONS
  protected message: string;
  public user_email: string;
  protected subject: string;

  constructor(message: string, subject: string, user_email: string) {
    this.message = message;
    this.subject = subject;
    this.user_email = user_email;
  }

  createConnection(): any {
    this.transpoter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
    return;
  }

  async sendEmail(): Promise<any> {
    try {
      return await this.transpoter.sendMail({
        to: this.user_email,
        from: this.from,
        subject: this.subject,
        text: this.message,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
