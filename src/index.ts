import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

import { Book } from './models/Book';
import { User } from './models/User';
import { Library } from './services/Library';
import { Storage } from './services/Storage';
import { AppRenderer } from './ui/render';

document.addEventListener('DOMContentLoaded', () => {
  const booksData = Storage.load<any[]>('books') || [];
  const usersData = Storage.load<any[]>('users') || [];

  const books = booksData.map(b => new Book(b.id, b.title, b.author, b.year, b.isBorrowed));
  const users = usersData.map(u => new User(u.id, u.name, u.email, u.borrowedBooks || []));

  const bookLibrary = new Library<Book>(books);
  const userLibrary = new Library<User>(users);

  const renderer = new AppRenderer('app', bookLibrary, userLibrary);
  renderer.render();
});
