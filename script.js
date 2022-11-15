const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = 750;
ctx.font = '50px Impact';
const gravity = 0.5;
let globalVolume = 20 / 100;

const music = new Audio();
music.src = 'sound/Town.mp3';
music.volume = globalVolume;
music.loop = true;

let hasYellowKey = false;
let yellowWall = true;
let won = false;
let started = false;
//images
const tileimg = new Image();
tileimg.src = "img/Tiles/grassHalfMid.png";

/* backgrounds */

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'img/backgrounds/layer1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'img/backgrounds/layer2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'img/backgrounds/layer3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'img/backgrounds/layer4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'img/backgrounds/layer5.png';
const backgroundLayer6 = new Image();
backgroundLayer6.src = 'img/backgrounds/layer6.png';
const backgroundLayer7 = new Image();
backgroundLayer7.src = 'img/backgrounds/layer7.png';
/*end backgrounds setup*/
const player1 = new Image();
player1.src = 'img/Player/p3_walk/PNG/p3_walk01.png';
const player2 = new Image();
player2.src = 'img/Player/p3_walk/PNG/p3_walk02.png';
const player3 = new Image();
player3.src = 'img/Player/p3_walk/PNG/p3_walk03.png';
const player4 = new Image();
player4.src = 'img/Player/p3_walk/PNG/p3_walk04.png';
const player5 = new Image();
player5.src = 'img/Player/p3_walk/PNG/p3_walk05.png';
const player6 = new Image();
player6.src = 'img/Player/p3_walk/PNG/p3_walk06.png';
const player7 = new Image();
player7.src = 'img/Player/p3_walk/PNG/p3_walk07.png';
const player8 = new Image();
player8.src = 'img/Player/p3_walk/PNG/p3_walk08.png';
const player9 = new Image();
player9.src = 'img/Player/p3_walk/PNG/p3_walk09.png';
const player10 = new Image();
player10.src = 'img/Player/p3_walk/PNG/p3_walk10.png';
const player11 = new Image();
player11.src = 'img/Player/p3_walk/PNG/p3_walk11.png';
/* player animation */
const playerAnim = [
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
    player7,
    player8,
    player9,
    player10,
    player11
];

/*player animation end*/

//images end

//pickups//

class Pickup {
    constructor(x, y, width, height, points, image, bounce = 10, sound = coinSound) {
        this.position = {
            x,
            y
        }
        this.width = width;
        this.height = height;
        this.points = points;
        this.image = image;
        this.startY = y;
        this.bounce = bounce;
        this.markForDelete = false;
        this.sound = new Audio();
        this.sound.src = 'sound/' + sound + '.wav';
        this.sound.volume = globalVolume;
        this.frame = 0;
        this.frames = image.length;
    }
    draw() {
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.image[0], this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.position.y = this.startY + Math.round(this.bounce * Math.sin(gameFrame / 10));
    }
    updateFrames() {
        this.frame++;
        this.frame %= this.frames;
    }
}
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 72;
        this.height = 97;
        this.frame = 0;
        this.speed = 5;
    }

    draw() {
        ctx.drawImage(playerAnim[this.frame], this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        player.speed = 5;
        this.velocity.y += gravity;

        [...GROUND, ...platforms].forEach(platform => {

            if (player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width) {
                player.velocity.y = 0;
                player.position.y = platform.position.y - 1 - player.height;
                jumping = false;
            }

            if (
                keys.right.pressed &&
                platform.position.y < player.position.y + player.height &&
                player.position.y < platform.position.y + platform.height &&
                player.position.x + player.speed + player.width >= platform.position.x &&
                player.position.x + player.speed <= platform.position.x + platform.width &&
                !((player.position.x < platform.position.x + platform.width) && (player.position.x + player.width / 2 > platform.position.x))
            ) {
                player.speed = 0;
                player.velocity.x = 0;
            }
            if (
                keys.left.pressed &&
                platform.position.y < player.position.y + player.height &&
                player.position.y < platform.position.y + platform.height &&
                player.position.x - player.speed + player.width >= platform.position.x &&
                player.position.x - player.speed <= platform.position.x + platform.width &&
                !((player.position.x < platform.position.x + platform.width) && (player.position.x + player.width / 2 > platform.position.x))
            ) {
                player.speed = 0;
                player.velocity.x = 0;
            }

        });

        pickups.forEach(pickup => {
            if (!((player.position.x + player.width) < pickup.position.x ||
                player.position.x > (pickup.position.x + pickup.width) ||
                (player.position.y + player.height) < pickup.position.y ||
                player.position.y > (pickup.position.y + pickup.height))) {
                pickup.markForDelete = true;
                pickup.sound.play();
                points += pickup.points;
                if (pickup.image[0] == keyYellow) {
                    hasYellowKey = true;
                }
                console.log("Points: " + points);
            }

        });

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    }
}

