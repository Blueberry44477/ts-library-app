import { createBookForm } from './components/BookForm';
import { createUserForm } from './components/UserForm';
import { createBookList } from './components/BookList';
import { createUserList } from './components/UserList';
import { createBorrowModal } from './components/Modal';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { NotificationService } from '../services/NotificationService';

export class AppRenderer {
  private container: HTMLElement;
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;
  
  private bookPage: number = 1;
  private userPage: number = 1;
  private searchQuery: string = '';

  constructor(
    containerId: string,
    bookLibrary: Library<Book>,
    userLibrary: Library<User>
  ) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(\`Container \${containerId} not found\`);
    this.container = el;
    this.bookLibrary = bookLibrary;
    this.userLibrary = userLibrary;
  }

  public render(): void {
    this.container.innerHTML = '';
    
    // Header
    const header = document.createElement('h2');
    header.className = 'text-center my-4';
    header.textContent = 'Система Управління Бібліотекою';
    
    // Search
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mb-4';
    searchContainer.innerHTML = \`<input type="text" class="form-control" id="search-input" placeholder="Пошук книг за назвою або автором..." value="\${this.searchQuery}">\`;
    
    const root = document.createElement('div');
    root.className = 'container';
    
    root.appendChild(header);
    root.appendChild(searchContainer);

    // Book Form
    root.appendChild(createBookForm((book) => {
      this.bookLibrary.add(book);
      Storage.save('books', this.bookLibrary.getAll());
      this.render();
    }));

    // User Form
    root.appendChild(createUserForm((user) => {
      this.userLibrary.add(user);
      Storage.save('users', this.userLibrary.getAll());
      this.render();
    }));

    // Search filter
    let displayedBooks = this.bookLibrary.getAll();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      displayedBooks = this.bookLibrary.search(
        b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    // Book List
    const bookListEl = createBookList(
      displayedBooks,
      (bookId) => this.handleBorrowClick(bookId),
      (bookId) => this.handleReturnClick(bookId),
      (bookId) => {
        this.bookLibrary.remove(bookId);
        Storage.save('books', this.bookLibrary.getAll());
        this.render();
      },
      this.bookPage
    );
    bookListEl.addEventListener('page-change', (e: Event) => {
      this.bookPage = (e as CustomEvent).detail;
      this.render();
    });
    root.appendChild(bookListEl);

    // User List
    const userListEl = createUserList(
      this.userLibrary.getAll(),
      (userId) => {
        this.userLibrary.remove(userId);
        Storage.save('users', this.userLibrary.getAll());
        this.render();
      },
      this.userPage
    );
    userListEl.addEventListener('page-change', (e: Event) => {
      this.userPage = (e as CustomEvent).detail;
      this.render();
    });
    root.appendChild(userListEl);

    this.container.appendChild(root);

    // Reattach search listener
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.bookPage = 1;
        this.render();
      });
      // Focus if needed, but doing it blindly will disrupt typing. We can skip auto-focus to avoid jumping.
    }
  }

  private handleBorrowClick(bookId: string): void {
    const modal = createBorrowModal((userId) => {
      const user = this.userLibrary.find(userId);
      if (!user) {
        NotificationService.notify('Користувача не знайдено', true);
        return;
      }
      
      const book = this.bookLibrary.find(bookId);
      if (!book) return;

      try {
        user.borrowBook(book.id);
        book.borrowBook();
        
        Storage.save('users', this.userLibrary.getAll());
        Storage.save('books', this.bookLibrary.getAll());
        
        NotificationService.notify('Книгу успішно позичено!');
        NotificationService.showModal('Успіх', \`Книга "\${book.title}" була позичена користувачем \${user.name}\`);
        this.render();
      } catch (e: any) {
        NotificationService.showModal('Помилка', e.message || 'Не вдалося позичити книгу');
      }
    }, () => {});
    
    document.body.appendChild(modal);
  }

  private handleReturnClick(bookId: string): void {
    const book = this.bookLibrary.find(bookId);
    if (!book) return;

    // Find the user who borrowed it
    const users = this.userLibrary.getAll();
    const user = users.find(u => u.borrowedBooks.includes(bookId));
    
    if (user) {
      user.returnBook(bookId);
      Storage.save('users', this.userLibrary.getAll());
    }
    
    book.returnBook();
    Storage.save('books', this.bookLibrary.getAll());
    
    NotificationService.notify('Книгу успішно повернуто!');
    NotificationService.showModal('Успіх', \`Книга "\${book.title}" була повернута.\`);
    this.render();
  }
}
