let tile;
let tileHeight;
let tileWidth;
let single;
let singleHeight;
let singleWidth;

let platform;
let singles;

let player;

let keys;

let hitPlatform;
let hitSingle;
let isJumping;
let enemyHitPlatform;
let enemyLimit;
let et;
let el; //Enemy limit

let stars1;
let star1;
let sound_star1;

let enemies;
let enemy;
let enemySpeed = 150;
let enemyObjectList = [];
let enemyId = 0;

let killIt;

//Score
let txtScore;
let score;
let gameScore;

let playState = {
    create:function () {

        game.world.setBounds(0,0,10000,800);
        game.add.tileSprite(0,0,10000,800,'bg');//Background as a tile sprite

        tileHeight = game.cache.getImage('tile').height;
        tileWidth = game.cache.getImage('tile').width;
        singleHeight = tileHeight;
        singleWidth = 2 * tileWidth;

        platform = game.add.group();
        platform.enableBody = true;
        singles = game.add.group();
        singles.enableBody = true;
        stars1 = game.add.group();
        stars1.enable = true;
        enemies = game.add.group();
        enemies.enableBody = true;
        enemyLimit = game.add.group();
        enemyLimit.enableBody = true;

        CreatePlatform();

        CreatePlayer();

        game.camera.follow(player);

        keys = game.input.keyboard.createCursorKeys();

        //Score
        txtScore = "Score: 0";
        score = 0;
        let style = {font:'24px Arial', fill:'#fff'};
        gameScore = game.add.text(10, 10, txtScore, style);
        gameScore.fixedToCamera = true;

        //Add sound
        sound_star1 = game.add.audio('collectStar1');

    },
    update:function () {

        killIt = true;

        hitPlatform = game.physics.arcade.collide(player, platform);

        hitSingle = game.physics.arcade.overlap(player, singles,putSingleDown, null, this);

        game.physics.arcade.collide(stars1, platform);
        game.physics.arcade.collide(stars1, singles);


        enemyHitPlatform = game.physics.arcade.collide(enemies, platform);
        game.physics.arcade.overlap(player, stars1, collectStar1, null, this);

        //Enemy ---------------------------------------------------------------
        let collideEnemies = game.physics.arcade.overlap(enemies, enemyLimit, CollideEnemies, null, this);

        enemies.forEach(function (e) {
            e.body.velocity.x = e.speed;
        });

        //Player -----------------------------------------------------------------
        if(keys.right.isDown){
            player.animations.play('right');
            player.body.velocity.x = 280;
        }else if(keys.left.isDown){
            player.animations.play('left');
            player.body.velocity.x = -280;
        }else if(keys.down.isDown){
            player.animations.play('down');
            killIt = false;
        }else{
            if(!isJumping){
                player.animations.stop();
                player.frame = 10;
            }
        }
        //Check for jumping - Player
        if(keys.up.isDown && (hitPlatform || hitSingle)){
            isJumping = true;
            setTimeout(function () {
                isJumping = false;
            },1000);
            player.animations.play('jump');
            player.body.velocity.y = -750;
        }

        //Check for Game Over
        if(player.body.y >= game.world.height-2){
            killPlayer();
        }
        if(killIt){
            game.physics.arcade.overlap(player, enemies, killPlayer, null, this);
        }
        if(player.body.y >= (game.world.height - tileHeight)){
            player.body.collideWorldBounds = false;
            killPlayer();
        }
    },
    render:function () {
       // game.debug.spriteInfo(player, 32, 32);
    }
};
function putSingleDown(player, single) {
    game.physics.arcade.collide(player, single);
    setTimeout(function () {
        single.collideWorldBounds = true;
        single.body.immovable = false;
        single.body.gravity.y = 9.8;
    },500);

}
function killPlayer() {
    player.kill();
    game.state.start('play');
}
function CollideEnemies(e, limit) {
    if(e.body.velocity.x > 0){
        e.animations.play('left');
        e.body.velocity.x = -150;
        e.speed = -enemySpeed;
    }else{
        e.animations.play('right');
        e.body.velocity.x = 150;
        e.speed = enemySpeed;
    }

    if(e.body.x > 0 && e.body.velocity.x > 0){
        e.body.velocity.x = 150;
        e.speed = enemySpeed;

    }
    if(e.body.x > 0 && e.body.velocity.x < 0){
        //Default
        e.animations.play('left');
        e.body.velocity.x = -150;
        e.speed = -enemySpeed;
    }
}

