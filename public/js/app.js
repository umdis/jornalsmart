// Archivo principal de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Eliminar clase activa de todos los enlaces
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Agregar clase activa al enlace actual
            e.target.classList.add('active');
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('section-active');
            });
            
            // Mostrar la sección correspondiente
            const targetSection = e.target.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('section-active');
        });
    });
});

// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        // Cargar datos de trabajadores
        const trabajadoresSnapshot = await db.collection('trabajadores').get();
        document.getElementById('total-trabajadores').textContent = trabajadoresSnapshot.size;
        
        // Obtener primer y último día del mes actual
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDay.setHours(0, 0, 0, 0);
        
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        
        // Cargar jornales del mes
        const jornalesSnapshot = await db.collection('jornales')
            .where('fecha', '>=', firebase.firestore.Timestamp.fromDate(firstDay))
            .where('fecha', '<=', firebase.firestore.Timestamp.fromDate(lastDay))
            .get();
        
        // Calcular totales
        let totalJornales = jornalesSnapshot.size;
        let totalGastos = 0;
        let totalHoras = 0;
        
        // Para estadísticas de trabajadores y actividades
        const trabajadoresHoras = {};
        const actividadesHoras = {};
        
        jornalesSnapshot.forEach(doc => {
            const jornal = doc.data();
            totalGastos += jornal.total;
            
            // Verificar si hay actividades
            if (jornal.actividades && jornal.actividades.length > 0) {
                // Sumar horas por trabajador
                const trabajadorId = jornal.trabajadorId;
                const trabajadorNombre = jornal.trabajadorNombre;
                
                if (!trabajadoresHoras[trabajadorId]) {
                    trabajadoresHoras[trabajadorId] = {
                        nombre: trabajadorNombre,
                        horas: 0
                    };
                }
                
                // Sumar horas por actividad
                jornal.actividades.forEach(actividad => {
                    const actividadId = actividad.actividadId;
                    const actividadNombre = actividad.actividadNombre;
                    const horasActividad = actividad.horas || 0;
                    
                    totalHoras += horasActividad;
                    trabajadoresHoras[trabajadorId].horas += horasActividad;
                    
                    if (!actividadesHoras[actividadId]) {
                        actividadesHoras[actividadId] = {
                            nombre: actividadNombre,
                            horas: 0
                        };
                    }
                    
                    actividadesHoras[actividadId].horas += horasActividad;
                });
            }
        });
        
        // Actualizar valores en el dashboard
        document.getElementById('total-jornales-mes').textContent = totalJornales;
        document.getElementById('total-gastos-mes').textContent = `$${totalGastos.toLocaleString()}`;
        document.getElementById('total-horas-mes').textContent = totalHoras.toFixed(1);
        
        // Cargar jornales recientes
        await loadRecentJornales();
        
        // Cargar tabla de horas por trabajador
        await loadTrabajadoresHoras(trabajadoresHoras, totalHoras);
        
        // Cargar gráfico de actividades
        await loadActividadesChart(actividadesHoras);
        
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}

// Función para cargar la tabla de horas por trabajador
async function loadTrabajadoresHoras(trabajadoresHoras, totalHoras) {
    const tableBody = document.getElementById('trabajadores-horas-table');
    let html = '';
    
    // Convertir a array y ordenar por horas (de mayor a menor)
    const trabajadoresArray = Object.values(trabajadoresHoras).sort((a, b) => b.horas - a.horas);
    
    trabajadoresArray.forEach(trabajador => {
        const porcentaje = totalHoras > 0 ? (trabajador.horas / totalHoras * 100).toFixed(1) : 0;
        
        html += `
            <tr>
                <td>${trabajador.nombre}</td>
                <td>${trabajador.horas.toFixed(1)}</td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${porcentaje}%"></div>
                    </div>
                    ${porcentaje}%
                </td>
            </tr>
        `;
    });
    
    if (html === '') {
        html = '<tr><td colspan="3" class="text-center">No hay datos disponibles</td></tr>';
    }
    
    tableBody.innerHTML = html;
}

// Función para cargar el gráfico de actividades
async function loadActividadesChart(actividadesHoras) {
    const chartContainer = document.getElementById('actividades-chart');
    
    // Convertir a array y ordenar por horas (de mayor a menor)
    const actividadesArray = Object.values(actividadesHoras).sort((a, b) => b.horas - a.horas);
    
    // Limitar a las 5 actividades con más horas
    const topActividades = actividadesArray.slice(0, 5);
    
    // Preparar datos para el gráfico
    const labels = topActividades.map(actividad => actividad.nombre);
    const data = topActividades.map(actividad => actividad.horas);
    
    // Crear el canvas para el gráfico
    chartContainer.innerHTML = '<canvas id="actividadesChart"></canvas>';
    
    // Crear el gráfico
    const ctx = document.getElementById('actividadesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Horas',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Horas trabajadas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Actividades'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)} horas`;
                        }
                    }
                }
            }
        }
    });
}