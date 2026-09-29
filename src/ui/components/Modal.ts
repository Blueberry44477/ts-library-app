export const createBorrowModal = (
  onSubmit: (userId: string) => void,
  onCancel: () => void
): HTMLElement => {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fade show';
  document.body.appendChild(backdrop);

  const container = document.createElement('div');
  container.className = 'modal fade show';
  container.style.display = 'block';
  container.setAttribute('tabindex', '-1');

  container.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Введіть ID користувача для позичення книги:</h5>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control" id="modal-user-id" placeholder="ID">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Скасувати</button>
          <button type="button" class="btn btn-primary" id="modal-submit">Зберегти</button>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector('#modal-user-id') as HTMLInputElement;
  const closeBtn = container.querySelector('.btn-close') as HTMLButtonElement;
  const cancelBtn = container.querySelector('#modal-cancel') as HTMLButtonElement;
  const submitBtn = container.querySelector('#modal-submit') as HTMLButtonElement;

  const close = () => {
    container.remove();
    backdrop.remove();
  };

  closeBtn.onclick = () => { close(); onCancel(); };
  cancelBtn.onclick = () => { close(); onCancel(); };
  
  submitBtn.onclick = () => {
    const val = input.value.trim();
    if (val) {
      onSubmit(val);
      close();
    } else {
      input.classList.add('is-invalid');
    }
  };

  return container;
};
