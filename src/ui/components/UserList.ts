import { User } from '../../models/User';

export const createUserList = (
  users: User[],
  onDelete: (userId: string) => void,
  page: number = 1
): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'card mb-4';

  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIdx, startIdx + itemsPerPage);

  const header = document.createElement('div');
  header.className = 'card-header bg-light fw-bold';
  header.textContent = 'Список Користувачів';

  const body = document.createElement('div');
  body.className = 'card-body p-0';

  const ul = document.createElement('ul');
  ul.className = 'list-group list-group-flush';

  if (users.length === 0) {
    ul.innerHTML = `<li class="list-group-item text-muted">Немає користувачів</li>`;
  } else {
    paginatedUsers.forEach(user => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      const userInfo = document.createElement('span');
      userInfo.textContent = `${user.id} ${user.name} (${user.email})`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.onclick = () => onDelete(user.id);

      li.appendChild(userInfo);
      li.appendChild(deleteBtn);
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
