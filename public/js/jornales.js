// Gestión de jornales
const jornalesTable = document.getElementById('jornales-table');
const newJornalBtn = document.getElementById('new-jornal-btn');
const dateFilter = document.getElementById('date-filter');
const applyFilter = document.getElementById('apply-filter');
const clearFilter = document.getElementById('clear-filter');

// Variables para filtros
let currentFilter = null;

// Crear nuevo jornal
newJornalBtn.addEventListener('click', () => {
    showJornalForm();
});

// Aplicar filtro de fecha
applyFilter.addEventListener('click', () => {
    if (dateFilter.value) {
        currentFilter = new Date(dateFilter.value);
        loadJornales(currentFilter);
    }
});

// Limpiar filtro
clearFilter.addEventListener('click', () => {
    dateFilter.value = '';
    currentFilter = null;
    loadJornales();
});

// Función para mostrar formulario de nuevo jornal
function showJornalForm(jornalId = null) {
    const formHTML = `
        <h3>${jornalId ? 'Editar' : 'Nuevo'} Jornal</h3>
        <form id="jornal-form" class="form-modal">
            <div class="form-group">
                <label for="fecha-jornal">Fecha</label>
                <input type="date" id="fecha-jornal" required>
            </div>
            <div class="form-group">
                <label for="trabajador-select">Trabajador</label>
                <select id="trabajador-select" required>
                    <option value="">Cargando trabajadores...</option>
                </select>
            </div>
            
            <div>
                <h4>Actividades realizadas</h4>
                <div class="actividades-table-header">
                    <div>Actividad</div>
                    <div>Horas trabajadas</div>
                    <div>Valor por hora</div>
                    <div>Subtotal</div>
                    <div>Acciones</div>
                </div>
                <div id="actividades-container" class="actividades-scroll-container">
                    <div class="actividad-item">
                        <div class="form-group">
                            <select id="actividad-select-0" class="actividad-select" required data-index="0">
                                <option value="">Cargando actividades...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="number" id="horas-0" class="horas-input" min="0.5" max="24" step="0.5" required data-index="0" placeholder="Horas">
                        </div>
                        <div class="form-group">
                            <input type="number" id="valor-hora-jornal-0" class="valor-hora-input" min="0" readonly data-index="0" placeholder="$ Valor/hora">
                        </div>
                        <div class="form-group">
                            <input type="number" id="subtotal-0" class="subtotal-input" readonly data-index="0" placeholder="$ Subtotal">
                        </div>
                        <div class="form-group">
                            <!-- El primer elemento no tiene botón de eliminar -->
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <button type="button" id="add-actividad-btn" class="btn-small">+ Agregar actividad</button>
            </div>
            
            <div class="form-group">
                <label for="total-jornal">Total a pagar</label>
                <input type="number" id="total-jornal" readonly>
            </div>
            
            <div class="form-buttons">
                <button type="button" id="cancel-jornal" class="btn">Cancelar</button>
                <button type="submit" class="btn">Guardar</button>
            </div>
        </form>
    `;
    
    modalFormContainer.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // Cargar selects de trabajadores y actividades
    const trabajadorSelect = document.getElementById('trabajador-select');
    
    window.getTrabajadoresForSelect(trabajadorSelect);
    
    // Para nuevo jornal, establecemos la fecha actual
    if (!jornalId) {
        document.getElementById('fecha-jornal').valueAsDate = new Date();
    }
    
    // Eventos del formulario
    document.getElementById('cancel-jornal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Función para agregar una nueva actividad al formulario
    document.getElementById('add-actividad-btn').addEventListener('click', () => {
        addActividadRow();
    });
    
    // Inicializar eventos para la primera actividad
    setupActividadEvents(0);
    
    // Función para configurar eventos de una actividad
    function setupActividadEvents(index) {
        const actividadSelect = document.getElementById(`actividad-select-${index}`);
        const horasInput = document.getElementById(`horas-${index}`);
        
        // Cargar actividades en el select
        window.getActividadesForSelect(actividadSelect);
        
        // Actualizar valor hora al cambiar actividad
        actividadSelect.addEventListener('change', () => {
            const selectedOption = actividadSelect.options[actividadSelect.selectedIndex];
            const valorHora = selectedOption.getAttribute('data-valor') || 0;
            document.getElementById(`valor-hora-jornal-${index}`).value = valorHora;
            
            // Actualizar subtotal y total
            calcularSubtotal(index);
            calcularTotalJornal();
        });
        
        // Actualizar subtotal y total al cambiar horas
        horasInput.addEventListener('input', () => {
            calcularSubtotal(index);
            calcularTotalJornal();
        });
    }
    
    // Función para agregar una nueva fila de actividad
    function addActividadRow() {
        const container = document.getElementById('actividades-container');
        const index = document.querySelectorAll('.actividad-item').length;
        
        const actividadRow = document.createElement('div');
        actividadRow.className = 'actividad-item';
        actividadRow.innerHTML = `
            <div class="form-group">
                <select id="actividad-select-${index}" class="actividad-select" required data-index="${index}">
                    <option value="">Cargando actividades...</option>
                </select>
            </div>
            <div class="form-group">
                <input type="number" id="horas-${index}" class="horas-input" min="0.5" max="24" step="0.5" required data-index="${index}" placeholder="Horas">
            </div>
            <div class="form-group">
                <input type="number" id="valor-hora-jornal-${index}" class="valor-hora-input" min="0" readonly data-index="${index}" placeholder="$ Valor/hora">
            </div>
            <div class="form-group">
                <input type="number" id="subtotal-${index}" class="subtotal-input" readonly data-index="${index}" placeholder="$ Subtotal">
            </div>
            <div class="form-group">
                <button type="button" class="btn-small remove-actividad" data-index="${index}">Eliminar</button>
            </div>
        `;
        
        container.appendChild(actividadRow);
        
        // Configurar eventos para la nueva actividad
        setupActividadEvents(index);
        
        // Agregar evento para eliminar la actividad
        actividadRow.querySelector('.remove-actividad').addEventListener('click', function() {
            container.removeChild(actividadRow);
            calcularTotalJornal();
        });
    }
    
    // Función para calcular el subtotal de una actividad
    function calcularSubtotal(index) {
        const horas = parseFloat(document.getElementById(`horas-${index}`).value) || 0;
        const valorHora = parseFloat(document.getElementById(`valor-hora-jornal-${index}`).value) || 0;
        const subtotal = horas * valorHora;
        document.getElementById(`subtotal-${index}`).value = subtotal;
    }
    
    // Función para calcular el total del jornal
    function calcularTotalJornal() {
        let total = 0;
        const subtotales = document.querySelectorAll('.subtotal-input');
        
        subtotales.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        
        document.getElementById('total-jornal').value = total;
    }
    
    // Si es edición, cargamos datos del jornal
    if (jornalId) {
        loadJornalData(jornalId);
    }
    
    document.getElementById('jornal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveJornal(jornalId);
    });
}

