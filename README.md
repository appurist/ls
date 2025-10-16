# ls - UNIX-like Directory Listing Tool

A cross-platform implementation of the UNIX `ls` command built with Bun.

## Features

- Basic directory listing
- Long format display with file permissions, size, and timestamps
- Hidden file support
- Cross-platform compatibility (Windows executable included)
- Error handling for inaccessible files/directories

## Installation

### Prerequisites
- [Bun](https://bun.sh/) runtime (version 1.3 or later)

### Build from Source
```bash
# Build for current platform (Windows)
bun build

# Build for specific platforms
bun build:win     # Windows (ls.exe)
bun build:mac     # macOS (ls)
bun build:linux   # Linux (ls)
bun build:all     # All platforms

# Clean built files
bun clean
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
| `-h, --help` | Show help message |

### Examples

```bash
# List files in current directory
./ls.exe

# Long format listing
./ls.exe -l

# Show all files including hidden
./ls.exe -a

# Long format with hidden files
./ls.exe -la

# List files in specific directory
./ls.exe /path/to/directory

# Show help
./ls.exe -h
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