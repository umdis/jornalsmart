const fs = require('fs');
const path = require('path');

// Cargar variables desde .env si existe
try {
  require('dotenv').config();
} catch (error) {
  console.log('Módulo dotenv no encontrado, usando variables de entorno directamente.');
}

// Leer las variables de entorno
const apiKey = process.env.FIREBASE_API_KEY;
const authDomain = process.env.FIREBASE_AUTH_DOMAIN;
const projectId = process.env.FIREBASE_PROJECT_ID;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.FIREBASE_APP_ID;

// Verificar que las variables de entorno estén definidas
if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
  console.error('Error: Faltan variables de entorno de Firebase. Asegúrate de configurar todas las variables requeridas.');
  process.exit(1);
}

// Leer la plantilla
const templatePath = path.join(__dirname, 'public', 'js', 'config.template.js');
const configPath = path.join(__dirname, 'public', 'js', 'config.js');

let template = fs.readFileSync(templatePath, 'utf8');

// Reemplazar placeholders con valores reales
template = template.replace('FIREBASE_API_KEY', apiKey);
template = template.replace('FIREBASE_AUTH_DOMAIN', authDomain);
template = template.replace('FIREBASE_PROJECT_ID', projectId);
template = template.replace('FIREBASE_STORAGE_BUCKET', storageBucket);
template = template.replace('FIREBASE_MESSAGING_SENDER_ID', messagingSenderId);
template = template.replace('FIREBASE_APP_ID', appId);

// Escribir el archivo de configuración
fs.writeFileSync(configPath, template);

console.log('Archivo de configuración generado con éxito.');
