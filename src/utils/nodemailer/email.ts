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
    this.createConnection();
  }

  createConnection(): any {
    if (process.env.NODE_ENV === "development") {
      return (this.transpoter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        auth: {
          user: process.env.TEST_SMTP_USER,
          pass: process.env.TEST_SMTP_PASS,
        },
      }));
    } else if (process.env.NODE_ENV === "production") {
      return (this.transpoter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      }));
    }
  }

  async sendEmail(): Promise<any> {
    try {
      return this.transpoter
        .sendMail({
          to: this.user_email,
          from: this.from,
          subject: this.subject,
          text: this.message,
        })
        .then(() => {
          console.log("EMAIL SENT");
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
