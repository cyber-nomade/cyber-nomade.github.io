console.log('=== SCRIPT INDEX.JS CARGADO ===');

// Variables globales para el audio
let backgroundMusic;
let introAudio = null; // pista de intro en reproducción
let isIntroPlaying = false; // evita reactivar portada durante la intro
let isAudioEnabled = false; // Inicialmente deshabilitado hasta que el usuario elija
let audioActivated = false;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    backgroundMusic = document.getElementById('background-music');
    
    // Configurar eventos de audio para loop continuo
    setupAudioEvents();
    
    // Mostrar la pantalla de activación de audio
    showAudioActivationScreen();
});

// Función para configurar eventos de audio
function setupAudioEvents() {
    if (backgroundMusic) {
        // Asegurar que el audio se reinicie inmediatamente cuando termine
        backgroundMusic.addEventListener('ended', function() {
            if (isAudioEnabled && !isIntroPlaying) {
                this.currentTime = 0;
                this.play().catch(error => {
                    console.log('Error al reiniciar audio:', error);
                });
            }
        });
        
        // Manejar errores de carga
        backgroundMusic.addEventListener('error', function(e) {
            console.log('Error de audio:', e);
        });
        
        // Asegurar que el audio esté listo para reproducir
        backgroundMusic.addEventListener('canplaythrough', function() {
            console.log('Audio listo para reproducir');
        });
    }
}

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
    if (isIntroPlaying) {
        // No reproducir portada si está sonando la intro
        return;
    }
    if (backgroundMusic && isAudioEnabled) {
        backgroundMusic.volume = 0.3; // Volumen moderado
        backgroundMusic.loop = true; // Asegurar que esté en loop
        
        // Intentar reproducir el audio
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio iniciado correctamente');
            }).catch(error => {
                console.log('No se pudo reproducir el audio:', error);
                // Intentar cargar el audio si hay error
                backgroundMusic.load();
            });
        }
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

// Función para verificar y mantener el loop del audio
function checkAudioLoop() {
    if (backgroundMusic && isAudioEnabled && !isIntroPlaying) {
        // Si el audio está pausado pero debería estar reproduciéndose, reiniciarlo
        if (backgroundMusic.paused && !backgroundMusic.ended) {
            playBackgroundMusic();
        }
    }
}

// Verificar el estado del audio cada 5 segundos
setInterval(checkAudioLoop, 5000);

function salirJuego() {
    document.querySelector(".game-container").style.display = "flex";
    document.getElementById("twine-container").style.display = "none";
    
    // Volver a reproducir la música de fondo cuando se sale del juego
    if (isAudioEnabled) {
        playBackgroundMusic();
    }
}

async function iniciarJuego() {
    console.log('=== INICIAR JUEGO LLAMADO ===');
    
    // Reproducir audio de intro al iniciar el juego
    console.log('play intro music');
    
    playIntroMusic();
    
    console.log('Ocultando game-container y mostrando twine-container');
    document.querySelector(".game-container").style.display = "none";
    document.getElementById("twine-container").style.display = "block";
    
    console.log('=== INICIAR JUEGO COMPLETADO ===');
}

// Función para reproducir música de intro
function playIntroMusic() {
    console.log("playIntroMusic");
    
    if (!isAudioEnabled) {
        console.log('Audio deshabilitado: no se reproducirá la intro');
        return;
    }

    isIntroPlaying = true;

    // Detener completamente la música de fondo
    if (backgroundMusic) {
        try {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0; // Resetear al inicio
        } catch (e) {
            console.log('Error al pausar portada:', e);
        }
    }

    // Si ya hay una intro sonando, detenerla
    if (introAudio) {
        try {
            introAudio.pause();
            introAudio.currentTime = 0;
        } catch (e) {
            console.log('Error al pausar intro previa:', e);
        }
    }
    
    // Crear un nuevo elemento de audio para la intro y guardarlo globalmente
    introAudio = new Audio('assets/audio/intro.wav');
    introAudio.volume = 0.3; // Mismo volumen que la música de fondo
    introAudio.loop = false; // reproducir una vez
    
    // Reproducir la intro
    const p = introAudio.play();
    if (p && typeof p.then === 'function') {
        p.then(() => console.log('Intro reproduciéndose'))
         .catch(error => {
            console.log('No se pudo reproducir el audio de intro:', error);
         });
    }
    
    // Cuando termine la intro, mantener portada silenciada (no reanudar)
    introAudio.addEventListener('ended', function() {
        console.log('Intro terminada');
        isIntroPlaying = false;
    });
}

// Exponer funciones en el objeto global para evitar problemas de alcance
window.iniciarJuego = iniciarJuego;
window.playIntroMusic = playIntroMusic;
window.toggleAudio = toggleAudio;
window.activateAudio = activateAudio;
window.salirJuego = salirJuego;

async function pantallaCompleta() {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
        }
        
        // Ocultar mensaje de orientación y mostrar juego
        const orientationMessage = document.getElementById('orientation-message');
        const gameContainer = document.querySelector('.game-container');
        
        if (orientationMessage) orientationMessage.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'flex';
    } catch (err) {
        console.log("Error al pedir fullscreen:", err);
    }
}

function continuarSinPantallaCompleta() {
    document.getElementById("orientation-message").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
}