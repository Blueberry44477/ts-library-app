import { IBook } from './interfaces/IBook';

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false
  ) {}

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getYear(): number {
    return this.year;
  }

  public getIsBorrowed(): boolean {
    return this.isBorrowed;
  }

  public borrowBook(): void {
    this.isBorrowed = true;
  }

  public returnBook(): void {
    this.isBorrowed = false;
  }
}
