let menuState = {
    create:function () {

        game.add.sprite(game.world.width/2 - game.cache.getImage('logo').width/2, game.world.height/2 - game.cache.getImage('logo').height, 'logo');

        let txt = "Presiona 'enter' para empezar.";
        let txtStyle = {fill:'#fff', font:'18px Arial'};
        game.add.text(game.world.width/2 - 90, game.world.height/2 + 20,txt,txtStyle);

        let enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(this.start, this);

    },
    start:function () {
        game.state.start('play');
    }
};