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

      // Wrap if needed, this block redirects chain
      if ( ( this.index + 1 ) % this.wrapLength == 0 ){
        var turningDirection = CT.turningDirections[ this.direction ];
        this.currentBlock.direction = turningDirection;
      return CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ this.direction ] );
      }
      // First block in new wrapped chain direction
      else if ( ( this.index + 1 ) % this.wrapLength == 1 ){
        var oppositeDirection = CT.oppositeDirections[ this.direction ];
        var turningDirection = CT.turningDirections[ this.direction ];
        this.currentBlock.direction = oppositeDirection;
        this.direction = oppositeDirection;
        return CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ turningDirection ] );
      }

      return CT.numsOp( "+", this.getLastBlock().position, CT.relativeDirections[ this.direction ] );

    } else {

      return this.position;

    }

  };

  Chain.prototype.resetBlock = function() {
    this.currentBlock = new CommandBlock();
    this.currentBlock.direction = this.direction;
    this.currentBlock.position = this.currentPosition();
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

    // If wrapping on a conditional
    if ( this.index > 0 && ( commandBlock.conditional && ( ( this.index + 1 ) % this.wrapLength == 0 || ( this.index + 1 ) % this.wrapLength == 1 ) ) ){

      if ( ( this.index + 1 ) % this.wrapLength == 1 ) {
        this.direction = CT.oppositeDirections[ this.direction ];
      }

      this.resetBlock();     
      this.currentBlock.command = "testforblock " + CT.numsOp("-", this.getLastBlock().position, this.currentBlock.position ).join( " " ) + " " + this.getLastBlock().type + " {SuccessCount:0}";
      this.push( this.currentBlock );

      this.currentBlock.command = "testforblock " + CT.numsOp("-", this.getLastBlock().position, this.currentBlock.position ).join( " " ) + " " + this.getLastBlock().type + " {SuccessCount:0}";
      this.push( this.currentBlock );

      commandBlock.position = this.currentPosition();
      commandBlock.direction = this.direction;
      this.currentBlock = commandBlock;
    }

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

  return Chain;

} );