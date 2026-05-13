export interface UniqueEntityID {
  value: string;
}

export class UniqueEntityId {
  private readonly id: string;

  constructor(id?: string) {
    this.id = id || this.generateUUID();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public getValue(): string {
    return this.id;
  }

  public equals(other: UniqueEntityId): boolean {
    return this.id === other.getValue();
  }

  public toString(): string {
    return this.id;
  }
}
