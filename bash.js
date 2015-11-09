var input = process.argv.slice(2);

input.forEach( function( command ) {
  routeCommand( command.toLowerCase() );
} );

function routeCommand( cmd ) {
  if ( cmd === 'pwd' ) pwd();
  if ( cmd === 'date' ) date();
}

function pwd() {
  console.log( process.env.PWD );
}

function date() {
  console.log( new Date() );
}
