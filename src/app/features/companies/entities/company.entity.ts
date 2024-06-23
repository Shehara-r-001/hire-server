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
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Image } from 'src/app/shared/models/Image.model';

export enum CompanyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity()
@Index(['name', 'field'])
export class Company extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Column({ type: 'varchar', length: '255' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  field: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  @Column({ type: 'uuid', nullable: false })
  managerId: string;

  @IsOptional()
  @IsEnum(CompanyStatus)
  @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.PENDING })
  status: CompanyStatus;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'managerId',
    referencedColumnName: 'id',
  })
  Manager: User;

  @OneToMany(() => User, (User) => User.Company)
  // @JoinColumn({ referencedColumnName: 'companyId' })
  Employees: User[];

  @OneToMany(() => Vacancy, (vacancy) => vacancy.Company)
  Vacancies: Vacancy[];

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  description01: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  description02: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Image)
  @Column({ nullable: true, type: 'simple-json' })
  coverImage: Image;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Image)
  @Column({ nullable: true, type: 'simple-json' })
  image: Image;
}
