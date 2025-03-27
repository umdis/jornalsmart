// Gestión de reportes
const reportStartDate = document.getElementById('report-start-date');
const reportEndDate = document.getElementById('report-end-date');
const reportWorker = document.getElementById('report-worker');
const reportActivity = document.getElementById('report-activity');
const generateReportBtn = document.getElementById('generate-report');
const exportReportBtn = document.getElementById('export-report');
const reportTable = document.getElementById('report-table');

// Inicializar fechas del reporte
function initReportDates() {
    // Establecer fecha inicial (primer día del mes actual)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    reportStartDate.valueAsDate = firstDay;
    
    // Establecer fecha final (día actual)
    reportEndDate.valueAsDate = today;
}

// Cargar filtros para reportes
async function loadReportFilters() {
    try {
        // Inicializar fechas
        initReportDates();
        
        // Cargar trabajadores, incluyendo la opción "Todos"
        await window.getTrabajadoresForSelect(reportWorker, true);
        
        // Cargar actividades sin el valor por hora
        const actividadesSnapshot = await db.collection('actividades')
            .orderBy('nombre')
            .get();
            
        let options = '<option value="">Todas</option>';
        
        actividadesSnapshot.forEach(doc => {
            const actividad = doc.data();
            options += `<option value="${doc.id}">${actividad.nombre}</option>`;
        });
        
        reportActivity.innerHTML = options;
    } catch (error) {
        console.error('Error al cargar filtros para reportes:', error);
    }
}

// Generar reporte
generateReportBtn.addEventListener('click', async () => {
    try {
        const startDate = reportStartDate.valueAsDate;
        const endDate = reportEndDate.valueAsDate;
        
        if (!startDate || !endDate) {
            alert('Debe seleccionar un rango de fechas');
            return;
        }
        
        // Ajustar fechas para incluir todo el día
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        // Construir consulta base
        let query = db.collection('jornales')
            .where('fecha', '>=', firebase.firestore.Timestamp.fromDate(start))
            .where('fecha', '<=', firebase.firestore.Timestamp.fromDate(end))
            .orderBy('fecha', 'desc');
        
        // Aplicar filtro de trabajador si está seleccionado
        let trabajadorNombre = '';
        if (reportWorker.value && reportWorker.value !== 'todos') {
            // En este caso necesitamos hacer dos consultas, una para obtener el nombre y otra para los jornales
            const workerDoc = await db.collection('trabajadores').doc(reportWorker.value).get();
            if (workerDoc.exists) {
                trabajadorNombre = workerDoc.data().nombre;
            }
            query = query.where('trabajadorId', '==', reportWorker.value);
        }
        
        // Ejecutar consulta
        const snapshot = await query.get();
        
        // Para el filtro de actividad, debemos procesar los resultados manualmente
        const actividadId = reportActivity.value;
        let actividadNombre = '';
        if (actividadId) {
            const activityDoc = await db.collection('actividades').doc(actividadId).get();
            if (activityDoc.exists) {
                actividadNombre = activityDoc.data().nombre;
            }
        }
        
        // Procesar resultados
        let html = '';
        let totalJornales = 0;
        let totalHoras = 0;
        let totalPagado = 0;
        
        snapshot.forEach(doc => {
            const jornal = doc.data();
            const fecha = jornal.fecha ? jornal.fecha.toDate().toLocaleDateString() : '';
            
            // Si hay filtro de actividad, solo mostrar las actividades que coincidan
            let actividadesFiltradas = jornal.actividades || [];
            if (actividadId) {
                actividadesFiltradas = actividadesFiltradas.filter(act => act.actividadId === actividadId);
                
                // Si no hay actividades que coincidan con el filtro, omitir este jornal
                if (actividadesFiltradas.length === 0) {
                    return;
                }
            }
            
            // Calcular totales para este jornal con las actividades filtradas
            const horasJornal = actividadesFiltradas.reduce((sum, act) => sum + act.horas, 0);
            const totalJornal = actividadesFiltradas.reduce((sum, act) => sum + act.subtotal, 0);
            
            html += `
                <tr>
                    <td>${fecha}</td>
                    <td>${jornal.trabajadorNombre}</td>
                    <td>${actividadesFiltradas.map(a => a.actividadNombre).join(', ')}</td>
                    <td>${horasJornal}</td>
                    <td>${actividadesFiltradas.map(a => '$' + a.valorHora.toLocaleString()).join(', ')}</td>
                    <td>$${totalJornal.toLocaleString()}</td>
                </tr>
            `;
            
            totalJornales++;
            totalHoras += horasJornal;
            totalPagado += totalJornal;
            
            // Si hay filtro de actividad, agregar detalle de las actividades filtradas
            if (actividadId && actividadesFiltradas.length > 0) {
                actividadesFiltradas.forEach(act => {
                    html += `
                        <tr class="actividad-detalle">
                            <td></td>
                            <td></td>
                            <td>${act.actividadNombre}</td>
                            <td>${act.horas}</td>
                            <td>$${act.valorHora.toLocaleString()}</td>
                            <td>$${act.subtotal.toLocaleString()}</td>
                        </tr>
                    `;
                });
            }
        });
        
        if (html === '') {
            html = '<tr><td colspan="6" class="text-center">No hay datos para el período seleccionado</td></tr>';
        }
        
        reportTable.innerHTML = html;
        
        // Actualizar resumen
        document.getElementById('report-total-jornales').textContent = totalJornales;
        document.getElementById('report-total-horas').textContent = totalHoras.toFixed(1);
        document.getElementById('report-total-pagado').textContent = `$${totalPagado.toLocaleString()}`;
        
    } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Error al generar el reporte');
    }
});

