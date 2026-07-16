let eventoInstalacion;

function iniciarSistema() {
    if(localStorage.getItem('apoyos') === null) {
        localStorage.setItem('apoyos','0');
        localStorage.setItem('alertas','0');
        localStorage.setItem('peligros','0');
        localStorage.setItem('estafas','0');
    }
    mostrarNumeros();
    registrarServiceWorker();
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault(); eventoInstalacion = e;
    });
}

function registrarServiceWorker() {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js');
    }
}

function obtener(clave) { return Number(localStorage.getItem(clave)) || 0; }
function guardar(clave, val) { localStorage.setItem(clave, String(val)); }

function mostrarNumeros() {
    document.getElementById('apoyos').textContent = obtener('apoyos');
    document.getElementById('alertas').textContent = obtener('alertas');
    document.getElementById('peligros').textContent = obtener('peligros');
    document.getElementById('estafas').textContent = obtener('estafas');
}

function sumar() {
    guardar('apoyos', obtener('apoyos')+1);
    guardar('alertas', obtener('alertas')+1);
    mostrarNumeros(); alert('✅ Apoyo sumado');
}

function restar() {
    guardar('apoyos', Math.max(0, obtener('apoyos')-1));
    mostrarNumeros(); alert('✅ Valor actualizado');
}

function analizar() {
    const texto = document.getElementById('consulta').value.toLowerCase();
    const palabras = ['gratis','dinero','ganaste','contraseña','sorteo','datos'];
    const riesgo = palabras.some(p => texto.includes(p));
    alert(riesgo ? '⚠️ Puede ser peligroso: no des datos' : '✅ Sin palabras de riesgo conocidas');
    guardar('peligros', obtener('peligros') + (riesgo ? 1 : 0));
    guardar('estafas', obtener('estafas') + (riesgo ? 1 : 0));
    mostrarNumeros();
}

async function activarAvisos() {
    if(!('Notification' in window)) return alert('⚠️ No soportado');
    const permiso = await Notification.requestPermission();
    alert(permiso === 'granted' ? '✅ Avisos activados' : '⚠️ No aceptado');
}

function activarUbicacion() {
    if(!navigator.geolocation) return alert('⚠️ No soportado');
    if(confirm('📍 Solo accedo si tú aceptas, sin guardar nada. ¿Aceptar?')) {
        navigator.geolocation.getCurrentPosition(() => alert('✅ Ubicación recibida solo para tu ayuda'));
    }
}

async function instalarApp() {
    if(!eventoInstalacion) return alert('ℹ️ Ya está instalada o no disponible');
    eventoInstalacion.prompt();
    const { outcome } = await eventoInstalacion.userChoice;
    alert(outcome === 'accepted' ? '✅ App instalada' : 'ℹ️ Instalación cancelada');
}

function verReglas() { window.open('reglas.html','_blank'); }
