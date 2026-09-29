export class NotificationService {
  public static notify(message: string, isError: boolean = false): void {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 position-fixed bottom-0 end-0 m-3 ${
      isError ? 'bg-danger' : 'bg-success'
    }`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.zIndex = '1055';

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    document.body.appendChild(toast);

    // Bootstrap toast init (we can just manually show and hide after timeout)
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  public static showModal(title: string, message: string): void {
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop fade show';
    
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.setAttribute('tabindex', '-1');

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Зрозуміло!</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.remove();
      modalBackdrop.remove();
    };

    modal.querySelector('.btn-close')?.addEventListener('click', closeModal);
    modal.querySelector('.btn-primary')?.addEventListener('click', closeModal);
  }
}
