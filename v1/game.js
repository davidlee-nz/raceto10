

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('lvl1', lvl1);

game.state.start('lvl1');

