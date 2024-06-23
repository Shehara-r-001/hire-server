import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';

export enum VacancyStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  REMOVED = 'removed',
}

export enum JobLevel {
  INTERN = 'intern',
  ENTRY_LEVEL = 'entry',
  MID_SENIOR = 'mid_senior',
  SENIOR = 'senior',
}

export enum JobType {
  PART_TIME = 'part_time',
  FULL_TIME = 'full_time',
  CONTRACT = 'contract',
}

@Entity()
@Index(['companyId'])
export class Vacancy extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, nullable: true })
  subTitle: string;

  // use md for below 3 fields
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  requrements: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  other: string;

  @IsNotEmpty()
  @IsEnum(JobLevel)
  @Column({ type: 'enum', enum: JobLevel })
  level: JobLevel;

  @IsNotEmpty()
  @IsEnum(JobType)
  @Column({ type: 'enum', enum: JobType })
  type: JobType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  field: string;

  @IsNotEmpty()
  @IsEnum(VacancyStatus)
  @Column({ type: 'enum', enum: VacancyStatus })
  status: VacancyStatus;

  @IsNotEmpty()
  @IsISO8601()
  @Column({ type: 'timestamptz' })
  openFrom: Date;

  @IsNotEmpty()
  @IsISO8601()
  @Column({ type: 'timestamptz' })
  openTo: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.Vacancies)
  @JoinColumn({ name: 'companyId' })
  Company: Company;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  @Column({ type: 'uuid' })
  createdByID: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByID' })
  CreatedBy: User;
}
