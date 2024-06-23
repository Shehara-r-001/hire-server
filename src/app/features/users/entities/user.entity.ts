import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { UserRoles } from '../../../shared/enums/UserRoles.enum';
import { UserStatus } from '../../../shared/enums/user.enum';
import { Company } from '../../companies/entities/company.entity';
import { Image } from '../../../shared/models/Image.model';

@Entity()
@Index(['email', 'profession'])
export class User extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(20)
  @Column({ type: 'varchar', unique: true, nullable: true, length: 20 })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @Column({ type: 'varchar', length: 1000 })
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @IsOptional()
  @IsEnum(UserRoles)
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Image)
  @Column({ nullable: true, type: 'simple-json' })
  image: Image;

  // max length 36
  @IsOptional()
  @IsString()
  @MaxLength(36)
  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20 })
  timezone: string;

  // ! or make an enum out of this
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  profession: string;

  @ManyToOne(() => Company, (Company) => Company.Employees)
  Company: Company;

  // get isAdmin() {
  //   return this.role === UserRoles.ADMIN;
  // }

  // get isManager() {
  //   return this.role === UserRoles.MANAGER;
  // }

  // todo try closure tables
}
