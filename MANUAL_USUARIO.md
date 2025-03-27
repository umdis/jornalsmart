# Manual de Usuario: FincaJornal - Sistema de Administración de Jornales

## Contenido
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Interfaz Principal](#interfaz-principal)
4. [Panel de Control (Dashboard)](#panel-de-control-dashboard)
5. [Gestión de Trabajadores](#gestión-de-trabajadores)
6. [Gestión de Actividades](#gestión-de-actividades)
7. [Registro de Jornales](#registro-de-jornales)
8. [Reportes y Estadísticas](#reportes-y-estadísticas)
9. [Preguntas Frecuentes](#preguntas-frecuentes)
10. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

**FincaJornal** es un sistema web diseñado específicamente para la administración eficiente de jornales en fincas agrícolas. Permite gestionar trabajadores, actividades, jornales y generar reportes detallados. El sistema facilita el registro de múltiples actividades por trabajador en un mismo día, optimizando la gestión de recursos humanos y el control financiero de la finca.

### Características Principales

- Gestión completa de trabajadores y sus datos personales
- Control de actividades y tarifas por hora
- Registro de jornales con múltiples actividades por trabajador
- Panel de control con estadísticas visuales
- Reportes configurables con exportación a Excel
- Interfaz responsive adaptable a cualquier dispositivo

### Requisitos del Sistema

- Navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari)
- Conexión a internet para sincronización con la base de datos
- Cuenta de usuario proporcionada por el administrador

---

## Acceso al Sistema

### Inicio de Sesión

1. Abra su navegador web e ingrese la URL proporcionada para acceder al sistema.
2. En la pantalla de inicio de sesión, ingrese las siguientes credenciales:
   - **Correo electrónico**: Su correo electrónico registrado
   - **Contraseña**: Su contraseña asignada
3. Haga clic en el botón "Ingresar".

![Pantalla de Inicio de Sesión](https://example.com/login-screen.png)

### Recuperación de Contraseña

Si ha olvidado su contraseña:
1. Contacte al administrador del sistema para restablecerla
2. Se le asignará una contraseña temporal que deberá cambiar en su primer acceso

### Cierre de Sesión

Para salir del sistema de manera segura:
1. Haga clic en el botón "Salir" ubicado en la esquina superior derecha de la pantalla
2. Confirme que desea cerrar sesión cuando se le solicite

---

## Interfaz Principal

Después de iniciar sesión, accederá a la interfaz principal del sistema que consta de:

### Menú de Navegación

Ubicado en la parte superior de la pantalla, permite acceder a las diferentes secciones:

- **Dashboard**: Panel de control con indicadores y estadísticas
- **Trabajadores**: Gestión de trabajadores de la finca
- **Jornales**: Registro y consulta de jornales
- **Actividades**: Gestión de tipos de actividades y tarifas
- **Reportes**: Generación de reportes personalizados

### Área de Contenido

Es la sección principal donde se muestra la información correspondiente a la opción seleccionada en el menú.

### Barra Superior

Muestra el nombre del usuario actual y el botón para cerrar sesión.

---

## Panel de Control (Dashboard)

El panel de control ofrece una vista general del estado actual de la finca y sus operaciones. Se divide en varias secciones:

### Indicadores Principales

Muestra cuatro tarjetas con información clave:

- **Trabajadores**: Número total de trabajadores registrados
- **Jornales (Mes)**: Cantidad de jornales registrados en el mes actual
- **Gastos Totales (Mes)**: Suma total pagada por jornales en el mes actual
- **Horas Trabajadas (Mes)**: Total de horas trabajadas en el mes actual

### Actividades Recientes

Muestra una tabla con los últimos jornales registrados, incluyendo:

- Fecha
- Trabajador
- Actividades realizadas
- Horas trabajadas
- Total pagado

### Datos de Trabajo

Presenta una tabla que muestra las horas trabajadas por cada empleado durante el mes actual:

- Nombre del trabajador
- Horas trabajadas
- Porcentaje del total de horas (representado también con una barra de progreso)

Esta sección permite identificar rápidamente qué trabajadores están realizando más horas.

### Estadísticas

Muestra un gráfico de barras con las actividades más realizadas en términos de horas trabajadas. Se muestran las 5 actividades principales, permitiendo visualizar cuáles son las tareas que demandan más tiempo en la finca.

---

## Gestión de Trabajadores

Esta sección permite administrar toda la información relacionada con los trabajadores de la finca.

### Listado de Trabajadores

Muestra una tabla con todos los trabajadores registrados, incluyendo:

- Nombre completo
- Número de identificación
- Teléfono
- Dirección
- Fecha de ingreso
- Opciones (Editar/Eliminar)

### Agregar Nuevo Trabajador

1. Haga clic en el botón "Nuevo Trabajador"
2. Complete el formulario con los siguientes datos:
   - **Nombre completo**: Nombre y apellidos del trabajador
   - **Identificación**: Número de documento de identidad (obligatorio y único)
   - **Teléfono**: Número de contacto
   - **Dirección**: Lugar de residencia
   - **Fecha de ingreso**: Fecha en que comenzó a trabajar en la finca
3. Haga clic en "Guardar" para registrar al trabajador

### Editar Trabajador

1. En el listado de trabajadores, haga clic en el botón "Editar" junto al trabajador deseado
2. Modifique los datos necesarios en el formulario
3. Haga clic en "Guardar" para actualizar la información

### Eliminar Trabajador

1. En el listado de trabajadores, haga clic en el botón "Eliminar" junto al trabajador deseado
2. Confirme la eliminación cuando se le solicite

> **Nota**: Solo se pueden eliminar trabajadores que no tengan jornales asociados. Si intenta eliminar un trabajador con jornales registrados, el sistema mostrará un mensaje de error.

---

## Gestión de Actividades

Esta sección permite administrar los tipos de actividades que se realizan en la finca y sus tarifas por hora.

### Listado de Actividades

Muestra una tabla con todas las actividades registradas, incluyendo:

- Nombre de la actividad
- Descripción
- Valor por hora
- Opciones (Editar/Eliminar)

### Agregar Nueva Actividad

1. Haga clic en el botón "Nueva Actividad"
2. Complete el formulario con los siguientes datos:
   - **Nombre de la actividad**: Nombre descriptivo (obligatorio y único)
   - **Descripción**: Breve explicación de la actividad (opcional)
   - **Valor por hora**: Tarifa por hora de trabajo para esta actividad
3. Haga clic en "Guardar" para registrar la actividad

### Editar Actividad

1. En el listado de actividades, haga clic en el botón "Editar" junto a la actividad deseada
2. Modifique los datos necesarios en el formulario
3. Haga clic en "Guardar" para actualizar la información

### Eliminar Actividad

1. En el listado de actividades, haga clic en el botón "Eliminar" junto a la actividad deseada
2. Confirme la eliminación cuando se le solicite

> **Nota**: Solo se pueden eliminar actividades que no tengan jornales asociados. Si intenta eliminar una actividad con jornales registrados, el sistema mostrará un mensaje de error.

---

## Registro de Jornales

Esta sección permite registrar los jornales diarios de los trabajadores, pudiendo incluir múltiples actividades en un mismo jornal.

### Listado de Jornales

Muestra una tabla con todos los jornales registrados, incluyendo:

- Fecha
- Trabajador
- Resumen de actividades
- Total pagado
- Opciones (Editar/Eliminar/Detalles)

#### Ver Detalles del Jornal

1. Haga clic en el botón "Detalles" para ver todas las actividades incluidas en un jornal específico
2. Se mostrará una tabla detallada con cada actividad, horas trabajadas, valor por hora y subtotal

### Filtrado de Jornales

Puede filtrar la lista de jornales por fecha:

1. Seleccione la fecha deseada en el selector de fecha
2. Haga clic en "Aplicar" para ver solo los jornales de la fecha seleccionada
3. Para ver todos los jornales nuevamente, haga clic en "Limpiar"

### Agregar Nuevo Jornal

1. Haga clic en el botón "Nuevo Jornal"
2. Complete el formulario con:
   - **Fecha**: Fecha del jornal (por defecto, se establece la fecha actual)
   - **Trabajador**: Seleccione el trabajador de la lista desplegable
   
3. Para cada actividad realizada:
   - **Actividad**: Seleccione la actividad de la lista desplegable
   - **Horas trabajadas**: Ingrese la cantidad de horas dedicadas a esta actividad
   - **Valor por hora**: Se carga automáticamente al seleccionar la actividad
   - **Subtotal**: Se calcula automáticamente (horas × valor por hora)

4. Si el trabajador realizó múltiples actividades en el mismo día, haga clic en "+ Agregar actividad" para añadir otra actividad al jornal

5. El "Total a pagar" se calcula automáticamente sumando los subtotales de todas las actividades

6. Haga clic en "Guardar" para registrar el jornal

### Editar Jornal

1. En el listado de jornales, haga clic en el botón "Editar" junto al jornal deseado
2. Modifique los datos necesarios en el formulario
3. Puede agregar, modificar o eliminar actividades según sea necesario
4. Haga clic en "Guardar" para actualizar la información

### Eliminar Jornal

1. En el listado de jornales, haga clic en el botón "Eliminar" junto al jornal deseado
2. Confirme la eliminación cuando se le solicite

> **Importante**: La eliminación de un jornal es permanente y no se puede deshacer.

---

## Reportes y Estadísticas

Esta sección permite generar reportes personalizados de jornales para análisis y toma de decisiones.

### Filtros Disponibles

Los reportes pueden filtrarse por:

- **Fecha inicial**: Inicio del período a reportar
- **Fecha final**: Fin del período a reportar
- **Trabajador**: Filtrar por un trabajador específico o todos
- **Actividad**: Filtrar por una actividad específica o todas

### Generar Reporte

1. Establezca los filtros deseados
2. Haga clic en "Generar Reporte"
3. El sistema mostrará:
   - **Resumen**: Total de jornales, total de horas y total pagado
   - **Detalle**: Tabla con los jornales que cumplen los criterios de filtrado

### Exportar a Excel

1. Después de generar un reporte, haga clic en "Exportar a Excel"
2. El sistema generará un archivo CSV que se descargará automáticamente
3. Este archivo puede abrirse en Excel u otras aplicaciones similares para posterior análisis

### Ejemplo de Reporte

- **Reporte de todos los jornales del mes actual**:
  - Fecha inicial: Primer día del mes
  - Fecha final: Día actual
  - Trabajador: Todos
  - Actividad: Todas

- **Reporte de un trabajador específico**:
  - Fecha inicial: según período deseado
  - Fecha final: según período deseado
  - Trabajador: Seleccionar el trabajador específico
  - Actividad: Todas

- **Reporte por tipo de actividad**:
  - Fecha inicial: según período deseado
  - Fecha final: según período deseado
  - Trabajador: Todos
  - Actividad: Seleccionar la actividad específica

---

## Preguntas Frecuentes

### ¿Cómo puedo modificar un jornal si me equivoqué en algún dato?
Puede editar cualquier jornal haciendo clic en el botón "Editar" junto al jornal deseado en la lista de jornales. Esto abrirá el formulario con los datos actuales que puede modificar y guardar nuevamente.

### ¿Es posible registrar actividades de días anteriores?
Sí, al crear un nuevo jornal puede seleccionar cualquier fecha anterior. El sistema no tiene restricciones para el registro de jornales pasados.

### ¿Puedo eliminar un trabajador si ya no labora en la finca?
Sí, pero solo si el trabajador no tiene jornales asociados. Si desea conservar el historial, considere marcarlo como "inactivo" editando su información en lugar de eliminarlo (esta funcionalidad depende de la versión del sistema).

### ¿Cómo puedo saber cuántas horas trabajó un empleado en un período específico?
Utilice la sección de reportes, seleccione el período deseado con las fechas inicial y final, y filtre por el trabajador específico. El reporte mostrará el total de horas trabajadas en ese período.

### ¿Es posible cambiar la tarifa de una actividad?
Sí, puede editar cualquier actividad para actualizar su valor por hora. Sin embargo, esto no afectará a los jornales ya registrados con la tarifa anterior.

---

## Solución de Problemas

### El sistema no carga correctamente
- Verifique su conexión a internet
- Intente actualizar la página (F5)
- Compruebe que esté utilizando un navegador actualizado y compatible

### No puedo iniciar sesión
- Verifique que está ingresando correctamente su correo electrónico y contraseña
- Compruebe que las mayúsculas y minúsculas sean correctas
- Si el problema persiste, contacte al administrador para restablecer su contraseña

### Al generar un reporte no se muestran todos los datos esperados
- Verifique que los filtros seleccionados sean correctos
- Compruebe que existan datos para el período seleccionado
- Si los datos fueron ingresados recientemente, espere unos minutos para que el sistema los procese

### No puedo eliminar un trabajador o actividad
- Solo se pueden eliminar trabajadores y actividades que no tengan jornales asociados
- Si necesita desactivar un trabajador con historial, contacte al administrador

### El cálculo del total a pagar parece incorrecto
- Verifique que las horas y valores por hora estén correctamente ingresados
- Recuerde que el total se calcula sumando el subtotal de cada actividad
- Si detecta un error persistente, tome una captura de pantalla del caso y contacte al soporte

---

## Glosario de Términos

- **Jornal**: Registro de trabajo diario de un trabajador, que puede incluir múltiples actividades.
- **Actividad**: Tipo de labor que se realiza en la finca (ej. siembra, cosecha, limpieza).
- **Valor por hora**: Tarifa establecida para pagar cada hora de trabajo en una actividad específica.
- **Subtotal**: Monto a pagar por una actividad específica dentro de un jornal (horas × valor por hora).
- **Total**: Suma de todos los subtotales de las actividades de un jornal.
- **Dashboard**: Panel de control con indicadores y estadísticas generales.

---

## Contacto y Soporte

Si necesita ayuda adicional o tiene sugerencias para mejorar el sistema, por favor contacte a:

- **Soporte técnico**: ******@------.com
- **Teléfono**: ------------
- **Horario de atención**: --------------

---

*Manual de Usuario FincaJornal - Versión 1.0*
*Última actualización: Marzo 2025*