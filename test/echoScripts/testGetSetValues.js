#!/opt/homebrew/bin/node

const fs = require( "fs" );

function showHelp()
{
   console.log(`
   Syntax: Get Device <Characteristic> < fn >
           Set Device <Characteristic> [< value >] < fn >


    Set writes stuff to < fn > as a required fn with
      INPUTS.IO
      INPUTS.DEVICE
      INPUTS.CHARACTERISTIC
      INPUTS.VALUE

    Get echos what Set would have sent


` );
  process.exit( 666 );
}

function createDeviceFileName( fn, DEVICE, CHARACTERISTIC )
{
   return `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
}

function doGet( )
{
   if ( ELEMENTS != 6 ) { showHelp( ); process.exit( 1 ); }

   let fn = process.argv[5];

   let deviceFile = createDeviceFileName( fn, DEVICE, CHARACTERISTIC );

   let INPUTS;

   try {
     INPUTS = require( deviceFile );
   } catch ( e ) {
     console.log(`Cannot load fn: ${ deviceFile }, error: ${ e }`);
     process.exit( 666 );
   }

   console.log( `${ INPUTS.VALUE }` );

   process.exit( 0 );
}

function doSet( )
{
   if ( ELEMENTS != 7 ) { showHelp( ); process.exit( 1 ); };

   let VALUE = process.argv[5];
   let fn = process.argv[6];

   let deviceFile = createDeviceFileName( fn, DEVICE, CHARACTERISTIC );

   // Skip the fn
   ELEMENTS--;

   // Remove the old fn
   try {
     fs.unlinkSync( deviceFile );
   } catch(err) {
     // Don't care
     // console.error( err )
     // process.exit( 666 );
   }

   let data = `exports.IO="${ IO }";
      exports.DEVICE="${ DEVICE }";
      exports.CHARACTERISTIC="${ CHARACTERISTIC }";
      exports.VALUE="${ VALUE }";\n`;

   // Write the arguments as requires
   fs.writeFileSync( deviceFile, data, function( err )
   {
       console.log(` Error writing to fn: ${ deviceFile } error: ${ err }\n`);
       process.exit( 666 );
   });

   process.exit( 0 );
}

let ELEMENTS = process.argv.length;
if ( ELEMENTS < 4 ) { showHelp( ); process.exit( 1 ); }

let IO = process.argv[2];
let DEVICE = process.argv[3];
let CHARACTERISTIC = process.argv[4];

switch( IO )
{
    case "Get":
       doGet( );
       break;
    case "Set":
       doSet( );
       break;
    default:
       console.log(`Invalid Get/Set: ${IO}` );
       showHelp();
}
process.exit( 1 );
