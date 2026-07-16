const form = document.getElementById('visitor-form');
const messageBox = document.getElementById('message');
const tableBody = document.getElementById('visitors-table-body');
const refreshButton = document.getElementById('refresh-btn');

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function setLoadingState(isLoading) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Registrando...' : 'Registrar visitante';
  }
}

function renderVisitors(visitors) {
  if (!Array.isArray(visitors) || visitors.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">No hay visitantes registrados.</td></tr>';
    return;
  }

  tableBody.innerHTML = visitors
    .map((visitor) => {
      const id = visitor.id ?? '-';
      const nombre = visitor.nombre ?? '-';
      const correo = visitor.correo ?? '-';
      const categoria = visitor.categoria_entrada ?? visitor.categoria ?? '-';
      const creadoEn = visitor.creado_en ?? visitor.creadoEn ?? '-';

      return `
        <tr>
          <td>${id}</td>
          <td>${nombre}</td>
          <td>${correo}</td>
          <td>${categoria}</td>
          <td>${creadoEn}</td>
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

  try {
    const response = await fetch('/api/visitantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'No se pudo registrar el visitante.');
    }

    form.reset();
    showMessage('Visitante registrado correctamente.', 'success');
    await loadVisitors();
  } catch (error) {
    showMessage(error.message || 'Error inesperado al registrar visitante.', 'error');
  } finally {
    setLoadingState(false);
  }
});

refreshButton.addEventListener('click', () => {
  loadVisitors();
});

loadVisitors();
