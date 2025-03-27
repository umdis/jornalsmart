# Instrucciones para Desplegar FincaJornal en Firebase

Este documento contiene las instrucciones paso a paso para desplegar la aplicación FincaJornal en Firebase Hosting y configurar Firestore como base de datos.

## Requisitos previos

1. Tener una cuenta de Google
2. Tener Node.js y npm instalados
3. Tener Git instalado (opcional)

## Paso 1: Instalar Firebase CLI

Abra una terminal o línea de comandos y ejecute:

```bash
npm install -g firebase-tools
```

## Paso 2: Iniciar sesión en Firebase

```bash
firebase login
```

Esto abrirá una ventana del navegador para que inicie sesión con su cuenta de Google.

## Paso 3: Crear un proyecto en Firebase

1. Vaya a [Firebase Console](https://console.firebase.google.com/)
2. Haga clic en "Agregar proyecto"
3. Ingrese "FincaJornal" como nombre (o el nombre que prefiera)
4. Siga los pasos del asistente para completar la creación

## Paso 4: Vincular proyecto local con Firebase

Asegúrese de estar en el directorio raíz del proyecto y ejecute:

```bash
firebase use --add
```

Seleccione el proyecto Firebase que acaba de crear y asígnele un alias (por ejemplo, "production").

## Paso 5: Configurar Firestore

1. En la [Firebase Console](https://console.firebase.google.com/), seleccione su proyecto
2. Vaya a "Firestore Database" en el menú lateral
3. Haga clic en "Crear base de datos"
4. Seleccione "Comenzar en modo de producción"
5. Elija la ubicación de su base de datos (preferiblemente la más cercana a los usuarios)

## Paso 6: Configurar Autenticación

1. En la Firebase Console, vaya a "Authentication"
2. Haga clic en "Comenzar"
3. En la pestaña "Sign-in method", habilite el proveedor "Correo electrónico/contraseña"

## Paso 7: Actualizar configuración de Firebase

Actualice el archivo `js/config.js` con las credenciales de su proyecto:

1. En la Firebase Console, vaya a "Project settings" (ícono de engranaje)
2. Desplácese hacia abajo hasta encontrar la sección "Your apps"
3. Si no hay una app web, haga clic en el ícono web (</>) para agregar una
4. Registre la aplicación con un apodo (por ejemplo, "FincaJornal Web")
5. Copie el objeto `firebaseConfig` y reemplace la configuración en `js/config.js`

## Paso 8: Desplegar la aplicación

Desde la línea de comandos, ejecute:

```bash
firebase deploy
```

Esto desplegará la aplicación en Firebase Hosting y aplicará las reglas de Firestore.

## Paso 9: Crear usuario administrador

1. Abra el archivo `js/auth.js`
2. Descomente la línea que contiene la función `adminUser`
3. Actualice los parámetros con el correo y contraseña que desee para el administrador:
   ```javascript
   adminUser('admin@fincajornal.com', 'contraseña_segura');
   ```
4. Acceda a la URL de su aplicación desplegada (proporcionada al finalizar el despliegue)
5. Inicie sesión con las credenciales proporcionadas
6. Recargue la página después de iniciar sesión (esto ejecutará la función `adminUser`)
7. Vuelva a comentar la línea de la función `adminUser` para evitar crear usuarios duplicados
8. Actualice el archivo con:
   ```bash
   firebase deploy --only hosting
   ```

## Paso 10: Verificar la instalación

1. Acceda a la URL de su aplicación (proporcionada al finalizar el despliegue)
2. Inicie sesión con las credenciales de administrador creadas en el paso anterior
3. Verifique que puede acceder a todas las secciones
4. Cree algunos datos de prueba para verificar la funcionalidad

## Solución de problemas comunes

### Error al desplegar
Si encuentra un error al desplegar, verifique:
- Que está en el directorio correcto del proyecto
- Que tiene los permisos adecuados en el proyecto Firebase
- Que ha instalado correctamente Firebase CLI

### Problemas con la base de datos
Si no puede agregar o leer datos:
- Verifique las reglas de seguridad de Firestore
- Compruebe que está autenticado correctamente
- Revise la consola del navegador para ver errores específicos

### La aplicación no carga correctamente
Si la aplicación no carga o muestra errores:
- Verifique la consola del navegador para obtener detalles del error
- Compruebe que la configuración de Firebase es correcta
- Asegúrese de que todos los archivos se han desplegado correctamente

## Comandos útiles

- Desplegar todo: `firebase deploy`
- Desplegar solo hosting: `firebase deploy --only hosting`
- Desplegar solo firestore: `firebase deploy --only firestore`
- Ver la aplicación localmente: `firebase serve`

## Recursos adicionales

- [Documentación de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Documentación de Firebase Auth](https://firebase.google.com/docs/auth)