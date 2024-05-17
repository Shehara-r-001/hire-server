import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { UserRoles } from '../../../shared/enums/UserRoles.enum';
import { UserStatus } from '../../../shared/enums/user.enum';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @IsNotEmpty()
  @IsEmail()
  phone: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  @IsOptional()
  @IsString()
  role: string;

  @Column({ type: 'time with time zone' })
  @IsOptional()
  @IsISO8601()
  createdAt: Date;

  @Column({ type: 'time with time zone', nullable: true })
  @IsOptional()
  @IsISO8601()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  timezone: string;

  // ! or make an enum out of this
  @Column()
  @IsNotEmpty()
  @IsString()
  profession: string;

  @ManyToOne(() => Company, (Company) => Company.Employees)
  Company: Company;

  // todo try closure tables
}
