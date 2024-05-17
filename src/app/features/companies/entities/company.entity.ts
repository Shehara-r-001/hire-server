import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/app/shared/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';

export enum CompanyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity()
export class Company extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  field: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: false })
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
  Employees: User[];

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 1000 })
  description01: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', length: 1000, nullable: true })
  description02: string;

  @IsOptional()
  @IsISO8601()
  @Column({ type: 'time with time zone' })
  createdAt: Date;

  @IsOptional()
  @IsISO8601()
  @Column({ type: 'time with time zone', nullable: true })
  updatedAt: Date;
}
