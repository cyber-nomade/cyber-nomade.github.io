// Variables globales para el audio
let backgroundMusic;
let isAudioEnabled = false; // Inicialmente deshabilitado hasta que el usuario elija
let audioActivated = false;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    backgroundMusic = document.getElementById('background-music');
    
    // Mostrar la pantalla de activación de audio
    showAudioActivationScreen();
});

// Función para mostrar la pantalla de activación de audio
function showAudioActivationScreen() {
    const audioScreen = document.getElementById('audio-activation-screen');
    const gameContainer = document.querySelector('.game-container');
    const orientationMessage = document.getElementById('orientation-message');
    
    // Ocultar otros elementos
    if (gameContainer) gameContainer.style.display = 'none';
    if (orientationMessage) orientationMessage.style.display = 'none';
    
    // Mostrar pantalla de audio
    if (audioScreen) audioScreen.style.display = 'flex';
}

// Función para ocultar la pantalla de activación de audio
function hideAudioActivationScreen() {
    const audioScreen = document.getElementById('audio-activation-screen');
    if (audioScreen) audioScreen.style.display = 'none';
}

// Función principal para activar/desactivar audio
function activateAudio(enableAudio) {
    isAudioEnabled = enableAudio;
    audioActivated = true;
    
    // Ocultar la pantalla de activación
    hideAudioActivationScreen();
    
    // Mostrar el contenido principal
    showMainContent();
    
    // Si el usuario eligió activar audio, reproducirlo
    if (isAudioEnabled) {
        playBackgroundMusic();
    }
    
    // Actualizar el botón de audio
    updateAudioButton();
}

// Función para mostrar el contenido principal
function showMainContent() {
    const gameContainer = document.querySelector('.game-container');
    const orientationMessage = document.getElementById('orientation-message');
    
    // Verificar si estamos en móvil portrait
    if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
        // Mostrar mensaje de orientación en móviles portrait
        if (orientationMessage) orientationMessage.style.display = 'flex';
    } else {
        // Mostrar contenido principal
        if (gameContainer) gameContainer.style.display = 'flex';
    }
}

// Función para reproducir música de fondo
function playBackgroundMusic() {
    if (backgroundMusic && isAudioEnabled) {
        backgroundMusic.volume = 0.3; // Volumen moderado
        backgroundMusic.play().catch(error => {
            console.log('No se pudo reproducir el audio:', error);
        });
    }
}

// Función para pausar música de fondo
function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Función para actualizar el botón de audio
function updateAudioButton() {
    const audioIcon = document.getElementById('audio-icon');
    
    if (isAudioEnabled) {
        audioIcon.textContent = '🔊';
        audioIcon.title = 'Activar/Desactivar música';
    } else {
        audioIcon.textContent = '🔇';
        audioIcon.title = 'Activar/Desactivar música';
    }
}

// Función para alternar audio (usado por el botón de control)
function toggleAudio() {
    if (isAudioEnabled) {
        // Deshabilitar audio
        isAudioEnabled = false;
        pauseBackgroundMusic();
    } else {
        // Habilitar audio
        isAudioEnabled = true;
        playBackgroundMusic();
    }
    updateAudioButton();
}

function salirJuego() {
    document.querySelector(".game-container").style.display = "flex";
    document.getElementById("twine-container").style.display = "none";
}

async function iniciarJuego() {
    document.querySelector(".game-container").style.display = "none";
    document.getElementById("twine-container").style.display = "block";
}

async function pantallaCompleta() {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
        }
    } catch (err) {
        console.log("Error al pedir fullscreen:", err);
    }
}

function continuarSinPantallaCompleta() {
    document.getElementById("orientation-message").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
}