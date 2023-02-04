import { SESV2 } from "aws-sdk";
import { render } from "ejs";
import mailComposer from "nodemailer/lib/mail-composer";

import SupabaseService from "./supabase.service";

interface EmailAttachments {
  filename: string;
  path: string;
  cid: string;
}

class EmailService {
  private static emailClient: SESV2 | null = null;
  private constructor() {}
  public static async initEmailClient() {
    this.emailClient = new SESV2({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_AKI!,
        secretAccessKey: process.env.AWS_SAK!,
      },
    });
    console.log("SES E-mail client initiated successfully!");
  }
  public static async getEmailClient() {
    if (this.emailClient) {
      return this.emailClient;
    } else {
      await this.initEmailClient();
      return this.emailClient;
    }
  }
  public static async generateEmail(
    templateName: string,
    to: string,
    subject: string,
    injectedData: Record<string, any>,
    attachments: EmailAttachments[]
  ) {
    const db = await SupabaseService.getSupabase();
    const { data, error } = await db!.storage
      .from("email-templates")
      .download(`${templateName}.ejs`);
    if (error) {
      const err = {
        errorCode: 500,
        name: "Storage Error",
        message: "Supabase storage called failed",
        storageError: error,
      };
      throw err;
    }
    const templateString = await data.text();
    const rawEmail = await new mailComposer({
      from: "deLinZK Support <delinzk@support.justimpossible.software>",
      replyTo: "deLinZK Support <delinzk@support.justimpossible.software>",
      to: to,
      subject: subject,
      text: subject,
      html: Buffer.from(render(templateString, injectedData)),
      attachments: attachments,
    })
      .compile()
      .build();
    return rawEmail;
  }
  public static async sendEmail(to: string, emailBuffer: Buffer) {
    const result = await this.emailClient
      ?.sendEmail({
        FromEmailAddress:
          "deLinZK Support <delinzk@support.justimpossible.software>",
        Destination: {
          ToAddresses: [to],
        },
        Content: {
          Raw: { Data: emailBuffer },
        },
      })
      .promise();
    console.log(`Email sent to ${to} at `, new Date().toISOString());
    console.dir(result);
  }
}

export default EmailService;
