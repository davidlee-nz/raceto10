// the game itself
var game;

// levels. Actually, just one.
var levels = [
    [
        [0, 0, 0, 0, 0, 0],
        [3, 2, 3, 2, 2, 2],
        [0, 0, 2, 3, 2, 2],
        [2, 0, 2, 2, 0, 0],
        [0, 2, 3, 0, 2, 2],
        [2, 3, 0, 2, 0, 4]
    ]
];

// this object contains all customizable game options
// changing them will affect gameplay
var gameOptions = {

    // game width, in pixels
	gameWidth: 700,

    // game height, in pixels
	gameHeight: 700,

     // tile size, in pixels
    tileSize: 100,

    // field size, an object
	fieldSize: {

        // rows in the field, in units
        rows: 7,

        // columns in the field, in units
        cols: 7
    },

    // tile colors
    colors: [0x999999, 0xffcb97, 0xffaeae, 0xa8ffa8, 0x9fcfff],

    // array with various directions, you can make the game harder if you only use the first 4 (up, down, left, right)
    directions: [
        new Phaser.Point(0, 1),
        new Phaser.Point(0, -1),
        new Phaser.Point(1, 0),
        new Phaser.Point(-1, 0),
        new Phaser.Point(1, 1),
        new Phaser.Point(-1, -1),
        new Phaser.Point(1, -1),
        new Phaser.Point(-1, 1)
    ]
}

// function to be execute once the page loads
window.onload = function() {

    // creation of a new Phaser Game
	game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);

    // adding "TheGame" state
    game.state.add("TheGame", TheGame);

    // launching "TheGame" state
    game.state.start("TheGame");
}

/* ****************** TheGame state ****************** */

var TheGame = function(){};

