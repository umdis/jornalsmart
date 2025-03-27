# Sistema de Administración de Jornales

Este sistema permite gestionar los jornales de trabajadores en una finca, incluyendo el registro de trabajadores, actividades, jornales y la generación de reportes.

## Características

- Gestión de trabajadores (crear, editar, eliminar)
- Gestión de actividades y tarifas por hora
- Registro de jornales con cálculo automático de pagos
- Filtrado de jornales por fecha
- Generación de reportes por rango de fechas, trabajador y/o actividad
- Exportación de reportes a formato CSV
- Panel de control con indicadores clave
- Sistema de autenticación de usuarios

## Tecnologías utilizadas

- HTML5, CSS3 y JavaScript (ES6+)
- Firebase Authentication para la autenticación
- Firestore como base de datos
- Firebase Hosting para el despliegue

## Configuración del proyecto

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Sigue las instrucciones para crear un nuevo proyecto
4. Habilita Firebase Authentication y Firestore en tu proyecto

### 2. Configurar la autenticación

1. En la consola de Firebase, ve a Authentication > Sign-in method
2. Habilita la autenticación por correo electrónico y contraseña

### 3. Configurar Firestore

1. En la consola de Firebase, ve a Firestore Database
2. Crea una base de datos en modo de producción
3. Configura las reglas de seguridad:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Configurar la aplicación

1. En la consola de Firebase, ve a Configuración del proyecto > General
2. Desplázate hasta "Tus aplicaciones" y selecciona el icono web (</>) para agregar una aplicación web
3. Registra la aplicación con un nombre
4. Copia el objeto `firebaseConfig` generado
5. Pega la configuración en el archivo `js/config.js`

### 5. Crear usuario administrador

Para crear el primer usuario administrador, descomenta la línea en el archivo `js/auth.js` que llama a la función `adminUser` y configura el correo electrónico y contraseña deseados:

```javascript
// Descomenta esta línea y configura el correo y contraseña
adminUser('admin@finca.com', 'contraseña_segura');
```

Luego, vuelve a comentar esta línea después de haber creado el usuario.

## Despliegue en Firebase Hosting

1. Instala Firebase CLI (si no lo tienes):
   ```
   npm install -g firebase-tools
   ```

2. Inicia sesión en Firebase:
   ```
   firebase login
   ```

3. Inicializa el proyecto:
   ```
   firebase init
   ```
   - Selecciona Hosting
   - Selecciona tu proyecto
   - Especifica el directorio público como `.` (el directorio actual)
   - Configura como aplicación de una sola página: No

4. Despliega la aplicación:
   ```
   firebase deploy
   ```

## Estructura de la base de datos

La base de datos Firestore contiene las siguientes colecciones:

- **usuarios**: Información de los usuarios del sistema
- **trabajadores**: Registro de trabajadores de la finca
- **actividades**: Tipos de actividades y su valor por hora
- **jornales**: Registro de jornales realizados

## Guía de uso

1. Inicia sesión con el usuario administrador
2. Registra las actividades de la finca con sus respectivos valores por hora
3. Registra los trabajadores
4. Registra los jornales diarios
5. Genera reportes según tus necesidades

## Personalización

Puedes personalizar la aplicación editando los siguientes archivos:

- `css/styles.css`: Para cambiar estilos, colores, fuentes, etc.
- `index.html`: Para modificar la estructura de la aplicación
- Archivos JavaScript en la carpeta `js/`: Para personalizar la lógica del negocio

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para acceder a Firebase)

## Limitaciones

- La aplicación está diseñada para funcionar en línea y requiere conexión a internet para funcionar correctamente
- No incluye funcionalidades de backup local