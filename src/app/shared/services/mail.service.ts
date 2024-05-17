import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from '../models/EnvConfig.model';
import { IMailData } from '../models/mail.model';
import { Company } from 'src/app/features/companies/entities/company.entity';
import { User } from 'src/app/features/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService<EnvConfig, true>
  ) {}

  private SENDER = this.configService.get('SENDGRID_SENDER');
  private CLIENT_URL = this.configService.get('HIRE_CLIENT');

  private TemplateIDs = {
    createCompany: 'd-da64c91f44d74dcb8de79a1ec1d71266',
  };

  private async sendEmail(mailData: IMailData) {
    try {
      await this.sendGridService.send({
        to: mailData.to,
        from: this.SENDER,
        subject: mailData.subject,
        templateId: mailData.templateId,
        dynamicTemplateData: mailData.dynamicTemplateData,
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendCreateCompanyEmail(company: Company, user: User) {
    try {
      return await this.sendEmail({
        to: user.email,
        subject: `Company ${company.name} has been activated!`,
        templateId: this.TemplateIDs.createCompany,
        dynamicTemplateData: { signinUrl: `${this.CLIENT_URL}/signin` },
      });
    } catch (error) {
      throw error;
    }
  }
}
