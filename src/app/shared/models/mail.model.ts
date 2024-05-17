export interface IMailData {
  to: string;
  subject: string;
  templateId: string;
  dynamicTemplateData?: { [key: string]: any };
}