// Cargar datos de un jornal para edición
async function loadJornalData(jornalId) {
    try {
        const doc = await db.collection('jornales').doc(jornalId).get();
        if (doc.exists) {
            const jornal = doc.data();
            
            // Convertir timestamp a formato de fecha para input date
            if (jornal.fecha) {
                const fecha = jornal.fecha.toDate();
                document.getElementById('fecha-jornal').valueAsDate = fecha;
            }
            
            document.getElementById('total-jornal').value = jornal.total;
            
            // Establecer el trabajador
            setTimeout(() => {
                document.getElementById('trabajador-select').value = jornal.trabajadorId;
            }, 1000);
            
            // Eliminar la primera actividad vacía predeterminada
            const container = document.getElementById('actividades-container');
            const firstActividadItem = container.querySelector('.actividad-item');
            if (firstActividadItem) {
                container.removeChild(firstActividadItem);
            }
            
            // Cargar actividades
            if (jornal.actividades && jornal.actividades.length > 0) {
                jornal.actividades.forEach((actividad, index) => {
                    // Crear una nueva fila para la actividad
                    const actividadRow = document.createElement('div');
                    actividadRow.className = 'actividad-item';
                    actividadRow.innerHTML = `
                        <div class="form-group">
                            <select id="actividad-select-${index}" class="actividad-select" required data-index="${index}">
                                <option value="">Cargando actividades...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="number" id="horas-${index}" class="horas-input" min="0.5" max="24" step="0.5" required data-index="${index}" value="${actividad.horas}" placeholder="Horas">
                        </div>
                        <div class="form-group">
                            <input type="number" id="valor-hora-jornal-${index}" class="valor-hora-input" min="0" readonly data-index="${index}" value="${actividad.valorHora}" placeholder="$ Valor/hora">
                        </div>
                        <div class="form-group">
                            <input type="number" id="subtotal-${index}" class="subtotal-input" readonly data-index="${index}" value="${actividad.subtotal}" placeholder="$ Subtotal">
                        </div>
                        <div class="form-group">
                            ${index > 0 ? `<button type="button" class="btn-small remove-actividad" data-index="${index}">Eliminar</button>` : ''}
                        </div>
                    `;
                    
                    container.appendChild(actividadRow);
                    
                    // Configurar eventos para la actividad
                    setupActividadEvents(index);
                    
                    // Agregar evento para eliminar la actividad
                    if (index > 0) {
                        actividadRow.querySelector('.remove-actividad').addEventListener('click', function() {
                            container.removeChild(actividadRow);
                            calcularTotalJornal();
                        });
                    }
                    
                    // Establecer el valor de la actividad después de cargar las opciones
                    setTimeout(() => {
                        const selectElement = document.getElementById(`actividad-select-${index}`);
                        if (selectElement) {
                            selectElement.value = actividad.actividadId;
                        }
                    }, 1000);
                });
            } else {
                // Si no hay actividades, agregar una fila vacía
                addActividadRow();
            }
        }
    } catch (error) {
        console.error('Error al cargar datos del jornal:', error);
        alert('Error al cargar datos del jornal');
    }
}

