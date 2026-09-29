export class Library<T extends { id: string }> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = initialItems;
  }

  public add(item: T): void {
    if (!this.items.some(i => i.id === item.id)) {
      this.items.push(item);
    }
  }

  public remove(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  public find(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  public getAll(): T[] {
    return [...this.items];
  }

  public search(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}