// Exportar reporte a Excel
exportReportBtn.addEventListener('click', () => {
    try {
        const startDate = reportStartDate.value;
        const endDate = reportEndDate.value;
        const trabajador = reportWorker.options[reportWorker.selectedIndex].text;
        const actividad = reportActivity.options[reportActivity.selectedIndex].text;
        
        // Título del reporte
        let reportTitle = `Reporte de Jornales - ${startDate} al ${endDate}`;
        if (trabajador !== 'Todos') {
            reportTitle += ` - Trabajador: ${trabajador}`;
        }
        if (actividad !== 'Todas') {
            reportTitle += ` - Actividad: ${actividad}`;
        }
        
        // Obtener datos de la tabla
        const table = document.querySelector('.report-table table');
        
        // Crear una tabla de Excel
        let csv = 'Fecha,Trabajador,Actividad,Horas,Valor Hora,Total\n';
        
        // Obtener filas de la tabla (ignorar la primera que es el encabezado)
        const rows = table.querySelectorAll('tbody tr:not(.actividad-detalle)');
        
        rows.forEach(row => {
            // Si es una fila de "no hay datos", ignorarla
            if (row.cells.length === 1) {
                return;
            }
            
            const rowData = [];
            
            // Procesar cada celda
            row.querySelectorAll('td').forEach(cell => {
                // Limpiar el texto de la celda (quitar $ y separadores de miles)
                let cellText = cell.textContent.replace(/\$/g, '').replace(/,/g, '');
                
                // Si la celda contiene una coma, encerrarla en comillas
                if (cellText.includes(',')) {
                    cellText = `"${cellText}"`;
                }
                
                rowData.push(cellText);
            });
            
            csv += rowData.join(',') + '\n';
        });
        
        // Agregar sección de detalles por actividades cuando sea necesario
        const actividadDetails = table.querySelectorAll('tbody tr.actividad-detalle');
        if (actividadDetails.length > 0) {
            csv += '\n\nDETALLES POR ACTIVIDAD\n';
            csv += 'Fecha,Trabajador,Actividad,Horas,Valor Hora,Subtotal\n';
            
            actividadDetails.forEach(row => {
                const rowData = [];
                
                // Procesar cada celda
                row.querySelectorAll('td').forEach(cell => {
                    // Limpiar el texto de la celda (quitar $ y separadores de miles)
                    let cellText = cell.textContent.replace(/\$/g, '').replace(/,/g, '');
                    
                    // Si la celda contiene una coma, encerrarla en comillas
                    if (cellText.includes(',')) {
                        cellText = `"${cellText}"`;
                    }
                    
                    rowData.push(cellText);
                });
                
                csv += rowData.join(',') + '\n';
            });
        }
        
        // Agregar resumen
        csv += '\n';
        csv += `Total Jornales,${document.getElementById('report-total-jornales').textContent}\n`;
        csv += `Total Horas,${document.getElementById('report-total-horas').textContent}\n`;
        csv += `Total Pagado,${document.getElementById('report-total-pagado').textContent.replace('$', '').replace(/,/g, '')}\n`;
        
        // Crear un enlace para descargar el archivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${reportTitle}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        alert('Error al exportar el reporte');
    }
});