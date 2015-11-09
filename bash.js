var commands = require( './commands' );

// var input = process.argv.slice(2);

// input.forEach( function( command ) {
//   routeCommand( command.toLowerCase() );
// } );


process.stdout.write( "prompt > " );

process.stdin.setEncoding('utf8');
process.stdin.on('readable', function () {
  var chunk = process.stdin.read();

  if ( chunk !== null ) {
    var args = chunk.trim().split(' ');
    routeCommand(args[0].toLowerCase(), args.splice(1));
  }
});


function routeCommand( cmd, args ) {
  args.unshift(done);
  if ( commands[cmd] ) commands[cmd].apply( commands, args );
  else {
    process.stdout.write("prompt > ");
  }
}

function done (output) {
  console.log(output);
  console.log(output.split('\n').length);
  process.stdout.write("prompt > ");
}