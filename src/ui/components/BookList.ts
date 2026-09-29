import { Book } from '../../models/Book';

export const createBookList = (
  books: Book[],
  onBorrow: (bookId: string) => void,
  onReturn: (bookId: string) => void,
  onDelete: (bookId: string) => void,
  page: number = 1
): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'card mb-4';

  const itemsPerPage = 5;
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedBooks = books.slice(startIdx, startIdx + itemsPerPage);

  const header = document.createElement('div');
  header.className = 'card-header bg-light fw-bold d-flex justify-content-between align-items-center';
  header.innerHTML = `<span>Список Книг</span>`;

  const body = document.createElement('div');
  body.className = 'card-body p-0';

  const ul = document.createElement('ul');
  ul.className = 'list-group list-group-flush';

  if (books.length === 0) {
    ul.innerHTML = `<li class="list-group-item text-muted">Немає книг</li>`;
  } else {
    paginatedBooks.forEach(book => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      const bookInfo = document.createElement('span');
      bookInfo.textContent = `${book.title} by ${book.author} (${book.year})`;

      const btnGroup = document.createElement('div');
      
      if (book.isBorrowed) {
        const returnBtn = document.createElement('button');
        returnBtn.className = 'btn btn-sm btn-warning me-2';
        returnBtn.textContent = 'Повернути';
        returnBtn.onclick = () => onReturn(book.id);
        btnGroup.appendChild(returnBtn);
      } else {
        const borrowBtn = document.createElement('button');
        borrowBtn.className = 'btn btn-sm btn-primary me-2';
        borrowBtn.textContent = 'Позичити';
        borrowBtn.onclick = () => onBorrow(book.id);
        btnGroup.appendChild(borrowBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.onclick = () => onDelete(book.id);
      btnGroup.appendChild(deleteBtn);

      li.appendChild(bookInfo);
      li.appendChild(btnGroup);
      ul.appendChild(li);
    });
  }

  body.appendChild(ul);
  container.appendChild(header);
  container.appendChild(body);

  // Pagination UI
  if (totalPages > 1) {
    const footer = document.createElement('div');
    footer.className = 'card-footer d-flex justify-content-center';
    const nav = document.createElement('nav');
    const ulPagination = document.createElement('ul');
    ulPagination.className = 'pagination pagination-sm mb-0';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === page ? 'active' : ''}`;
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = i.toString();
      a.onclick = (e) => {
        e.preventDefault();
        container.dispatchEvent(new CustomEvent('page-change', { detail: i }));
      };
      li.appendChild(a);
      ulPagination.appendChild(li);
    }
    nav.appendChild(ulPagination);
    footer.appendChild(nav);
    container.appendChild(footer);
  }

  return container;
};
