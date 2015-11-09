var fs = require('fs');
var request = require('request');

module.exports = {
  'pwd' : function(done) {
    done( process.env.PWD );
  },

  'date' : function(done) {
    done(new Date());
  },

  'ls' : function (done) {
    fs.readdir('.', function (err, files) {
      if (err) throw err;
      var output = [];
      files.forEach(function(file) {
        output.push(file.toString()); 
      });
      done(output.join('\n'));
    });
  },

  'echo' : function (done) {
    var args = [].slice.call( arguments, 1 );
    args = args.map( function( arg ) {
      if ( arg[0] === '$' ) {
        var env_variable = process.env[arg.slice(1)];
        return env_variable;
      }
      return arg;
    });
    done( args.join(' ') );
  },

  'readFiles' : function ( fn ) {
    var files = [].slice.call( arguments ).slice( 1 );
    var filesRead = 1;
    var wholeData = [];

    files.forEach( function( file ) {
      fs.readFile( file, 'utf8', function( err, data ) {
        wholeData.push(data);
        if ( filesRead === files.length ) fn(wholeData.join('\n'));
        else filesRead++;
      });
    } );
  },

  'cat' : function (done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      done( data );
    } );
    this.readFiles.apply( this, args );
  },

  'head' : function(done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      var lines = data.split('\n');
      done( lines.slice(0, 5).join('\n') );
    } );
    this.readFiles.apply( this, args );
  },

  'tail' : function(done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      var lines = data.split('\n');
      done( lines.slice( lines.length-5 ).join('\n') );
    } );
    this.readFiles.apply( this, args );
  },

  'sort' : function(done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      var lines = data.split('\n');
      done (lines.sort().join('\n'));  
    } );
    this.readFiles.apply( this, args );
  },

   'wc' : function(done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      var lines = data.split('\n');
      done(lines.length - 1);
    } );
    this.readFiles.apply( this, args );
  },

  'uniq' : function(done) {
    var args = [].slice.call( arguments, 1 );
    args.unshift( function( data ) {
      var lines = data.split('\n');
      var output = [];
      for (var i = 0; i < lines.length; i++) {
        if (i == 0) output.push(lines[i]); 
        else {
          if (lines[i-1] !== lines[i]) {
             output.push(lines[i]);
          }
        }
      }
      done(output.join('\n'));
    } );  
    this.readFiles.apply( this, args );
  },

  'curl': function (done, url) {
    request(url, function (error, response, body) {
      if (error) {
        throw error;
      } else {
        if (response.statusCode == 200) done(body);
      }
    })
  },

  'find': function(done, dir) {
    var output = [];
    fs.readdir( dir, (function( err, files ) {
      if ( err ) throw err;
      else {
        var toRead = files.length;
        if ( toRead === 0 ) return done( "" );

        files.forEach( (function( file ) {
          file = dir + '/' + file;

          if ( fs.statSync( file ).isDirectory() ) { // check if file is a directory
            this.find( function( data ) {
              output.push( data );
              if ( --toRead === 0 ) done( output.join('\n') );
            }, file );
          } else {
            output.push( file );
            if ( --toRead === 0 ) done( output.join('\n') );
          }
        }).bind( this ));
      }
    }).bind( this ));
  }
}
