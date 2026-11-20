#!/usr/bin/env node

'use strict';

// File System utilities
let fs = require( "fs" );
let readline = require( "readline" );

// Command line parser
const { Command } = require( "commander" );
const program = new Command;

// Tool to get changelog information
let Changelog = require( 'generate-changelog' );

let CHANGELOG = "CHANGELOG";
let RUNNING_CHANGELOG = "RUNNING_CHANGELOG";
// Wondering why ${ fn }_SAVE.ext instead of ${ fn }.SAVE ?
// Between git and npm you cannot ignore special files if you
// stick an extension on them. So put the extension in the file name itself.
let RUNNING_CHANGELOG_NEW = `${ RUNNING_CHANGELOG }_new.md`;
let RUNNING_CHANGELOG_BAK = `${ RUNNING_CHANGELOG }_bak.md`;
let CHANGELOG_NEW = `${ CHANGELOG }_new.md`;
let CHANGELOG_BAK = `${ CHANGELOG }_bak.md`;

let CHANGELOG_tag = "## ChangeLog";

let PACKAGE = "package";
let PACKAGE_NEW = `${ PACKAGE }_new.json`;
let PACKAGE_BAK = `${ PACKAGE }_bak.json`;
// Get the package information
const pkg = require( `../${ PACKAGE }.json` );


// A nice little getOpt node.js package
program
  .description( 'Generate an indexed changelog from git commits.' )
  .option( '-t, --type <type>', 'flavour of changelog < patch | minor | major >' )
  .option( '-d, --dryRun', 'Do not overwrite existing CHANGELOG.md>' )
  .option( '-r, --cleanup', 'After completion, remove created backup files.' );

// Parse the arguments passed into this program.
program.parse( process.argv );

// Get the options passed in based on the commander getOpts definitions.
let options = program.opts( );

if ( options.dryRun === undefined )
{
   options.dryRun = false;
   console.log( `Option "dryRun" Not specified. Backup files will be created.` );
} else
{
   options.dryRun = true;
   console.log( `dryRun specified. No files will be overwritten` );
}

if ( options.type === undefined )
{
   options.type = "patch";
   console.log( `No --type given. Using default: ${ options.type }`);
} else
{
   switch ( options.type )
   {
      case "patch":
      case "minor":
      case "major":
         break;
      default:
         console.log( `Error: unknown ChangeLogType: ${ options.type }` );
         process.exit( 666 );
   }
   console.log( `Using options.type: ${ options.type }` );
}
if ( options.cleanup === undefined )
{
   options.cleanup = false;
   console.log( `Option "cleanup" after completion Not specified. Backup files will not be removed.` );
} else
{
   options.cleanup = true;
   console.log( `Option "cleanup" specified. Created backup files will be removed after completion` );
}


// Check for any leftover arguments passed in.
if ( program.args.length >= 1 )
{
   console.log( `Unknown options: ${ program.args[ 0 ] }` );
   process.exit( 666 );
}

// We do not start from scratch
if ( pkg.version === undefined )
{
   console.log( `No existing version in ${ PACKAGE }.json to change from.` );
   console.log( `Cannot update ${ PACKAGE }.json`);
   process.exit( 666 );
}


function overwriteFileWithBackup( origFile, newFile, backupFile, cleanup )
{
   if ( fs.existsSync( backupFile ) )
   {
      console.log( `Error: backup file ${ backupFile } already exists. Aborting` );
      process.exit( fs.COPYFILE_EXCL );
   }

   // move the original file to a backup file
   return fs.rename( origFile, backupFile, function ( err )
   {
      if ( err )
      {
         console.log( `Could not rename ${ origFile } to ${ newFile }` );
         process.exit( err );
      }

      // move the new file to the existing.
      fs.rename( newFile, origFile, function ( err )
      {
         if ( err )
         {
            console.log( `Could not rename ${ newFile } to ${ origFile }` );
            process.exit( err );
         }

         console.log( `Renamed ${ newFile } to ${ origFile } with backup of ${ backupFile }` );

         if ( cleanup == true )
         {
            fs.unlink( backupFile, function ( err )
            {
               if ( err )
               {
                  console.log( `Could not unlink ${ backupFile }` );
                  process.exit( err );
               }
               console.log( `Removed ${ backupFile }` );
            });
         }

      });

   });
}

