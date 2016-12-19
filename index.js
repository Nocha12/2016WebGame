(function() {

    window.addEventListener('load', draw);

    function draw() {
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");

        for (let i = 0; i < 5; i++) {
            context.fillStyle = `rgb(${255 - (i * 30)}, 0, 0)`;
            context.fillRect(i * 60 + 10, 10, 50, 50);
        }

        for (let i = 0; i < 5; i++) {
            context.fillStyle = `rgb(0, ${255 - (i * 30)}, 0)`;
            context.beginPath();
            context.moveTo(i * 60 + 25 + 10, 70);
            context.lineTo(i * 60 + 10, 120);
            context.lineTo((i + 1) * 60, 120);
            context.fill();
        }

        for (let i = 0; i < 5; i++) {
            context.strokeStyle = `rgb(0, 0, ${255 - (i * 30)})`
            context.lineWidth = i + 1;
            context.beginPath();
            context.arc(i * 60 + 25 + 10, 155, 25, 0, Math.PI * (i + 1) * 0.3);
            context.stroke();
        }
    }
})();
