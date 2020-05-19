const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');




document.getElementById('instructions').addEventListener('click', instruction);

function instruction() {

    this.innerHTML = '<p>Pop as many bubbles as you can before the bubbles occupy your whole screen!</p><p>A 10 second timer will be given before GAME - OVER!</p><p>Your score will be calculated according to the time elapsed.</p><p>Score represents time taken for popping one ball. So lower score is better result.</p>';
    document.getElementById('instructions').removeEventListener('click', instruction);
}

document.getElementById('play').addEventListener('click', function() {
    document.getElementById('intro').style.display = 'none';
    document.addEventListener('click', handleClick);

    function handleTimer() {
        if (count === 0) {
            clearInterval(timer);
            document.getElementById('timerCount').style.display = 'none';
            document.getElementById('outro').style.display = 'none';
            endCountdown();
        } else {
            document.getElementById('timerCount').style.display = 'block';
            document.getElementById('outro').style.display = 'block';
            document.getElementById('timerCount').innerHTML = count;
            count--;
        }
    }

    var count = 3;
    var timer = setInterval(function() { handleTimer(count); }, 1000);

});

const numberOfBubbles = 30;
var score;


window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

var clock = 0;

function endCountdown() {

    var counter = 0;
    var start;
    var end = numberOfBubbles;


    var addBubbles = setInterval(function() {
        var area = 0;

        for (let h = 0; h < particles.length; h++) {
            if (particles[h] === undefined) {

            } else {
                area += Math.PI * particles[h].radius * particles[h].radius;
            }

        }

        console.log(0.3 * innerHeight * innerWidth);
        console.log(area);


        if (area < 0.3 * innerHeight * innerWidth) {
            document.getElementById('timerCount').style.display = 'none';
            for (let n = 0; n < 20; n++) {
                if (counter >= n * 2 && counter < (n + 1) * 2) {
                    start = end;
                    end = start + counter;
                    init(start, end);
                    counter++;
                }

            }
        } else {
            var num = 3;
            clearInterval(addBubbles);
            var time = setInterval(function() {

                if (num === 0) {
                    clock += 3;
                    score = Math.floor(clock * 100 / click);
                    document.getElementById('timerCount').innerHTML = 'Game Over!!!';
                    document.getElementById('game-over').innerHTML = 'Score: ' + score;
                    document.getElementById('restart').style.display = 'block';
                    document.removeEventListener('click', handleClick);
                    clearInterval(time);
                } else {
                    document.getElementById('timerCount').style.display = 'block';
                    document.getElementById('game-over').style.display = 'block';
                    document.getElementById('outro').style.display = 'block';
                    document.getElementById('timerCount').innerHTML = num;
                    document.getElementById('game-over').innerHTML = 'Hurry Up!';
                    num--;
                }

            }, 1000);
        }

        clock += 3;

    }, 3000);


}




function getDist(x1, y1, x2, y2) {
    xDist = x2 - x1;
    yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function Particle(x, y, radius, color) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
    };
    this.mass = 1;

    this.update = function(particles) {

        this.draw();

        for (let m = 0; m < particles.length; m++) {
            if (this === particles[m]) {
                continue;
            }
            if (getDist(this.x, this.y, particles[m].x, particles[m].y) - this.radius - particles[m].radius < 0) {
                console.log('collided');
                resolveCollision(this, particles[m]);

            }
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

    };

    this.draw = function() {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();

    };

}

let particles = [];

function init(a, b) {

    for (let i = a; i < b; i++) {

        var radius = randomInteger(20, 60);
        var x = randomInteger(radius, canvas.width - radius);
        var y = randomInteger(radius, canvas.height - radius);
        var color = 'white';

        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (getDist(x, y, particles[j].x, particles[j].y) - radius - particles[j].radius < 0) {
                    var x = randomInteger(radius, canvas.width - radius);
                    var y = randomInteger(radius, canvas.height - radius);
                    j = -1;
                }
            }

        }

        particles.push(new Particle(x, y, radius, color));

    }
}


var click = 0;

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    for (let i = 0; i < particles.length; i++) {
        particles[i].update(particles);
    }




}

function handleClick(event) {

    for (let f = 0; f < particles.length; f++) {

        if (getDist(event.clientX, event.clientY, particles[f].x, particles[f].y) <= particles[f].radius) {
            console.log('clicked');

            click++;
            particles.splice(f, 1);
        }

    }
}




init(0, numberOfBubbles);
animate();




function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}



function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;


    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {


        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);


        const m1 = particle.mass;
        const m2 = otherParticle.mass;


        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);


        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };


        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);


        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}



/*function resolveCollision(particle1, particle2) {
    const xVelocityDiff = particle1.velocity.x - particle2.velocity.x;
    const yVelocityDiff = particle1.velocity.y - particle2.velocity.y;

    const xDist = particle2.x - particle1.x;
    const yDist = particle2.y - particle1.y;

    const v1x = particle1.x;
    const v1y = particle1.y;
    const v2x = particle2.x;
    const v2y = particle2.y;



    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {


        const angle = Math.atan2(particle2.y - particle1.y, particle2.x - particle1.x);

        let alongline2 = v1x * Math.cos(Math.PI * 2 - angle) + v1y * Math.cos(Math.PI / 2 - angle);
        let perpenline1 = v1x * Math.sin(Math.PI * 2 - angle) + v1y * Math.sin(Math.PI / 2 - angle);

        let alongline1 = v2x * Math.cos(Math.PI - angle) + v2y * Math.cos(Math.PI * 3 / 2 - angle);
        let perpenline2 = v2x * Math.sin(Math.PI - angle) + v2y * Math.sin(Math.PI * 3 / 2 - angle);


        let finalx1 = alongline1 * Math.cos(Math.PI / 2 + angle) + perpenline1 * Math.cos(Math.PI + angle);
        let finaly1 = alongline1 * Math.sin(Math.PI / 2 + angle) + perpenline1 * Math.sin(Math.PI + angle);

        let finalx2 = alongline2 * Math.cos(angle) + perpenline2 * Math.cos(Math.PI * 3 / 2 + angle);
        let finaly2 = alongline2 * Math.sin(angle) + perpenline2 * Math.sin(Math.PI * 3 / 2 + angle);


        particle1.velocity.x = finalx1;
        particle1.velocity.y = finaly1;

        particle2.velocity.x = finalx2;
        particle2.velocity.y = finaly2;

    }
}*/