import { IsISO8601, IsOptional } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @IsISO8601()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @IsOptional()
  @IsISO8601()
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;
}
