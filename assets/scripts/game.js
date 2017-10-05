//Game context

let game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game');

setTimeout(function () {
    //Game states
    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('menu', menuState);
    game.state.add('play', playState);
    game.state.add('win', winState);

    game.state.start('boot'); //Start game
},400);