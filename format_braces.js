const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'tailwind.config.js',
  'js/admin.mjs',
  'js/auth_widget.mjs',
  'js/bookmarks.mjs',
  'js/dotfiles_list.mjs',
  'js/dwm_judge.mjs',
  'js/home.mjs',
  'js/login.mjs',
  'js/nvim_judge.mjs',
  'js/profile.mjs',
  'js/register.mjs',
  'js/submit.mjs',
  'js/test.js',
  'data/bookmarks/main.js',
  'data/dotfiles_list/main.js',
  'data/users/main.js'
];

function formatFile(filePath) {
  console.log(`Formatting: ${filePath}`);
  const absolutePath = path.resolve(process.cwd(), filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');
  let result = '';
  let inString = null; // null, "'", '"', '`'
  let inComment = null; // null, '//', '/*'
  let currentLineIndentation = '';
  let onNewLines = true;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    // Track indentation and new line status
    if (char === '\n') {
      onNewLines = true;
      currentLineIndentation = '';
    } else if (onNewLines) {
      if (char === ' ' || char === '\t') {
        currentLineIndentation += char;
      } else {
        onNewLines = false;
      }
    }

    // Handle Strings
    if (!inComment) {
      if (inString) {
        if (char === inString) {
          // Handle escaped quotes
          let backslashes = 0;
          for (let k = i - 1; k >= 0 && content[k] === '\\'; k--) {
            backslashes++;
          }
          if (backslashes % 2 === 0) {
            inString = null;
          }
        }
      } else if (char === "'" || char === '"' || char === '`') {
        inString = char;
      }
    }

    // Handle Comments
    if (!inString) {
      if (inComment === '//') {
        if (char === '\n') inComment = null;
      } else if (inComment === '/*') {
        if (char === '*' && nextChar === '/') {
          inComment = null;
          result += '*/';
          i++;
          continue;
        }
      } else if (char === '/' && nextChar === '/') {
        inComment = '//';
      } else if (char === '/' && nextChar === '*') {
        inComment = '/*';
      }
    }

    if (char === '{' && !inString && !inComment) {
      // Check if it's already on its own line (preceded only by whitespace)
      let j = result.length - 1;
      let onlyWhitespaceOnLine = true;
      while (j >= 0 && result[j] !== '\n') {
        if (result[j] !== ' ' && result[j] !== '\t') {
          onlyWhitespaceOnLine = false;
          break;
        }
        j--;
      }

      if (onlyWhitespaceOnLine) {
        result += '{';
      } else {
        // Move to new line with current indentation
        // Trim trailing space from the current code line only
        const lastLineStart = result.lastIndexOf('\n') + 1;
        const lastLine = result.substring(lastLineStart);
        const trimmedLastLine = lastLine.replace(/[ \t]+$/, '');
        result = result.substring(0, lastLineStart) + trimmedLastLine;
        result += '\n' + currentLineIndentation + '{';
      }
    } else {
      result += char;
    }
  }

  fs.writeFileSync(absolutePath, result);
}

filesToProcess.forEach(formatFile);
console.log('Finished formatting.');
