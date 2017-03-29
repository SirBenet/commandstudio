define( [
  "compiler/commandblock",
  "utils/commandtools"
], function(
  CommandBlock,
  CT
) {

  function Chain( position, direction, wrapLength ) {
    this.commandBlocks = [];
    this.index = 0;

    this.position = position;
    this.direction = direction;
    this.wrapLength = wrapLength;

    if( this.position[1][0] === "~" ) {
      this.position[1] = CT.numOp( "-", this.position[1], "3" );
    }

    this.resetBlock();
  }

  Chain.prototype.currentPosition = function() {
    // Get position based on last block position, if it exists
    if ( typeof this.getLastBlock() != 'undefined' ) {

      // Wrap if needed
      if ( ( this.index + 1 ) % this.wrapLength == 0 ){
        this.wrap();
      }

      return CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ this.direction ] );

    } else {
      return this.position;
    }

  };

  Chain.prototype.resetBlock = function() {
    var position = this.currentPosition();
    this.currentBlock = new CommandBlock();
    this.currentBlock.position = position;
    this.currentBlock.direction = this.direction;
  };

  Chain.prototype.feed = function( str ) {
    this.currentBlock.command += str;
  };

  Chain.prototype.flush = function() {
    if( this.currentBlock.command !== "" ) {
      this.push( this.currentBlock );
    }
  };

  Chain.prototype.push = function( commandBlock ) {
    this.commandBlocks.push( commandBlock );
    this.next();
  };

  Chain.prototype.next = function() {
    this.index++;
    this.resetBlock();
  };

  Chain.prototype.getLastBlock = function() {
    return this.commandBlocks[ this.index - 1 ];
  };

  Chain.prototype.wrap = function() {
    console.log("thats a wrap");

    var turningDirection;
    var oppositeDirection;

    switch(this.direction){
      case "+x":
        turningDirection = "+y";
        oppositeDirection = "-x";
        break;
      case "+z":
        turningDirection = "+y";
        oppositeDirection = "-z";
        break;
      case "-x":
        turningDirection = "+y";
        oppositeDirection = "+x";
        break;
      case "-z":
        turningDirection = "+y";
        oppositeDirection = "+z";
        break;
      case "+y":
        turningDirection = "+x";
        oppositeDirection = "-y";
        break;
      case "-y":
        turningDirection = "+x";
        oppositeDirection = "+y";
        break;
      default:
        turningDirection = "+x";
        oppositeDirection = "-y";
        break;
    }

    var wrapBlockA = new CommandBlock();
    wrapBlockA.position = CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ this.direction ] );
    wrapBlockA.direction = turningDirection;
    wrapBlockA.command = "wrap block A";
    this.commandBlocks.push( wrapBlockA );
    this.index++;

    var wrapBlockB = new CommandBlock();
    wrapBlockB.position = CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ turningDirection ] );
    wrapBlockB.direction = oppositeDirection;
    wrapBlockB.command = "wrap block B";
    this.commandBlocks.push( wrapBlockB );
    this.index++;

    this.direction = oppositeDirection;

  };

  return Chain;

} );