TheGame.prototype = {

    // function to be executed when the game preloads
    preload: function(){

        // setting background color to dark grey
        game.stage.backgroundColor = 0xf5f5f5;

        // load the only graphic asset in the game, a white tile which will be tinted on the fly
        game.load.image("tiles", "assets/sprites/tile.png");
    },

    // function to be executed as soon as the game has completely loaded
  	create: function(){

        // scaling the game to cover the entire screen, while keeping its ratio
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // horizontally centering the game
		game.scale.pageAlignHorizontally = true;

        // vertically centering the game
		game.scale.pageAlignVertically = true;

        // this function will create the level
  		this.createLevel();
  	},

	createLevel: function(){

        //  current level
        this.level = 0;

        // tiles are saved in an array called tilesArray, so we can update tile layout without losing the initial configuration
        this.tilesArray = [];

        // this group will contain all tiles
		this.tileGroup = game.add.group();

        // we are centering the group horizontally and keeping the same margin from the bottom
        this.tileGroup.x = (game.width - gameOptions.tileSize * gameOptions.fieldSize.cols) / 2;
        this.tileGroup.y = (game.height - gameOptions.tileSize * gameOptions.fieldSize.rows) / 2;

        // two loops to create a grid made by "gameOptions.fieldSize.rows" x "gameOptions.fieldSize.cols" columns
  		for(var i = 0; i < gameOptions.fieldSize.rows; i++){
            this.tilesArray[i] = [];
			for(var j = 0; j < gameOptions.fieldSize.cols; j++){

                // this function adds a tile at row "i" and column "j"
				this.addTile(i, j);
			}
		}

        // waiting for user input
        game.input.onDown.add(this.pickTile, this);
	},

    // function to add a tile at "row" row and "col" column
	addTile: function(row, col){

        // determining x and y tile position according to tile size
		var tileXPos = col * gameOptions.tileSize + gameOptions.tileSize / 2;
		var tileYPos = row * gameOptions.tileSize + gameOptions.tileSize / 2;

        // tile is added as an image
        var theTile = game.add.sprite(tileXPos, tileYPos, "tiles");

        // setting tile registration point to its center
        theTile.anchor.set(0.5);

        // adjusting tile width and height according to tile size
        theTile.width = gameOptions.tileSize;
        theTile.height = gameOptions.tileSize;

        // time to assign the tile a random value, which is also a random color
        var tileValue = 0;//levels[this.level][row][col];

        if (row == 0)
        {
            tileValue = col;
        }
            if (col == 0)
           {
            tileValue = row;    
    }
        // tinting the tile
        theTile.tint = gameOptions.colors[1];
        if (tileValue == 0)
{
        theTile.tint = gameOptions.colors[2];
}
// with
if (col == 0 && row == 0) 
{
    theTile.tint = gameOptions.colors[1];
}       
// adding tile number
        var tileText = game.add.text(0, 0, tileValue.toString(), {
            font: (gameOptions.tileSize / 2).toString() + "px Arial",
            fontWeight: "bold"
        });

        // setting tile number registration point to the center
        tileText.anchor.set(0.5);

        tileText.alpha = (tileValue > 0) ? 0.5 : 0

        // now tile number is a child of tile itself
        theTile.addChild(tileText);

        // adding the image to "tilesArray" array, creating an object
        this.tilesArray[row][col] = {

             // tile image
            tileSprite: theTile,

            // the value of the tile
            value: tileValue,

            // the text of the tile
            text: tileText
        };

        // also adding it to "tileGroup" group
	    this.tileGroup.add(theTile);

	},

    // this function is executed at each user input (click or touch)
    pickTile: function(e){

        // method to reset all tile tweens
        this.resetTileTweens();

        // determining x and y position of the input inside tileGroup
        var posX = e.x - this.tileGroup.x;
        var posY = e.y - this.tileGroup.y;

        // transforming coordinates into actual rows and columns
        var pickedRow = Math.floor(posY / gameOptions.tileSize);
        var pickedCol = Math.floor(posX / gameOptions.tileSize);

        // checking if row and column are inside the actual game field
        if(pickedRow >= 0 && pickedCol >= 0 && pickedRow < gameOptions.fieldSize.rows && pickedCol < gameOptions.fieldSize.cols){

            // this is the tile we picked
            var pickedTile = this.tilesArray[pickedRow][pickedCol];

            // getting tile value
            var pickedValue = pickedTile.value;

            // if it's a legal tile...
            if(pickedValue > 0){

                // saving picked tile coordinate
                this.saveTile = new Phaser.Point(pickedRow, pickedCol);

                // here we will place the possible landing tiles, if ones
                this.possibleLanding = [];
                this.possibleLanding.length = 0;

                // tween the tile
                this.setTileTweens(pickedTile.tileSprite, 0.2);

                // looping through all directions
                for(var i = 0; i < gameOptions.directions.length; i++){

                    // determining new coordinates
                    var newRow = pickedRow + pickedValue * gameOptions.directions[i].x;
                    var newCol = pickedCol + pickedValue * gameOptions.directions[i].y;

                    // are we on a legal tile?
                    if(newRow < gameOptions.fieldSize.rows && newRow >= 0 && newCol < gameOptions.fieldSize.cols && newCol >=0 && this.tilesArray[newRow][newCol].value == 0){

                        // we tween the tile
                        this.setTileTweens(this.tilesArray[newRow][newCol].tileSprite, 0.5);

                        // this tile is a possible landing tile
                        this.possibleLanding.push(new Phaser.Point(newRow, newCol));
                    }
                }
            }
            // it's not a legal tile. Maybe a possible landing?
            else{

                // check if the picked tile is in the array of possible landings
                if(this.pointInArray(new Phaser.Point(pickedRow, pickedCol))){

                    // this tile can't be picked anymore
                    this.tilesArray[pickedRow][pickedCol].value = -1;

                    // showing tile text
                    this.tilesArray[pickedRow][pickedCol].text.alpha = 0.5;

                    // setting destination tile text as source tile value
                    this.tilesArray[pickedRow][pickedCol].text.text = this.tilesArray[this.saveTile.x][this.saveTile.y].value.toString();

                    // empty source tile
                    this.tilesArray[this.saveTile.x][this.saveTile.y].value = 0;

                    // change source tile color
                    this.tilesArray[this.saveTile.x][this.saveTile.y].tileSprite.tint = gameOptions.colors[0];

                    // hiding tile text
                    this.tilesArray[this.saveTile.x][this.saveTile.y].text.alpha = 0;
                }

                // empty possibleLanding array
                this.possibleLanding = [];
                this.possibleLanding.length = 0;
            }
        }
    },

    // defines the tile tween
    setTileTweens: function(tile, scaling){

        // defining a pulse tween which changes width and height in 200 milliseconds, with a continuous loop and with a yoyo effect
        this.pulseTween = game.add.tween(tile).to({
            width: gameOptions.tileSize * scaling,
            height: gameOptions.tileSize * scaling
        }, 200, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
    },

    // this function reset all tile tweens
    resetTileTweens: function(){

        // get all running tweens
        var activeTweens = game.tweens.getAll();

        // looping through all running tweens
        for(var i = 0; i < activeTweens.length; i++){

            // set tile width and height back to original size
            activeTweens[i].target.width = gameOptions.tileSize;
            activeTweens[i].target.height = gameOptions.tileSize;
        }

        // remove all tweens
        game.tweens.removeAll();
    },

    // checks if a point is in possibleLanding array
    pointInArray: function(p){

        // looping through possibleLanding
        for(var i = 0; i < this.possibleLanding.length; i++){

            // do we find the point at i-th element?
            if(this.possibleLanding[i].x == p.x && this.possibleLanding[i].y == p.y){

                // yes we found it
                return true;
            }
        }

        // p is not inside possibleLanding
        return false;
    }
}
