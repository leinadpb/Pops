let loadState = {
    preload:function () {

        //Add loading label to screen
        let loadingLabel = game.add.text(20, game.world.height, "Cargando...", {font:'18px Arial', fill:'#fff'});

        game.load.image('bg', 'assets/images/background.png');
        game.load.spritesheet('player', 'assets/images/spriteSheet_player.png',50,54);
        game.load.spritesheet('enemy', 'assets/images/spriteSheet_enemy.png',46,32);
        game.load.spritesheet('platform', 'assets/images/spriteSheet_platform.png',64,64);
        game.load.image('logo', 'assets/images/logo.png');
        //game.load.image('bgFull', 'assets/images/BackgroundFull.png');
        game.load.image('tile', 'assets/images/tile.png');
        game.load.image('star1', 'assets/images/item1.png');
        game.load.image('enemyLimit', 'assets/images/enemyLimit.png');
        game.load.image('single', 'assets/images/single.png');


        //Audio
        game.load.audio('collectStar1', 'assets/audio/collect.wav');

    },
    create:function () {
        game.state.start('menu');
    }
};