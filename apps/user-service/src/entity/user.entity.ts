import { type User, UserConstant, UserRole } from '@template/core';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['username'])
@Index(['deletedAt', 'createdAt'])
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @CreateDateColumn({
    type: 'timestamptz',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  createdAt!: Date;
  @UpdateDateColumn({
    type: 'timestamptz',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updatedAt!: Date;
  @DeleteDateColumn({ type: 'timestamptz', precision: 3, nullable: true })
  deletedAt?: Date | null;

  @Column('enum', { enum: UserRole.enum, default: 'User' })
  role!: UserRole;
  @Column('varchar', { length: UserConstant.USERNAME_MAX_LENGTH, nullable: true })
  username!: string | null;
  @Column('varchar', { length: UserConstant.PASSWORD_HASH_MAX_LENGTH, nullable: true })
  passwordHash?: string | null;

  @Column('varchar', { length: UserConstant.NAME_MAX_LENGTH, nullable: true })
  name!: string | null;
  @Column('varchar', { length: UserConstant.EMAIL_MAX_LENGTH, nullable: true })
  email!: string | null;
  @Column('varchar', { length: UserConstant.PHONE_MAX_LENGTH, nullable: true })
  phone!: string | null;

  @Column({ type: 'timestamptz', precision: 3, nullable: true })
  passwordChangedAt?: Date | null;

  static toModel(entity: UserEntity): User {
    return {
      id: entity.id,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,

      role: entity.role,
      username: entity.username,
      passwordHash: entity.passwordHash,

      name: entity.name,
      email: entity.email,
      phone: entity.phone,

      passwordChangedAt: entity.passwordChangedAt,
    };
  }
}