// Guardar jornal (crear o actualizar)
async function saveJornal(jornalId) {
    const fecha = document.getElementById('fecha-jornal').valueAsDate;
    const trabajadorId = document.getElementById('trabajador-select').value;
    const total = parseFloat(document.getElementById('total-jornal').value);
    
    // Obtener nombre del trabajador para almacenar
    const trabajadorNombre = document.getElementById('trabajador-select').options[document.getElementById('trabajador-select').selectedIndex].text;
    
    // Recopilar todas las actividades
    const actividadesItems = document.querySelectorAll('.actividad-item');
    const actividades = [];
    
    actividadesItems.forEach((item, index) => {
        const actividadSelect = document.getElementById(`actividad-select-${index}`);
        if (actividadSelect && actividadSelect.value) {
            const actividadId = actividadSelect.value;
            const actividadNombre = actividadSelect.options[actividadSelect.selectedIndex].text;
            const horas = parseFloat(document.getElementById(`horas-${index}`).value) || 0;
            const valorHora = parseFloat(document.getElementById(`valor-hora-jornal-${index}`).value) || 0;
            const subtotal = parseFloat(document.getElementById(`subtotal-${index}`).value) || 0;
            
            actividades.push({
                actividadId,
                actividadNombre,
                horas,
                valorHora,
                subtotal
            });
        }
    });
    
    const jornalData = {
        fecha: firebase.firestore.Timestamp.fromDate(fecha),
        trabajadorId,
        trabajadorNombre,
        actividades,
        total,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (jornalId) {
            // Actualizar jornal existente
            await db.collection('jornales').doc(jornalId).update(jornalData);
            console.log('Jornal actualizado con ID:', jornalId);
        } else {
            // Crear nuevo jornal
            jornalData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection('jornales').add(jornalData);
            console.log('Nuevo jornal creado con ID:', docRef.id);
        }
        
        modal.style.display = 'none';
        loadJornales(currentFilter); // Recargar lista de jornales
        loadDashboardData(); // Actualizar dashboard
    } catch (error) {
        console.error('Error al guardar jornal:', error);
        alert('Error al guardar jornal: ' + error.message);
    }
}

