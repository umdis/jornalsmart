# Configuración Segura de Credenciales Firebase

Este documento explica cómo configurar y desplegar la aplicación FincaJornal de manera segura, evitando exponer las credenciales de Firebase en el código fuente.

## Enfoque de Seguridad

En lugar de incluir las credenciales directamente en el código, usamos un sistema basado en:

1. Una plantilla (`config.template.js`) con marcadores de posición
2. Variables de entorno para almacenar las credenciales reales
3. Un script de construcción que reemplaza los marcadores con valores reales durante el despliegue
4. Control de versiones que ignora el archivo de configuración final

## Instrucciones de Configuración

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Hay dos opciones:

#### Opción A: Usando un archivo .env (Recomendado para desarrollo local)

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y completa tus credenciales de Firebase:
   ```
   FIREBASE_API_KEY=tu-api-key
   FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   FIREBASE_PROJECT_ID=tu-proyecto
   FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
   FIREBASE_APP_ID=tu-app-id
   ```

> **¡IMPORTANTE!** Nunca subas el archivo `.env` al repositorio. Ya está incluido en el `.gitignore`.

#### Opción B: Configurar variables de entorno en el sistema (Recomendado para entornos CI/CD)

En sistemas Linux/macOS:
```bash
export FIREBASE_API_KEY=tu-api-key
export FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
export FIREBASE_PROJECT_ID=tu-proyecto
export FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
export FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
export FIREBASE_APP_ID=tu-app-id
```

En Windows (PowerShell):
```powershell
$env:FIREBASE_API_KEY="tu-api-key"
$env:FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
$env:FIREBASE_PROJECT_ID="tu-proyecto"
$env:FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
$env:FIREBASE_MESSAGING_SENDER_ID="tu-messaging-sender-id"
$env:FIREBASE_APP_ID="tu-app-id"
```

### Paso 3: Generar el Archivo de Configuración

```bash
npm run build
```

Este comando leerá las variables de entorno y generará el archivo `js/config.js` con tus credenciales.

### Paso 4: Desplegar la Aplicación

```bash
npm run deploy
```

Este comando ejecutará primero el build y luego desplegará la aplicación a Firebase.

## Configuración en Sistemas de CI/CD

Para servicios como GitHub Actions, Travis CI, etc., configura las variables de entorno en los ajustes secretos del servicio y utiliza un flujo de trabajo similar a este:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm install
      - name: Build config
        run: npm run build
        env:
          FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Ventajas de Este Enfoque

1. **Seguridad**: Las credenciales nunca se suben al repositorio
2. **Facilidad de desarrollo**: Los desarrolladores pueden configurar sus propias credenciales localmente
3. **CI/CD compatible**: Funciona bien con sistemas de integración continua
4. **Mantenibilidad**: Los cambios en la estructura de configuración son fáciles de implementar

## Solución de Problemas

### Error: "Faltan variables de entorno de Firebase"

Verifica que hayas configurado correctamente todas las variables de entorno requeridas.

### Error al generar el archivo de configuración

Asegúrate de haber instalado todas las dependencias con `npm install`.

### El archivo de configuración no se genera

Verifica los permisos de escritura en el directorio del proyecto.

### Error durante el despliegue

Si recibes un error durante el despliegue, verifica que estás autenticado en Firebase CLI con `firebase login`.