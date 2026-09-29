import { Validation } from '../../utils/validators';
import { generateId } from '../../utils/idGenerator';
import { Book } from '../../models/Book';

export const createBookForm = (onSubmit: (book: Book) => void): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'card mb-4';

  container.innerHTML = `
    <div class="card-header bg-light fw-bold">Додати Книгу</div>
    <div class="card-body">
      <form id="book-form">
        <div class="mb-3">
          <input type="text" class="form-control" id="book-title" placeholder="Назва книги">
          <div class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" id="book-author" placeholder="Автор">
          <div class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" id="book-year" placeholder="Рік видання">
          <div class="invalid-feedback"></div>
        </div>
        <button type="submit" class="btn btn-success">Додати Книгу</button>
      </form>
    </div>
  `;

  const form = container.querySelector('#book-form') as HTMLFormElement;
  const titleInput = container.querySelector('#book-title') as HTMLInputElement;
  const authorInput = container.querySelector('#book-author') as HTMLInputElement;
  const yearInput = container.querySelector('#book-year') as HTMLInputElement;

  const resetErrors = () => {
    [titleInput, authorInput, yearInput].forEach(input => {
      input.classList.remove('is-invalid');
      const feedback = input.nextElementSibling;
      if (feedback) feedback.textContent = '';
    });
  };

  const showError = (input: HTMLInputElement, message: string) => {
    input.classList.add('is-invalid');
    const feedback = input.nextElementSibling;
    if (feedback) feedback.textContent = message;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetErrors();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = yearInput.value.trim();

    const errors = Validation.validateBook(title, author, year);
    if (errors.length > 0) {
      if (!Validation.isRequired(title)) showError(titleInput, 'Це поле є обов’язковим');
      if (!Validation.isRequired(author)) showError(authorInput, 'Це поле є обов’язковим');
      if (!Validation.isRequired(year)) {
        showError(yearInput, 'Це поле є обов’язковим');
      } else if (!Validation.isNumberOnly(year)) {
        showError(yearInput, 'Рік має містити лише цифри');
      } else if (!Validation.isYear(year)) {
        showError(yearInput, 'Некоректний рік видання');
      }
      return;
    }

    const newBook = new Book(generateId(), title, author, parseInt(year, 10));
    onSubmit(newBook);
    form.reset();
  });

  return container;
};