// Cargar lista de jornales
async function loadJornales(filterDate = null) {
    try {
        let query = db.collection('jornales')
            .orderBy('fecha', 'desc');
            
        // Si hay filtro de fecha, aplicarlo
        if (filterDate) {
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(filterDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            query = query
                .where('fecha', '>=', firebase.firestore.Timestamp.fromDate(startOfDay))
                .where('fecha', '<=', firebase.firestore.Timestamp.fromDate(endOfDay));
        }
        
        const snapshot = await query.get();
            
        let html = '';
        
        snapshot.forEach(doc => {
            const jornal = doc.data();
            const fecha = jornal.fecha ? jornal.fecha.toDate().toLocaleDateString() : '';
            
            // Crear fila para el jornal con las actividades como filas anidadas
            html += `
                <tr class="jornal-row">
                    <td>${fecha}</td>
                    <td>${jornal.trabajadorNombre}</td>
                    <td colspan="3">${jornal.actividades ? jornal.actividades.length : 0} actividades</td>
                    <td>$${jornal.total.toLocaleString()}</td>
                    <td>
                        <button class="btn-small edit-jornal" data-id="${doc.id}">Editar</button>
                        <button class="btn-small delete-jornal" data-id="${doc.id}">Eliminar</button>
                        <button class="btn-small toggle-details" data-id="${doc.id}">Detalles</button>
                    </td>
                </tr>
            `;
            
            // Agregar filas de detalle para cada actividad (inicialmente ocultas)
            if (jornal.actividades && jornal.actividades.length > 0) {
                html += `
                    <tr class="actividades-details" id="details-${doc.id}" style="display: none;">
                        <td colspan="7">
                            <table class="nested-table">
                                <thead>
                                    <tr>
                                        <th>Actividad</th>
                                        <th>Horas</th>
                                        <th>Valor/Hora</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                jornal.actividades.forEach(actividad => {
                    html += `
                        <tr>
                            <td>${actividad.actividadNombre}</td>
                            <td>${actividad.horas}</td>
                            <td>$${actividad.valorHora.toLocaleString()}</td>
                            <td>$${actividad.subtotal.toLocaleString()}</td>
                        </tr>
                    `;
                });
                
                html += `
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `;
            }
        });
        
        if (html === '') {
            html = '<tr><td colspan="7" class="text-center">No hay jornales registrados</td></tr>';
        }
        
        jornalesTable.innerHTML = html;
        
        // Agregar eventos a los botones de editar, eliminar y detalles
        document.querySelectorAll('.edit-jornal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jornalId = e.target.getAttribute('data-id');
                showJornalForm(jornalId);
            });
        });
        
        document.querySelectorAll('.delete-jornal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jornalId = e.target.getAttribute('data-id');
                deleteJornal(jornalId);
            });
        });
        
        document.querySelectorAll('.toggle-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jornalId = e.target.getAttribute('data-id');
                const detailsRow = document.getElementById(`details-${jornalId}`);
                if (detailsRow) {
                    detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar jornales:', error);
        alert('Error al cargar los jornales');
    }
}

// Eliminar jornal
async function deleteJornal(jornalId) {
    if (confirm('¿Estás seguro de que deseas eliminar este jornal? Esta acción no se puede deshacer.')) {
        try {
            await db.collection('jornales').doc(jornalId).delete();
            console.log('Jornal eliminado:', jornalId);
            loadJornales(currentFilter);
            loadDashboardData(); // Actualizar dashboard
        } catch (error) {
            console.error('Error al eliminar jornal:', error);
            alert('Error al eliminar el jornal');
        }
    }
}

// Cargar jornales recientes para el dashboard
async function loadRecentJornales() {
    try {
        const snapshot = await db.collection('jornales')
            .orderBy('fecha', 'desc')
            .limit(5)
            .get();
            
        let html = '';
        
        snapshot.forEach(doc => {
            const jornal = doc.data();
            const fecha = jornal.fecha ? jornal.fecha.toDate().toLocaleDateString() : '';
            
            html += `
                <tr>
                    <td>${fecha}</td>
                    <td>${jornal.trabajadorNombre}</td>
                    <td>${jornal.actividades && jornal.actividades.length > 0 ? jornal.actividades.map(a => a.actividadNombre).join(', ') : 'N/A'}</td>
                    <td>${jornal.actividades && jornal.actividades.length > 0 ? jornal.actividades.reduce((sum, a) => sum + a.horas, 0) : 0}</td>
                    <td>$${jornal.total.toLocaleString()}</td>
                </tr>
            `;
        });
        
        if (html === '') {
            html = '<tr><td colspan="5" class="text-center">No hay jornales registrados</td></tr>';
        }
        
        document.getElementById('recent-jornales-table').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar jornales recientes:', error);
    }
}