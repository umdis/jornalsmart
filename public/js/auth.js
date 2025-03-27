// Manejo de autenticación
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

// Función para iniciar sesión
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Usuario logueado:', userCredential.user.email);
        loginForm.reset();
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        alert('Error al iniciar sesión: ' + error.message);
    }
});

// Función para cerrar sesión
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        console.log('Sesión cerrada');
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        alert('Error al cerrar sesión: ' + error.message);
    }
});

// Observer para cambios en el estado de autenticación
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuario logueado
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        userName.textContent = user.email.split('@')[0];
        
        // Cargar datos iniciales
        loadDashboardData();
        loadTrabajadores();
        loadActividades();
        loadJornales();
        loadReportFilters();
    } else {
        // Usuario no logueado
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
});

// Función para crear un usuario administrador
// Esta función puede ser utilizada una sola vez para crear el primer usuario
// adminUser('admin@finca.com', '2025_Finca');
async function adminUser(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('Administrador creado:', userCredential.user.email);
        
        // Guardamos el usuario en Firestore con rol de administrador
        await db.collection('usuarios').doc(userCredential.user.uid).set({
            email: userCredential.user.email,
            rol: 'admin',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Rol de administrador asignado');
    } catch (error) {
        console.error('Error al crear administrador:', error.message);
    }
}