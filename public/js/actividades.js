// Gestión de actividades
const actividadesTable = document.getElementById('actividades-table');
const newActivityBtn = document.getElementById('new-activity-btn');

// Crear nueva actividad
newActivityBtn.addEventListener('click', () => {
    showActividadForm();
});

// Función para mostrar formulario de nueva actividad
function showActividadForm(actividadId = null) {
    const formHTML = `
        <h3>${actividadId ? 'Editar' : 'Nueva'} Actividad</h3>
        <form id="actividad-form" class="form-modal">
            <div class="form-group">
                <label for="nombre-actividad">Nombre de la actividad</label>
                <input type="text" id="nombre-actividad" required>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="valor-hora">Valor por hora</label>
                <input type="number" id="valor-hora" min="0" step="1000" required>
            </div>
            <div class="form-buttons">
                <button type="button" id="cancel-actividad" class="btn">Cancelar</button>
                <button type="submit" class="btn">Guardar</button>
            </div>
        </form>
    `;
    
    modalFormContainer.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // Si es edición, cargamos datos de la actividad
    if (actividadId) {
        loadActividadData(actividadId);
    }
    
    // Eventos del formulario
    document.getElementById('cancel-actividad').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('actividad-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveActividad(actividadId);
    });
}

// Cargar datos de una actividad para edición
async function loadActividadData(actividadId) {
    try {
        const doc = await db.collection('actividades').doc(actividadId).get();
        if (doc.exists) {
            const actividad = doc.data();
            document.getElementById('nombre-actividad').value = actividad.nombre;
            document.getElementById('descripcion').value = actividad.descripcion || '';
            document.getElementById('valor-hora').value = actividad.valorHora;
        }
    } catch (error) {
        console.error('Error al cargar datos de la actividad:', error);
        alert('Error al cargar datos de la actividad');
    }
}

// Guardar actividad (crear o actualizar)
async function saveActividad(actividadId) {
    const nombre = document.getElementById('nombre-actividad').value;
    const descripcion = document.getElementById('descripcion').value;
    const valorHora = parseInt(document.getElementById('valor-hora').value);
    
    const actividadData = {
        nombre,
        descripcion,
        valorHora,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (actividadId) {
            // Actualizar actividad existente
            await db.collection('actividades').doc(actividadId).update(actividadData);
            console.log('Actividad actualizada con ID:', actividadId);
        } else {
            // Verificar si ya existe una actividad con el mismo nombre
            const querySnap = await db.collection('actividades')
                .where('nombre', '==', nombre)
                .get();
                
            if (!querySnap.empty) {
                alert('Ya existe una actividad con este nombre');
                return;
            }
            
            // Crear nueva actividad
            actividadData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection('actividades').add(actividadData);
            console.log('Nueva actividad creada con ID:', docRef.id);
        }
        
        modal.style.display = 'none';
        loadActividades(); // Recargar lista de actividades
    } catch (error) {
        console.error('Error al guardar actividad:', error);
        alert('Error al guardar actividad: ' + error.message);
    }
}

// Cargar lista de actividades
async function loadActividades() {
    try {
        const snapshot = await db.collection('actividades')
            .orderBy('nombre')
            .get();
            
        let html = '';
        
        snapshot.forEach(doc => {
            const actividad = doc.data();
            
            html += `
                <tr>
                    <td>${actividad.nombre}</td>
                    <td>${actividad.descripcion || ''}</td>
                    <td>$${actividad.valorHora.toLocaleString()}</td>
                    <td>
                        <button class="btn-small edit-activity" data-id="${doc.id}">Editar</button>
                        <button class="btn-small delete-activity" data-id="${doc.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        if (html === '') {
            html = '<tr><td colspan="4" class="text-center">No hay actividades registradas</td></tr>';
        }
        
        actividadesTable.innerHTML = html;
        
        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.edit-activity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.target.getAttribute('data-id');
                showActividadForm(actividadId);
            });
        });
        
        document.querySelectorAll('.delete-activity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actividadId = e.target.getAttribute('data-id');
                deleteActividad(actividadId);
            });
        });
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        alert('Error al cargar las actividades');
    }
}

// Eliminar actividad
async function deleteActividad(actividadId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
        try {
            // Verificar si la actividad tiene jornales asociados
            const jornalesSnap = await db.collection('jornales')
                .where('actividadId', '==', actividadId)
                .limit(1)
                .get();
                
            if (!jornalesSnap.empty) {
                alert('No se puede eliminar esta actividad porque tiene jornales asociados.');
                return;
            }
            
            await db.collection('actividades').doc(actividadId).delete();
            console.log('Actividad eliminada:', actividadId);
            loadActividades();
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            alert('Error al eliminar la actividad');
        }
    }
}

// Exportar función para usar en otros archivos
window.getActividadesForSelect = async function(selectElement) {
    try {
        const snapshot = await db.collection('actividades')
            .orderBy('nombre')
            .get();
            
        let options = '<option value="">Seleccione una actividad</option>';
        
        snapshot.forEach(doc => {
            const actividad = doc.data();
            options += `<option value="${doc.id}" data-valor="${actividad.valorHora}">${actividad.nombre}</option>`;
        });
        
        selectElement.innerHTML = options;
    } catch (error) {
        console.error('Error al cargar actividades para select:', error);
    }
}