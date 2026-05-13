import { UniqueEntityId } from './PostId';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserProps {
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  avatar?: string;
  bio?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class User {
  private readonly props: UserProps;
  private readonly id: UniqueEntityId;

  private constructor(props: UserProps, id?: UniqueEntityId) {
    this.props = props;
    this.id = id || new UniqueEntityId();
  }

  public static create(
    props: Omit<UserProps, 'createdAt' | 'updatedAt' | 'role' | 'emailVerified'>,
    id?: UniqueEntityId
  ): User {
    const now = new Date();

    return new User(
      {
        ...props,
        role: 'user',
        emailVerified: false,
        createdAt: now,
        updatedAt: now
      },
      id
    );
  }

  public updateProfile(name: string, bio?: string, avatar?: string): void {
    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    this.props.name = name.trim();
    if (bio !== undefined) this.props.bio = bio.trim();
    if (avatar !== undefined) this.props.avatar = avatar;
    this.props.updatedAt = new Date();
  }

  public verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.updatedAt = new Date();
  }

  public updateRole(role: UserRole, performedBy: User): void {
    if (performedBy.props.role !== 'admin') {
      throw new Error('Only admins can change user roles');
    }
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  public recordLogin(): void {
    this.props.lastLogin = new Date();
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getName(): string {
    return this.props.name;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getRole(): UserRole {
    return this.props.role;
  }

  public isAdmin(): boolean {
    return this.props.role === 'admin';
  }

  public isModerator(): boolean {
    return this.props.role === 'moderator';
  }

  public isEmailVerified(): boolean {
    return this.props.emailVerified;
  }

  public getProps(): Readonly<UserProps> {
    return Object.freeze({ ...this.props });
  }
}
