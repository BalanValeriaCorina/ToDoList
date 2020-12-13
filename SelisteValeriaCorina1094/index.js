const canvas = document.getElementById("canvas-img");
const context = canvas.getContext("2d");

window.onload = function() {
    let baseImage = new Image();
    baseImage.src = "assets/images/moon.jpg";
    baseImage.onload = function() {
        context.drawImage(baseImage, 0, 0);
    }
}