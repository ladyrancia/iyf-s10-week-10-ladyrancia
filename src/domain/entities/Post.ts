import { UniqueEntityId } from './PostId';

export interface PostProps {
  title: string;
  content: string;
  author: string;
  authorId?: string;
  status: PostStatus;
  slug: string;
  tags: string[];
  likes: number;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  flagged?: boolean;
  flagReason?: string;
  moderationNote?: string;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export class Post {
  private readonly props: PostProps;
  private readonly id: UniqueEntityId;

  private constructor(props: PostProps, id?: UniqueEntityId) {
    this.props = props;
    this.id = id || new UniqueEntityId();
  }

  public static create(
    props: Omit<PostProps, 'createdAt' | 'updatedAt' | 'likes' | 'status' | 'slug'>,
    id?: UniqueEntityId
  ): Post {
    const now = new Date();

    // Generate SEO-friendly slug from title
    const slug = this.generateSlug(props.title);

    return new Post(
      {
        ...props,
        slug,
        status: 'draft',
        likes: 0,
        createdAt: now,
        updatedAt: now
      },
      id
    );
  }

  public publish(): void {
    if (this.props.status === 'published') {
      throw new Error('Post is already published');
    }
    this.props.status = 'published';
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public unpublish(): void {
    if (this.props.status !== 'published') {
      throw new Error('Post is not published');
    }
    this.props.status = 'draft';
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    if (this.props.status === 'archived') {
      throw new Error('Post is already archived');
    }
    this.props.status = 'archived';
    this.props.updatedAt = new Date();
  }

  public updateContent(title: string, content: string): void {
    if (title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters');
    }

    this.props.title = title.trim();
    this.props.content = content.trim();
    this.props.slug = this.generateSlug(title);
    this.props.updatedAt = new Date();
  }

  public incrementLikes(): void {
    this.props.likes++;
  }

  public decrementLikes(): void {
    if (this.props.likes <= 0) {
      throw new Error('Cannot decrement: likes already at minimum');
    }
    this.props.likes--;
  }

  public flag(reason: string): void {
    this.props.flagged = true;
    this.props.flagReason = reason;
  }

  public moderate(note?: string): void {
    this.props.flagged = false;
    this.props.flagReason = undefined;
    this.props.moderationNote = note;
  }

  public addTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim();
    if (!this.props.tags.includes(normalizedTag)) {
      this.props.tags.push(normalizedTag);
    }
  }

  public removeTag(tag: string): void {
    this.props.tags = this.props.tags.filter(t => t !== tag.toLowerCase().trim());
  }

  public getTitle(): string {
    return this.props.title;
  }

  public getContent(): string {
    return this.props.content;
  }

  public getAuthor(): string {
    return this.props.author;
  }

  public getSlug(): string {
    return this.props.slug;
  }

  public getStatus(): PostStatus {
    return this.props.status;
  }

  public isFlagged(): boolean {
    return this.props.flagged || false;
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getProps(): Readonly<PostProps> {
    return Object.freeze({ ...this.props });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
