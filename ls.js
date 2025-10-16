#!/usr/bin/env bun

import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { parseArgs } from 'util';

const options = {
  long: {
    type: 'boolean',
    short: 'l',
    default: false
  },
  all: {
    type: 'boolean',
    short: 'a',
    default: false
  },
  classify: {
    type: 'boolean',
    short: 'F',
    default: false
  },
  color: {
    type: 'string',
    default: 'auto'
  },
  size: {
    type: 'boolean',
    short: 'S',
    default: false
  },
  time: {
    type: 'boolean',
    short: 't',
    default: false
  },
  reverse: {
    type: 'boolean',
    short: 'r',
    default: false
  },
  'human-readable': {
    type: 'boolean',
    short: 'h',
    default: false
  },
  help: {
    type: 'boolean',
    default: false
  }
};

function showHelp() {
  console.log(`Usage: ls [OPTIONS] [DIRECTORY]

Options:
  -l, --long              Use long listing format
  -a, --all               Show hidden files (starting with .)
  -F, --classify          Append indicator (one of */=>@|) to entries
      --color[=WHEN]      Colorize output; WHEN can be 'always', 'auto', or 'never'
  -S, --size              Sort by file size, largest first
  -t, --time              Sort by modification time, newest first
  -r, --reverse           Reverse order while sorting
  -h, --human-readable    Show sizes in human readable format (1K, 234M, 2G)
      --help              Show this help message

Environment:
  LS_OPTIONS        Default options (e.g., 'LS_OPTIONS=-F --color=always')

Examples:
  ls           List files in current directory
  ls -l        Long format listing
  ls -a        Show all files including hidden
  ls -F        Show file type indicators
  ls -la       Long format with hidden files
  ls -lS       Long format sorted by size
  ls -lt       Long format sorted by time
  ls -ltr      Long format sorted by time, oldest first
  ls -lh       Long format with human-readable sizes
  ls /path     List files in specified directory`);
}

function formatPermissions(mode) {
  const perms = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
  return [
    (mode & 0o40000) ? 'd' : '-',
    perms[(mode & 0o700) >> 6],
    perms[(mode & 0o070) >> 3],
    perms[mode & 0o007]
  ].join('');
}

function formatSize(size, humanReadable = false) {
  if (!humanReadable) {
    return size.toString();
  }
  
  if (size < 1024) return size.toString();
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}K`;
  if (size < 1024 * 1024 * 1024) return `${Math.round(size / (1024 * 1024))}M`;
  if (size < 1024 * 1024 * 1024 * 1024) return `${Math.round(size / (1024 * 1024 * 1024))}G`;
  return `${Math.round(size / (1024 * 1024 * 1024 * 1024))}T`;
}

function sortItems(items, opts) {
  let sortedItems = [...items];
  
  if (opts.size) {
    sortedItems.sort((a, b) => b.stats.size - a.stats.size);
  } else if (opts.time) {
    sortedItems.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
  } else {
    sortedItems.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  if (opts.reverse) {
    sortedItems.reverse();
  }
  
  return sortedItems;
}

function formatDate(date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

const colors = {
  reset: '\x1b[0m',
  directory: '\x1b[34m',
  executable: '\x1b[32m',
  symlink: '\x1b[36m',
  socket: '\x1b[35m',
  fifo: '\x1b[33m',
  regular: '\x1b[0m'
};

function getFileTypeIndicator(stats) {
  if (stats.isDirectory()) return '/';
  if (stats.isSymbolicLink()) return '@';
  if (stats.isSocket()) return '=';
  if (stats.isFIFO()) return '|';
  if (stats.mode & 0o111) return '*';
  return '';
}

function getFileColor(stats) {
  if (stats.isDirectory()) return colors.directory;
  if (stats.isSymbolicLink()) return colors.symlink;
  if (stats.isSocket()) return colors.socket;
  if (stats.isFIFO()) return colors.fifo;
  if (stats.mode & 0o111) return colors.executable;
  return colors.regular;
}

function shouldUseColor(colorOption) {
  if (colorOption === 'always') return true;
  if (colorOption === 'never') return false;
  return process.stdout.isTTY;
}

function parseDefaultOptions() {
  const envOptions = process.env.LS_OPTIONS;
  if (!envOptions) return [];
  
  return envOptions.split(/\s+/).filter(opt => opt.length > 0);
}

async function listDirectory(directory, opts) {
  try {
    const entries = await readdir(directory);
    const items = [];

    for (const entry of entries) {
      if (!opts.all && entry.startsWith('.')) {
        continue;
      }

      const fullPath = join(directory, entry);
      let stats;
      
      try {
        stats = await stat(fullPath);
      } catch (err) {
        console.error(`ls: cannot access '${entry}': ${err.message}`);
        continue;
      }

      items.push({ name: entry, stats, fullPath });
    }

    const sortedItems = sortItems(items, opts);
    const useColor = shouldUseColor(opts.color);
    
    if (opts.long) {
      for (const item of sortedItems) {
        const { name, stats } = item;
        const perms = formatPermissions(stats.mode);
        const size = formatSize(stats.size, opts['human-readable']);
        const date = formatDate(stats.mtime);
        const indicator = opts.classify ? getFileTypeIndicator(stats) : '';
        
        if (useColor) {
          const color = getFileColor(stats);
          console.log(`${perms} ${size.padStart(8)} ${date} ${color}${name}${indicator}${colors.reset}`);
        } else {
          console.log(`${perms} ${size.padStart(8)} ${date} ${name}${indicator}`);
        }
      }
    } else {
      const names = sortedItems.map(item => {
        const indicator = opts.classify ? getFileTypeIndicator(item.stats) : '';
        if (useColor) {
          const color = getFileColor(item.stats);
          return `${color}${item.name}${indicator}${colors.reset}`;
        }
        return item.name + indicator;
      });
      console.log(names.join('  '));
    }
  } catch (err) {
    console.error(`ls: cannot access '${directory}': ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  try {
    const defaultOptions = parseDefaultOptions();
    const allArgs = [...defaultOptions, ...process.argv.slice(2)];
    
    const { values: opts, positionals } = parseArgs({
      args: allArgs,
      options,
      allowPositionals: true
    });

    if (opts.help) {
      showHelp();
      return;
    }

    const userSpecifiedOptions = process.argv.slice(2).some(arg => arg.startsWith('-'));
    const onlyLongOption = process.argv.slice(2).length === 1 && process.argv.slice(2)[0] === '-l';
    
    if (!userSpecifiedOptions || onlyLongOption) {
      opts.classify = true;
      if (opts.color === 'auto') {
        opts.color = 'always';
      }
    }

    const directory = positionals[0] || '.';
    await listDirectory(directory, opts);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();