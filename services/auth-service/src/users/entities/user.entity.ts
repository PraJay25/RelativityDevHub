import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

/**
 * User roles enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  REVIEWER = 'reviewer',
}

/**
 * User status enumeration
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * User entity representing a system user
 * Handles authentication, authorization, and user management
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['role'])
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'User email address' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @ApiProperty({ description: 'User first name' })
  @Column({ type: 'varchar', length: 100, nullable: false, name: 'first_name' })
  firstName!: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ type: 'varchar', length: 100, nullable: false, name: 'last_name' })
  lastName!: string;

  @ApiProperty({ description: 'User password (hashed)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  password!: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @ApiProperty({ description: 'Whether user email is verified' })
  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified!: boolean;

  @ApiProperty({ description: 'Last login timestamp' })
  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt!: Date | null;

  @ApiProperty({ description: 'User creation timestamp' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'User last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Virtual property for full name
   * @returns The user's full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Hash password before insert/update
   * Uses bcrypt with 12 salt rounds
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  /**
   * Compare password with hashed password
   * @param candidatePassword - The password to compare
   * @returns Promise<boolean> - True if passwords match
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Check if user is active
   * @returns boolean - True if user is active
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user has admin role
   * @returns boolean - True if user is admin
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Check if user has reviewer role
   * @returns boolean - True if user is reviewer
   */
  isReviewer(): boolean {
    return this.role === UserRole.REVIEWER;
  }
}