function updateChangeLog( changelog, newVersionString, options )
{
   let newIndexEntryToBeWritten = false;
   let indexBeingWritten = false;
   let newBodyEntryToBeWritten = false;
   let changeLogTagFound = false;
   let dashedVersionString = newVersionString.replace( /\./g, "-" );

   // Open the new RUNNING_CHANGELOG for writing
   let newRunningChangeLog_fid = fs.createWriteStream( RUNNING_CHANGELOG_NEW,
      { flags: "w" // Open for write
      }
   );

   newRunningChangeLog_fid.on( "error", ( ) =>
   {
      console.log( `error fs.creatingWriteStream: ${ RUNNING_CHANGELOG_NEW }` );
      process.exit( 666 );
   });

   // Open the new CHANGELOG for writing
   let newChangeLog_fid = fs.createWriteStream( CHANGELOG_NEW,
      { flags: "w" // Open for write
      }
   );
   newChangeLog_fid.on( "error", ( ) =>
   {
      console.log( `error fs.creatingWriteStream: ${ CHANGELOG_NEW }` );
      process.exit( 666 );
   });

   const fileStream = fs.createReadStream( `${ RUNNING_CHANGELOG }.md` );

   let rd = readline.createInterface(
   {
      input: fileStream,
      crlfDelay: Infinity
   });

   rd.on( "line", function( line )
   {
      if ( newIndexEntryToBeWritten  == true )
      {
         // Write the new index line to the running CHANGELOG
         newRunningChangeLog_fid.write( `* <a href="#Whats-new-in-${ dashedVersionString }">**Whats new in ${ newVersionString }**</a>\n` );

         // Write a header to the CHANGELOG
         newChangeLog_fid.write( `# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!\n` );

         // The new Index line has been written
         newIndexEntryToBeWritten = false;

         // Currently writing index entries. Looking for Body
         indexBeingWritten = true;
      }

      if ( newBodyEntryToBeWritten == true )
      {
         //Write the new Changelog
         newRunningChangeLog_fid.write( `<a name="Whats-new-in-${ dashedVersionString }">## Whats new in ${ newVersionString }</a>\n` );
         newRunningChangeLog_fid.write( `${ changelog }\n` );

         newChangeLog_fid.write( `${ changelog }\n` );
         newBodyEntryToBeWritten = false;
      }

      if ( line.includes( CHANGELOG_tag ) && changeLogTagFound == false )
      {
         newIndexEntryToBeWritten = true;
         changeLogTagFound = true;
      }

      // An empty line signifies the end of the index
      if ( indexBeingWritten == true && line == "" )
      {
         indexBeingWritten = false;
         newBodyEntryToBeWritten = true;
      }

      // Write the line
      newRunningChangeLog_fid.write( `${ line }\n` );
   });

   newRunningChangeLog_fid.on( "close", function( )
   {
      if ( options.dryRun == true )
      {
         console.log( `New ${ RUNNING_CHANGELOG }.md is ${ RUNNING_CHANGELOG_NEW }` );
         console.log( `Original left unchanged.` );
         return;
      }

      overwriteFileWithBackup( `${ RUNNING_CHANGELOG }.md`, RUNNING_CHANGELOG_NEW, RUNNING_CHANGELOG_BAK, options.cleanup, function ( )
      {
         console.log( `Successfully created ${ RUNNING_CHANGELOG }` );

         console.log( `You may now wish to run:` );
         console.log( `git tag -a v${ newVersionString }` );
         console.log( `and` );
         console.log( `git push -f ${ pkg.repository.url } master` );
         console.log( `or` );
         console.log( `git push origin master` );

      });
   });

   newChangeLog_fid.on( "close", function( )
   {
      if ( options.dryRun == true )
      {
         console.log( `New ${ CHANGELOG }.md is ${ CHANGELOG_NEW }` );
         console.log( `Original left unchanged.` );
         return;
      }

      overwriteFileWithBackup( `${ CHANGELOG }.md`, CHANGELOG_NEW, CHANGELOG_BAK, options.cleanup, function ( )
      {
         console.log( `Successfully created ${ CHANGELOG }` );

      });
   });

   rd.on( "close", function( )
   {
      // Close the CHANGELOG files
      newRunningChangeLog_fid.close( );

      newChangeLog_fid.close( );
   });

}

function updatePackageDotJson( currentVersion, newVersionString, options )
{
   pkg.version = newVersionString;

   fs.writeFile( `${ PACKAGE_NEW }`, JSON.stringify( pkg, null, 3 ), ( err ) =>
   {
      if ( err ) process.exit( err );

      if ( options.dryRun == true )
      {
         console.log( `New ${ PACKAGE }.json is ${ PACKAGE_NEW }` );
         console.log( `Original left unchanged.` );
         return;
      }

      overwriteFileWithBackup( `${ PACKAGE }.json`, PACKAGE_NEW, PACKAGE_BAK, options.cleanup, function ( )
      {
         console.log( `Successfully created ${ PACKAGE_NEW }` );

      });
   });
}

Changelog.generate(
   { [ options.type ]: true
   } ).then( function ( changelog )
{
   let words = changelog.split( " " );
   let newVersionString = words[ 1 ];
   updateChangeLog( changelog, newVersionString, options );

   updatePackageDotJson( pkg.version, newVersionString, options );

});
