// Gestión de trabajadores
const trabajadoresTable = document.getElementById('trabajadores-table');
const newWorkerBtn = document.getElementById('new-worker-btn');
const modal = document.getElementById('modal');
const modalFormContainer = document.getElementById('modal-form-container');
const closeModal = document.querySelector('.close');

// Crear nuevo trabajador
newWorkerBtn.addEventListener('click', () => {
    showTrabajadorForm();
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Función para mostrar formulario de nuevo trabajador
function showTrabajadorForm(trabajadorId = null) {
    let trabajador = null;
    
    const formHTML = `
        <h3>${trabajadorId ? 'Editar' : 'Nuevo'} Trabajador</h3>
        <form id="trabajador-form" class="form-modal">
            <div class="form-group">
                <label for="nombre">Nombre completo</label>
                <input type="text" id="nombre" required>
            </div>
            <div class="form-group">
                <label for="identificacion">Identificación</label>
                <input type="text" id="identificacion" required>
            </div>
            <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono">
            </div>
            <div class="form-group">
                <label for="direccion">Dirección</label>
                <input type="text" id="direccion">
            </div>
            <div class="form-group">
                <label for="fecha-ingreso">Fecha de ingreso</label>
                <input type="date" id="fecha-ingreso" required>
            </div>
            <div class="form-buttons">
                <button type="button" id="cancel-trabajador" class="btn">Cancelar</button>
                <button type="submit" class="btn">Guardar</button>
            </div>
        </form>
    `;
    
    modalFormContainer.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // Si es edición, cargamos datos del trabajador
    if (trabajadorId) {
        loadTrabajadorData(trabajadorId);
    } else {
        // Para nuevo trabajador, establecemos la fecha actual como fecha de ingreso
        document.getElementById('fecha-ingreso').valueAsDate = new Date();
    }
    
    // Eventos del formulario
    document.getElementById('cancel-trabajador').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('trabajador-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTrabajador(trabajadorId);
    });
}

// Cargar datos de un trabajador para edición
async function loadTrabajadorData(trabajadorId) {
    try {
        const doc = await db.collection('trabajadores').doc(trabajadorId).get();
        if (doc.exists) {
            const trabajador = doc.data();
            document.getElementById('nombre').value = trabajador.nombre;
            document.getElementById('identificacion').value = trabajador.identificacion;
            document.getElementById('telefono').value = trabajador.telefono || '';
            document.getElementById('direccion').value = trabajador.direccion || '';
            
            // Convertir timestamp a formato de fecha para input date
            if (trabajador.fechaIngreso) {
                const fecha = trabajador.fechaIngreso.toDate();
                document.getElementById('fecha-ingreso').valueAsDate = fecha;
            }
        }
    } catch (error) {
        console.error('Error al cargar datos del trabajador:', error);
        alert('Error al cargar datos del trabajador');
    }
}

// Guardar trabajador (crear o actualizar)
async function saveTrabajador(trabajadorId) {
    const nombre = document.getElementById('nombre').value;
    const identificacion = document.getElementById('identificacion').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const fechaIngreso = document.getElementById('fecha-ingreso').valueAsDate;
    
    const trabajadorData = {
        nombre,
        identificacion,
        telefono,
        direccion,
        fechaIngreso: firebase.firestore.Timestamp.fromDate(fechaIngreso),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (trabajadorId) {
            // Actualizar trabajador existente
            await db.collection('trabajadores').doc(trabajadorId).update(trabajadorData);
            console.log('Trabajador actualizado con ID:', trabajadorId);
        } else {
            // Verificar si ya existe un trabajador con la misma identificación
            const querySnap = await db.collection('trabajadores')
                .where('identificacion', '==', identificacion)
                .get();
                
            if (!querySnap.empty) {
                alert('Ya existe un trabajador con esta identificación');
                return;
            }
            
            // Crear nuevo trabajador
            trabajadorData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection('trabajadores').add(trabajadorData);
            console.log('Nuevo trabajador creado con ID:', docRef.id);
        }
        
        modal.style.display = 'none';
        loadTrabajadores(); // Recargar lista de trabajadores
    } catch (error) {
        console.error('Error al guardar trabajador:', error);
        alert('Error al guardar trabajador: ' + error.message);
    }
}

// Cargar lista de trabajadores
async function loadTrabajadores() {
    try {
        const snapshot = await db.collection('trabajadores')
            .orderBy('nombre')
            .get();
            
        let html = '';
        
        snapshot.forEach(doc => {
            const trabajador = doc.data();
            const fecha = trabajador.fechaIngreso ? trabajador.fechaIngreso.toDate().toLocaleDateString() : '';
            
            html += `
                <tr>
                    <td>${trabajador.nombre}</td>
                    <td>${trabajador.identificacion}</td>
                    <td>${trabajador.telefono || ''}</td>
                    <td>${trabajador.direccion || ''}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-small edit-worker" data-id="${doc.id}">Editar</button>
                        <button class="btn-small delete-worker" data-id="${doc.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        if (html === '') {
            html = '<tr><td colspan="6" class="text-center">No hay trabajadores registrados</td></tr>';
        }
        
        trabajadoresTable.innerHTML = html;
        
        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.edit-worker').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trabajadorId = e.target.getAttribute('data-id');
                showTrabajadorForm(trabajadorId);
            });
        });
        
        document.querySelectorAll('.delete-worker').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trabajadorId = e.target.getAttribute('data-id');
                deleteTrabajador(trabajadorId);
            });
        });
        
        // Actualizar contador en dashboard
        document.getElementById('total-trabajadores').textContent = snapshot.size;
        
    } catch (error) {
        console.error('Error al cargar trabajadores:', error);
        alert('Error al cargar los trabajadores');
    }
}

// Eliminar trabajador
async function deleteTrabajador(trabajadorId) {
    if (confirm('¿Estás seguro de que deseas eliminar este trabajador? Esta acción no se puede deshacer.')) {
        try {
            // Verificar si el trabajador tiene jornales asociados
            const jornalesSnap = await db.collection('jornales')
                .where('trabajadorId', '==', trabajadorId)
                .limit(1)
                .get();
                
            if (!jornalesSnap.empty) {
                alert('No se puede eliminar este trabajador porque tiene jornales asociados.');
                return;
            }
            
            await db.collection('trabajadores').doc(trabajadorId).delete();
            console.log('Trabajador eliminado:', trabajadorId);
            loadTrabajadores();
        } catch (error) {
            console.error('Error al eliminar trabajador:', error);
            alert('Error al eliminar el trabajador');
        }
    }
}

// Exportar función para usar en otros archivos
window.getTrabajadoresForSelect = async function(selectElement, includeAll = false) {
    try {
        const snapshot = await db.collection('trabajadores')
            .orderBy('nombre')
            .get();
            
        let options = '<option value="">Seleccione un trabajador</option>';
        
        // Agregar opción "Todos" para los filtros si se especifica
        if (includeAll) {
            options = '<option value="todos">Todos</option>';
        }
        
        snapshot.forEach(doc => {
            const trabajador = doc.data();
            options += `<option value="${doc.id}">${trabajador.nombre}</option>`;
        });
        
        selectElement.innerHTML = options;
    } catch (error) {
        console.error('Error al cargar trabajadores para select:', error);
    }
}