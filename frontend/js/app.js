const form = document.getElementById('visitor-form');
const messageBox = document.getElementById('message');
const tableBody = document.getElementById('visitors-table-body');
const refreshButton = document.getElementById('refresh-btn');
const submitButton = form.querySelector('button[type="submit"]');
const cancelEditButton = document.getElementById('cancel-edit-btn');

let editingId = null;

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function setLoadingState(isLoading) {
  if (submitButton) {
    submitButton.disabled = isLoading;
    if (isLoading) {
      submitButton.textContent = editingId ? 'Actualizando...' : 'Registrando...';
    } else {
      submitButton.textContent = editingId ? 'Guardar cambios' : 'Registrar visitante';
    }
  }
  if (cancelEditButton) {
    cancelEditButton.disabled = isLoading;
  }
}

function setEditMode(visitor) {
  editingId = visitor.id;
  document.getElementById('nombre').value = visitor.nombre ?? '';
  document.getElementById('correo').value = visitor.correo ?? '';
  document.getElementById('categoria').value = visitor.categoria_entrada ?? visitor.categoria ?? '';
  if (submitButton) {
    submitButton.textContent = 'Guardar cambios';
  }
  if (cancelEditButton) {
    cancelEditButton.hidden = false;
  }
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearEditMode() {
  editingId = null;
  form.reset();
  if (submitButton) {
    submitButton.textContent = 'Registrar visitante';
  }
  if (cancelEditButton) {
    cancelEditButton.hidden = true;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderVisitors(visitors) {
  if (!Array.isArray(visitors) || visitors.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty">No hay visitantes registrados.</td></tr>';
    return;
  }

  tableBody.innerHTML = visitors
    .map((visitor) => {
      const id = visitor.id ?? '-';
      const nombre = escapeHtml(visitor.nombre ?? '-');
      const correo = escapeHtml(visitor.correo ?? '-');
      const categoria = escapeHtml(visitor.categoria_entrada ?? visitor.categoria ?? '-');
      const creadoEn = escapeHtml(visitor.creado_en ?? visitor.creadoEn ?? '-');
      const safeId = Number(visitor.id);

      return `
        <tr>
          <td>${id}</td>
          <td>${nombre}</td>
          <td>${correo}</td>
          <td>${categoria}</td>
          <td>${creadoEn}</td>
          <td class="actions">
            <button type="button" class="btn-edit" data-id="${safeId}">Editar</button>
            <button type="button" class="btn-delete" data-id="${safeId}">Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function loadVisitors() {
  try {
    const response = await fetch('/api/visitantes', {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error('No se pudo cargar la lista de visitantes.');
    }

    const data = await response.json();
    const visitors = Array.isArray(data) ? data : data.visitantes ?? [];
    renderVisitors(visitors);
  } catch (error) {
    showMessage(error.message || 'No se pudo cargar la lista.', 'error');
    renderVisitors([]);
  }
}

async function deleteVisitor(id) {
  const confirmed = window.confirm(`¿Eliminar el visitante #${id}?`);
  if (!confirmed) {
    return;
  }

  showMessage('');
  try {
    const response = await fetch(`/api/visitantes/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' }
    });

    if (response.status === 404) {
      throw new Error('El visitante ya no existe.');
    }
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'No se pudo eliminar el visitante.');
    }

    if (editingId === id) {
      clearEditMode();
    }
    showMessage('Visitante eliminado correctamente.', 'success');
    await loadVisitors();
  } catch (error) {
    showMessage(error.message || 'Error inesperado al eliminar visitante.', 'error');
  }
}

tableBody.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const id = Number(target.dataset.id);
  if (!Number.isFinite(id)) {
    return;
  }

  if (target.classList.contains('btn-delete')) {
    await deleteVisitor(id);
    return;
  }

  if (target.classList.contains('btn-edit')) {
    try {
      const response = await fetch('/api/visitantes', {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error('No se pudo cargar el visitante para editar.');
      }
      const data = await response.json();
      const visitors = Array.isArray(data) ? data : data.visitantes ?? [];
      const visitor = visitors.find((item) => Number(item.id) === id);
      if (!visitor) {
        throw new Error('Visitante no encontrado.');
      }
      showMessage('');
      setEditMode(visitor);
    } catch (error) {
      showMessage(error.message || 'No se pudo iniciar la edición.', 'error');
    }
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('');
  setLoadingState(true);

  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    categoria_entrada: document.getElementById('categoria').value
  };

  if (!payload.nombre || !payload.correo || !payload.categoria_entrada) {
    showMessage('Complete todos los campos para registrar al visitante.', 'error');
    setLoadingState(false);
    return;
  }

  const isEdit = editingId !== null;
  const url = isEdit ? `/api/visitantes/${editingId}` : '/api/visitantes';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || (isEdit ? 'No se pudo actualizar el visitante.' : 'No se pudo registrar el visitante.'));
    }

    clearEditMode();
    showMessage(
      isEdit ? 'Visitante actualizado correctamente.' : 'Visitante registrado correctamente.',
      'success'
    );
    await loadVisitors();
  } catch (error) {
    showMessage(error.message || 'Error inesperado al guardar visitante.', 'error');
  } finally {
    setLoadingState(false);
  }
});

refreshButton.addEventListener('click', () => {
  loadVisitors();
});

cancelEditButton.addEventListener('click', () => {
  clearEditMode();
  showMessage('Edición cancelada.', 'success');
});

loadVisitors();
