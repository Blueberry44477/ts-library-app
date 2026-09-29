import { Validation } from '../../utils/validators';
import { generateId } from '../../utils/idGenerator';
import { User } from '../../models/User';

export const createUserForm = (onSubmit: (user: User) => void): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'card mb-4';

  container.innerHTML = `
    <div class="card-header bg-light fw-bold">Додати Користувача</div>
    <div class="card-body">
      <form id="user-form">
        <div class="mb-3">
          <input type="text" class="form-control" id="user-name" placeholder="Ім'я">
          <div class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" id="user-email" placeholder="Email">
          <div class="invalid-feedback"></div>
        </div>
        <button type="submit" class="btn btn-success">Додати Користувача</button>
      </form>
    </div>
  `;

  const form = container.querySelector('#user-form') as HTMLFormElement;
  const nameInput = container.querySelector('#user-name') as HTMLInputElement;
  const emailInput = container.querySelector('#user-email') as HTMLInputElement;

  const resetErrors = () => {
    [nameInput, emailInput].forEach(input => {
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

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const id = generateId(); // Auto-generate ID since ID input isn't shown in UI based on screenshots

    const errors = Validation.validateUser(id, name, email);
    if (errors.length > 0) {
      if (!Validation.isRequired(name)) showError(nameInput, 'Це поле є обов’язковим');
      if (!Validation.isRequired(email)) {
        showError(emailInput, 'Це поле є обов’язковим');
      } else if (!Validation.isValidEmail(email)) {
        showError(emailInput, 'Некоректний формат email');
      }
      return;
    }

    const newUser = new User(id, name, email);
    onSubmit(newUser);
    form.reset();
  });

  return container;
};