function putTile(x,y,frame) {
    tile = platform.create(x,y,'platform');
    tile.frame = frame;
    tile.body.immovable = true;

}
function putSingle(x,y) {
    single = singles.create(x,y,'single');
    game.physics.arcade.enable(single, Phaser.Physics.ARCADE);
    single.body.immovable = true;

}
function CreatePlayer() {
    player = game.add.sprite(10,game.world.height - tileHeight - game.cache.getImage('player').height, 'player');
    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.enableBody = true;
    player.body.gravity.y = 2000;
    player.body.drag.x = 3500;
    player.body.bounce.y = 0.18;
    player.frame = 10;

    //Animations
    player.animations.add('right', [4,5,6,5], 10, true);
    player.animations.add('left', [9,8,7,8], 10, true);
    player.animations.add('jump', [10], 60, true);
    player.animations.add('down', [11], 10, true);
}
function CreateEnemy(x,y) {
    enemy = enemies.create(x,y,'enemy');
    game.physics.arcade.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.enableBody = true;
    enemy.body.gravity.y = 2000;
    enemy.body.drag.x = 2000;

    //Animation
    enemy.animations.add('right', [0,1,2], 10, true);
    enemy.animations.add('left', [3,4,5], 10, true);

    //Init
    enemy.animations.play('left');
    enemy.body.velocity.x = - enemySpeed;

    //Create
    //let object = new Enemy(enemy, enemy.body.velocity.x, enemyId);
    //enemyId++;
    //enemyObjectList.push(object);

    enemy.speed = enemy.body.velocity.x;
    enemy.id = enemyId;
    enemyId++;

}
function putEnemyLimit(x,y) {
    el = enemyLimit.create(x,y,'enemyLimit');
    el.enableBody = true;
    game.physics.enable(el, Phaser.Physics.ARCADE);
    el.body.immovable = true;
}
function CreatePlatform() {
    let x = 0;
    let y = game.world.height - tileHeight;
    let emptySpace = 90;
    let C = 80;

    //First 640 px on screen
    for(let i = 1; i <= 10; i++){
        if(i === 1){
            putTile(x, y , 1); //First tile for package

        }else if(i === 10){
            putTile(x, y , 0); //Last tile for package
        }else{
            putTile(x, y, 4); //Intermediate tile for package
        }
        x += tileWidth;
    }

    //Next 1727 px on screen.
    x += emptySpace;
    y -= emptySpace;
    putSingle(x,y);

    x += emptySpace + 2*C;
    y += emptySpace;
    putSingle(x,y);

    x += emptySpace + 2*C;
    y -= emptySpace + 20;
    putSingle(x,y);

    x += emptySpace + 2*C;
    y -= emptySpace + 20;
    putSingle(x,y);

    x += emptySpace + 2*C;
    y -= emptySpace + 20;
    putSingle(x,y);

    x += emptySpace + 3*C;
    y += 3 * emptySpace;
    putSingle(x,y);

    x -= emptySpace + 3*C;
    y += C/2;
    putSingle(x,y);

    x += 2*emptySpace + 5*C + tileWidth;
    y = game.world.height - tileHeight;

    //Next 640 px on screen
    putEnemyLimit(2300,y - game.cache.getImage('enemyLimit').height);
    for(let i = 1; i <= 10; i++){
        if(i === 1){
            putTile(x, y , 1); //First tile for package

        }else if(i === 10){
            putTile(x, y , 0); //Last tile for package
        }else{
            putTile(x, y, 4); //Intermediate tile for package
        }
        x += tileWidth;
    }
    putEnemyLimit(x,y);
    
    
    
    //Add items
   // AddItems();

    //Add enemies
    CreateEnemy(2900,game.world.height - tileHeight - game.cache.getImage('enemy').height - 10);
    CreateEnemy(2500,game.world.height - tileHeight - game.cache.getImage('enemy').height - 10);

}
function addStar1(x) {
    star1 = stars1.create(x,game.world.height/2, 'star1');
    game.physics.arcade.enable(star1, Phaser.Physics.ARCADE);
    star1.enableBody = true;
    star1.body.gravity.y = 1200;
}
function AddItems() {
    addStar1(772);
    addStar1(1025);
    addStar1(1273);
    addStar1(1775);
    addStar1(2095);
    addStar1(1522);
    addStar1(1774);
}
function collectStar1(player, star) {
    score++;
    star.kill();
    sound_star1.play();
    gameScore.setText("Score: " + score.toString());
}
