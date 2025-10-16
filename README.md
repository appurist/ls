# ls - UNIX-like Directory Listing Tool

A cross-platform implementation of the UNIX `ls` command built with Bun.

## Features

- Basic directory listing
- Long format display with file permissions, size, and timestamps
- Hidden file support
- Sorting by name, size, or modification time (with reverse option)
- Human-readable file sizes
- Colorized output with file type indicators
- Environment variable support for default options
- Cross-platform compatibility (Windows executable included)
- Error handling for inaccessible files/directories

## Installation

### Prerequisites
- [Bun](https://bun.sh/) runtime (version 1.3 or later)

### Build from Source
```bash
# Build for current platform (Windows)
bun run build

# Build for specific platforms
bun run build:win     # Windows (ls.exe)
bun run build:mac     # macOS (ls)
bun run build:linux   # Linux (ls)
bun run build:all     # All platforms

# Clean built files
bun run clean
```

## Usage

### Basic Syntax
```bash
ls [OPTIONS] [DIRECTORY]
```

### Options

| Option | Description |
|--------|-------------|
| `-l, --long` | Use long listing format |
| `-a, --all` | Show hidden files (starting with .) |
| `-F, --classify` | Append indicator (one of */=>@\|) to entries |
| `--color[=WHEN]` | Colorize output; WHEN can be 'always', 'auto', or 'never' |
| `-S, --size` | Sort by file size, largest first |
| `-t, --time` | Sort by modification time, newest first |
| `-r, --reverse` | Reverse order while sorting |
| `-h, --human-readable` | Show sizes in human readable format (1K, 234M, 2G) |
| `--help` | Show help message |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `LS_OPTIONS` | Default options to apply (e.g., `LS_OPTIONS="-F --color=always"`) |

### Examples

```bash
# List files in current directory (auto-enables -F and color)
./ls.exe

# Long format listing
./ls.exe -l

# Show all files including hidden
./ls.exe -a

# Long format with hidden files
./ls.exe -la

# Sort by size, largest first
./ls.exe -lS

# Sort by time, newest first
./ls.exe -lt

# Sort by time, oldest first (reverse)
./ls.exe -ltr

# Human-readable sizes
./ls.exe -lh

# Disable colors
./ls.exe --color=never

# Set default options via environment
export LS_OPTIONS="-F --color=always"
./ls.exe

# List files in specific directory
./ls.exe /path/to/directory

# Show help
./ls.exe --help
```

## Output Format

### Basic Listing
```
ls.exe  ls.js
```

### Long Format (`-l`)
```
-rw-rw-rw-     114M 10/16/2025 04:27 PM ls.exe
-rw-rw-rw-       3K 10/16/2025 04:19 PM ls.js
```

The long format shows:
- File permissions (rwx format)
- File size (with K/M/G suffixes for readability)
- Last modification date and time
- File name

### All Files (`-a`)
```
.claude  .git  ls.exe  ls.js
```

## File Permissions

The permission string format is: `drwxrwxrwx`

- First character: `d` for directory, `-` for file
- Next 9 characters: rwx permissions for owner, group, and others
  - `r` = read permission
  - `w` = write permission  
  - `x` = execute permission
  - `-` = permission not granted

## File Sizes

Sizes are displayed in human-readable format:
- Bytes: exact number
- K: Kilobytes (1024 bytes)
- M: Megabytes (1024 KB)
- G: Gigabytes (1024 MB)

## Error Handling

- Inaccessible files show error messages but don't stop execution
- Invalid directories display appropriate error messages
- Permission errors are handled gracefully

## Files

- `ls.js` - Source code (Bun JavaScript)
- `ls.exe` - Compiled Windows executable
- `README.md` - This documentation

## License

This project is provided as-is for educational and utility purposes.