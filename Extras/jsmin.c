/* jsmin.c

Copyright (c) 2017 John Talbot (www.BeNiceGames.com)


- Inspired by jsmin from Douglas Crockford (www.crockford.com)
- As compared to his, This jsmin leaves the output uncompacted
  so that it is legible and ONLY removes C & C++ style comments.
- This code was rewritten from scratch, only the Permissions
  are the same, but Kudos to Douglas for coming up with a solution
  for allowing comments in json files. I just needed something
  that I could debug the output of more easily. 

- Execution is the same:    jsmin < config.min.json > config.json

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#include <stdlib.h>
#include <stdio.h>

int   theCurrentChar;
int   theNextChar;
int   insideSingleQuote = 0;
int   insideDoubleQuote = 0;
unsigned long theCharacterPositionInLine = 0;

unsigned long lineCounter =1;

// Return the next character from stdin. increasing line number count accordingly.
int getCharFromStdin()
{
    int c = getc(stdin);

    if (c == '\r') 
       c = '\n';

    if (c == '\n') {
       lineCounter ++;
       theCharacterPositionInLine = 0;
    } else {
       theCharacterPositionInLine ++;
    }
    return c;
}


// jsmin -- Copy stdin to stdout, deleting 'C' or 'C++' style comments.
//       -- Everything else is left the same, except:
//             - any \r characters are changed to \n.
//             - any empty blank lines are removed.
//             - any trailing blanks are removed.

// Errors:  The only error possible is for unterminated 'C' style comments.

void outputChar(int c)
{
   static unsigned long consecutiveSpaceCounter = 0;
   static int printableCharFoundOnLine = 0;

   // Do not print anything if no characters were on the line.
   if (c == '\n' && printableCharFoundOnLine == 0)
   {
      consecutiveSpaceCounter = 0;
      return;
   }

   // Count the spaces before printing them so that empty lines
   // are removed. (This looks better for blank lines with comments removed).
   if (c == ' ')
   {
      consecutiveSpaceCounter ++;

   } else {

      // This will print any spaces counted before a real character
      // and not when EOL is found.
      if (c != '\n')
      { 
         // Since consecutiveSpaceCounter is unsigned, there is no
         // possability of being stuck in a loop forever.
         while (consecutiveSpaceCounter !=  0)
         {
            putc(' ', stdout);
            consecutiveSpaceCounter --;
         }
         printableCharFoundOnLine = 1;
      } else {

         // A new line means the next line needs to reset char found flag.
         printableCharFoundOnLine = 0 ;
      }

      putc(c, stdout);

      // Since a char was printed, reset the space counter.
      consecutiveSpaceCounter = 0;
   }
}

static void
jsmin()
{
    // Prime the pump.
    theCurrentChar = getCharFromStdin();

    while (theCurrentChar != EOF)
    {

       if (theCurrentChar == '\'') 
       {
          insideSingleQuote = 1;

          outputChar(theCurrentChar);

          theCurrentChar = getCharFromStdin();

          // Continue until out of single quotes
          // or forced out of single quotes by a newline
          while (insideSingleQuote == 1 &&
                 theCurrentChar !=EOF)
          {
             theNextChar = getCharFromStdin();

             // Skip passed escaped single quotes
             if (theCurrentChar == '\\' && theNextChar == '\'' )
             {
                outputChar(theCurrentChar);
                theCurrentChar = theNextChar;
                continue;
             }

             // Found end of single quotes
             if (theCurrentChar == '\'')
             {
                insideSingleQuote = 0;
             }

             // Newline and inside single quotes breaks
             // out automatically
             if (theCurrentChar == '\n')
             {
                insideSingleQuote = 0;
             }

             outputChar(theCurrentChar);
             theCurrentChar = theNextChar;
          }
       }

       if (theCurrentChar == '\"')
       {
          insideDoubleQuote = 1;

          outputChar(theCurrentChar);

          theCurrentChar = getCharFromStdin();

          // Continue until out of single quotes
          // or forced out of single quotes by a newline
          while (insideDoubleQuote == 1 &&
                 theCurrentChar !=EOF)
          {
             theNextChar = getCharFromStdin();

             // Skip passed escaped double quotes
             if (theCurrentChar == '\\' && theNextChar == '\"' )
             {
                outputChar(theCurrentChar);
                outputChar(theNextChar);
                theCurrentChar = getCharFromStdin();
                theNextChar = getCharFromStdin();
             }

             // Found end of double quotes
             if (theCurrentChar == '\"')
             {
                insideDoubleQuote = 0;
             }

             // Newline and inside double quotes breaks
             // out automatically
             if (theCurrentChar == '\n')
             {
                insideDoubleQuote = 0;
             }

             outputChar(theCurrentChar);
             theCurrentChar = theNextChar;
          }
       }


       // Look for the start of a 'C' or 'C++' style comment.
       if (theCurrentChar == '/' )
       {
          theNextChar = getCharFromStdin();

          // Found a 'C++' style comment.
          if (theNextChar == '/' )
          {
             // Continue until \n
             while (theCurrentChar != '\n' )
             {
                theCurrentChar = getCharFromStdin();
                if (theCurrentChar == EOF)
                   break;
             }
             outputChar(theCurrentChar); // The EOL char

             theCurrentChar = getCharFromStdin();
             continue; // Main loop.
          } 

          if (theNextChar == '*') // Found a 'C' style comment.
          {
             unsigned long openCommentLineNumber = lineCounter;

             // Move past the start of the comment
             theCurrentChar = getCharFromStdin();
             theNextChar = getCharFromStdin();

             // Continue until '*/'
             while (theCurrentChar != '*' || theNextChar != '/' )
             {
                if (theCurrentChar == EOF)
                {
                   fprintf(stderr, "Missing comment terminator for line %lu\n\n", openCommentLineNumber);
                   exit(-1);
                } 
                theCurrentChar = theNextChar;
                theNextChar = getCharFromStdin();
             }

             theCurrentChar = getCharFromStdin();

             continue; // The main loop.
          }

          outputChar(theCurrentChar);

          // The next char has already been read, use it.
          theCurrentChar = theNextChar;

          continue; // The main loop.
       }
       outputChar(theCurrentChar);

       // Read the char to be processed next.
       theCurrentChar = getCharFromStdin();
   }
}


// main -- Output any command line arguments to stderr and then minify the input.

extern int
main(int argc, char* argv[])
{
    int i;
    for (i = 1; i < argc; i += 1) {
        fprintf(stderr, "%s\n", argv[i]);
    }
    jsmin();
    return 0;
}