class Platform {
    constructor(x, y, width, height = 40, image = tileimg) {
        this.position = {
            x,
            y
        }
        this.width = width;
        this.height = height;
        this.image = image;
        this.markForDelete = false;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}



class Layer {
    constructor(image, speedModifier, width) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = 600;

        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = scrollOffset * this.speedModifier;
    }
    update() {
        if (keys.right.pressed && player.velocity.x == 0) {
            this.speed = player.speed * this.speedModifier;
        }
        else if (keys.left.pressed && player.velocity.x == 0) {
            this.speed = -player.speed * this.speedModifier;
        }
        else this.speed = 0;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
const coinGold = new Image();
coinGold.src = 'img/Items/coinGold.png';
const mushroom = new Image();
mushroom.src = 'img/Items/mushroomBrown.png';
const keyYellow = new Image();
keyYellow.src = 'img/Items/keyYellow.png';

const boxAltImg = new Image();
boxAltImg.src = 'img/Tiles/boxAlt.png';

const castleMidImgTop = new Image();
castleMidImgTop.src = 'img/Tiles/castle.png';

const castleCliffRightAltImg = new Image();
castleCliffRightAltImg.src = 'img/Tiles/castleCliffRightAlt.png';

const castleCliffLeftAltImg = new Image();
castleCliffLeftAltImg.src = 'img/Tiles/castleCliffLeftAlt.png';

const castleCenterImg = new Image();
castleCenterImg.src = 'img/Tiles/castleCenter.png';

const lockYellowImg = new Image();
lockYellowImg.src = 'img/Tiles/lock_yellow.png';

const flagImg1 = new Image();
flagImg1.src = 'img/Items/flagBlue.png';
const flagImg2 = new Image();
flagImg2.src = 'img/Items/flagBlue2.png';

const flag = [
    flagImg1,
    flagImg2
]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}

let scrollOffset = 0;
let gameFrame = 0;
let points = 0;
let player = new Player();
let pickups = []
let jumping = false;

const layers = [
    new Layer(backgroundLayer7, 1, 5252),
    new Layer(backgroundLayer6, 0.8, 7349),
    new Layer(backgroundLayer5, 0.6, 5948),
    new Layer(backgroundLayer4, 0.4, 5410),
    new Layer(backgroundLayer3, 0.3, 5343),
    new Layer(backgroundLayer2, 0.2, 2618),
    new Layer(backgroundLayer1, 0.1, 6000)
];
let platforms = [];
let GROUND = [];


function init() {
    scrollOffset = 0;
    gameFrame = 0;
    points = 0;
    hasYellowKey = false;
    yellowWall = true;
    won = false;
    
    music.pause();
    music.currentTime = 0;
    music.play();

    player = new Player();
    pickups = [
        new Pickup(200, 200, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(400, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(450, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(500, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(1400, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(1650, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(2500, 480, 70, 70, 500, [mushroom], 0, 'mushroom'),
        new Pickup(800, 400, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(1200, 100, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(1300, 100, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3200, 480, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3300, 480, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3400, 480, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3500, 480, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3500, 480, 70, 70, 500, [coinGold], 10, 'coin'),
        new Pickup(3900, 70, 70, 70, 500, [keyYellow], 15, 'coin'),
        new Pickup(7040, 480, 70, 70, 0, flag, 5, 'coin'),

    ]
    //end pickups//

    platforms = [
        new Platform(50, 400, 200),

        new Platform(850, 350, 50),
        new Platform(1000, 200, 400),
        new Platform(1650, 300, 150),
        new Platform(1850, 350, 100),
        new Platform(2050, 400, 200),
        new Platform(2350, 300, 150),
        new Platform(2650, 350, 150),
        new Platform(2950, 400, 200),
        new Platform(3350, 300, 50),
        new Platform(3500, 150, 50),
        new Platform(3700, 150, 250),
        new Platform(3730, 480, 70, 70, boxAltImg),
        new Platform(3805, 480, 70, 70, boxAltImg),
        new Platform(3880, 480, 70, 70, boxAltImg),

        new Platform(4000, 410, 80, 70, castleCliffLeftAltImg),
        new Platform(4070, 410, 70, 70, castleMidImgTop),
        new Platform(4130, 410, 80, 70, castleCliffRightAltImg),
        new Platform(4070, 480, 70, 70, castleCenterImg),

        new Platform(4300, 350, 80, 70, castleCliffLeftAltImg),
        new Platform(4370, 350, 70, 70, castleMidImgTop),
        new Platform(4430, 350, 80, 70, castleCliffRightAltImg),
        new Platform(4370, 410, 70, 70, castleCenterImg),
        new Platform(4370, 480, 70, 70, castleCenterImg),

        new Platform(4600, 350, 80, 70, castleCliffLeftAltImg),
        new Platform(4670, 350, 500, 70, castleMidImgTop),
        new Platform(5130, 350, 80, 70, castleCliffRightAltImg),
        new Platform(4670, 400, 500, 80, castleCenterImg),
        new Platform(4670, 480, 500, 70, castleCenterImg),

        new Platform(5200, 480, 70, 70, boxAltImg),

        new Platform(5400 + 5 * 70 - 10, 350, 80, 70, castleCliffRightAltImg),
        new Platform(5400, 210, 70, 70, castleMidImgTop),
        new Platform(5400 + 140, 210, 70, 70, castleMidImgTop),
        new Platform(5400 + 280, 210, 70, 70, castleMidImgTop),
        new Platform(5400, 270, 5 * 70, 550 - 270, castleCenterImg),


        new Platform(6500, 480, 70, 70, lockYellowImg),
        new Platform(6500, 410, 70, 70, lockYellowImg),
        new Platform(6500, 340, 70, 70, lockYellowImg),
        new Platform(6500, 270, 70, 70, lockYellowImg),
        new Platform(6500, 200, 70, 70, lockYellowImg),
        new Platform(6500, 130, 70, 70, lockYellowImg),
    ];

    GROUND = [
        new Platform(0, 550, 740, 200),
        new Platform(900, 550, 150, 200),
        new Platform(1200, 550, 4000, 200),
        new Platform(4100, 550, 4500, 200),
        new Platform(4650, 550, 4900, 200),
        new Platform(5000, 550, 7000, 200)
    ];

    jumping = false;

    layers.forEach(layer => {
        layer.x = 0;
    })
    won = false;
}



function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Punkty: ' + points, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Punkty:' + points /*+ "player x ="+ player.position.x + " Offset:" + scrollOffset + " Sum:" + (player.position.x - scrollOffset)*/, 55, 80);
}

function removeYellowWall() {
    console.log('deleteWall')
    platforms.forEach(platform => {
        if (platform.image == lockYellowImg) {
            platform.markForDelete = true;
            console.log('marked' + platform);
        }

    })
    platforms = platforms.filter(object => !object.markForDelete);
    yellowWall = false;
}

function winScreen() {
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillText("Zwycięstwo!", canvas.width / 2 - 150, 300);
    ctx.fillStyle = 'White';
    ctx.fillText("Zwycięstwo!", canvas.width / 2 - 145, 295);
    ctx.fillText("Kliknij, żeby zagrać jeszce raz!", canvas.width / 2 - 295, 405);

}
function startScreen() {
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillText("Kliknij żeby zacząć!", canvas.width / 2 - 150, 300);
    ctx.fillStyle = 'White';
    ctx.fillText("Kliknij żeby zacząć!", canvas.width / 2 - 145, 295);

}

function animate() {

    gameFrame++;
    if (!started) {

        startScreen();
    } else if (!won) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let j = 6; j > 0; j--) {
            layers[j].draw();
        }


        [...GROUND, ...platforms].forEach(platform => { platform.draw(); });
        player.draw();

        layers[0].draw();
        player.update();





        pickups.forEach(pickup => {
            pickup.update();
            pickup.draw();
        })

        drawScore();

        pickups = pickups.filter(object => !object.markForDelete);

        if (keys.left.pressed || keys.right.pressed) {
            if (gameFrame % 3 == 0) {
                player.frame++;
                pickups.forEach(pickup => { pickup.updateFrames() });
            }
            player.frame %= playerAnim.length;
        }


        if (keys.left.pressed && player.position.x > 100) {
            player.velocity.x = -player.speed;

        } else if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = player.speed;
        } else {
            player.velocity.x = 0;
            if (keys.right.pressed) {
                scrollOffset -= player.speed;
                [...GROUND, ...pickups, ...platforms].forEach(platform => { platform.position.x -= player.speed; });
                layers.forEach(layer => {
                    layer.update();
                })
            }
            if (keys.left.pressed) {
                scrollOffset += player.speed;
                [...GROUND, ...pickups, ...platforms].forEach(platform => { platform.position.x += player.speed; });
                layers.forEach(layer => {
                    layer.update();
                })
            }
        }

        if (player.position.x + (-scrollOffset) >= 6400 &&
            player.position.x + (-scrollOffset) <= 6450 &&
            hasYellowKey == true &&
            yellowWall == true
        ) {
            removeYellowWall();
        }

        //win
        if (player.position.x + (-scrollOffset) >= 7000) {
            won = true;
        }
    }
    else {
        winScreen();
    }

    //lose
    if (player.position.y > canvas.height) {
        init();
    }


    requestAnimationFrame(animate);
}


animate();

addEventListener('keydown', (e) => {

    switch (e.keyCode) {
        case 65:
            //left
            keys.left.pressed = true;
            break;
        case 83:
            //down
            break;
        case 68:
            //right
            keys.right.pressed = true;
            break;
        case 87:
            //down
            if (!jumping) player.velocity.y -= 15;
            jumping = true;
            break;
    }
});

addEventListener('keyup', (e) => {

    switch (e.keyCode) {
        case 65:
            //left
            keys.left.pressed = false;
            break;
        case 83:
            //down
            break;
        case 68:
            //right
            keys.right.pressed = false;
            break;
        case 87:
            //down
            break;
    }
});

addEventListener('mousedown', (e) => {
    if (won) {
        init();
    }
    if(!started){
        started = true;
        init();
    }
});
function updateVolume(volume) {
    globalVolume = volume / 100;
    music.volume = globalVolume;
    [...pickups].forEach(obj => { obj.sound.volume = globalVolume });
}