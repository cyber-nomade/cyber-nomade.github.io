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