window.onload = function() {
    /** Cool 3d card effect for the logo */
    let cardLogo = document.getElementById('card-logo');
    let cardLogoContainer = document.getElementById('card-logo-container');
    let cardW = cardLogo.clientWidth;
    let cardH = cardLogo.clientHeight;

    document.addEventListener('mouseover', (e) => {
        let xAxis = (-(e.pageX - cardW) / 12) / 3;
        let yAxis = ((e.pageY - cardH) / 12) / 3;
        cardLogo.style.transform = `rotateY(${xAxis.toFixed(2)}deg) rotateX(${yAxis.toFixed(2)}deg)`;
        //cardLogoContainer.style.transform = `rotateY(${xAxis.toFixed(2)}deg) rotateX(${yAxis.toFixed(2)}deg)`;
    });
}