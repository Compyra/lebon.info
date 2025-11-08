# 🧾 `sed` Command Cheatsheet (Stream Editor)

`sed` is a powerful Unix utility for parsing and transforming text using **stream editing**.

## 📌 Basic Syntax

```bash
sed [OPTIONS] 'script' [file...]
```

- `'script'`: One or more editing commands.
- `[file]`: Input file(s). If omitted, `sed` reads from standard input.

## ⚙️ Common Options

| Option | Description |
|--------|-------------|
| `-n`   | Suppress automatic printing of pattern space. Use `p` to print explicitly. |
| `-e`   | Add multiple editing commands. |
| `-i`   | Edit files in-place (with optional backup: `-i.bak`). |
| `-f`   | Read commands from a file. |

## ✂️ Basic Commands

| Command | Description |
|---------|-------------|
| `p`     | Print the current pattern space. |
| `d`     | Delete the current pattern space. |
| `s`     | Substitute text using regex. |
| `q`     | Quit after processing first match. |
| `a`     | Append text after current line. |
| `i`     | Insert text before current line. |
| `c`     | Replace line with new text. |
| `y`     | Translate characters (like `tr`). |

## 🔍 Substitution Syntax

```bash
sed 's/pattern/replacement/flags' file
```

### Flags

| Flag | Description |
|------|-------------|
| `g`  | Global replacement (all matches in line). |
| `i`  | Case-insensitive matching. |
| `p`  | Print the line if substitution occurred. |
| `n`  | Replace nth occurrence only. |

### Examples

```bash
sed 's/foo/bar/' file       # Replace first 'foo' with 'bar'
sed 's/foo/bar/g' file      # Replace all 'foo' with 'bar'
sed 's/foo/bar/2' file      # Replace second 'foo' only
sed 's/foo/bar/ip' file     # Case-insensitive + print
```

## 🗑️ Deletion with `sed`

`sed` can delete lines based on line numbers, patterns, or ranges.

### 🔢 Delete by Line Number

```bash
sed '2d' file             # Delete line 2
sed '5,10d' file          # Delete lines 5 through 10
```

### 🔍 Delete by Pattern

```bash
sed '/error/d' file       # Delete lines containing 'error'
sed '/^$/d' file           # Delete blank lines
sed '/^#/d' file           # Delete comment lines (starting with #)
```

### 🧮 Delete by Range and Pattern

```bash
sed '1,/pattern/d' file   # Delete from line 1 to first match of 'pattern'
sed '/start/,/end/d' file # Delete lines between 'start' and 'end' (inclusive)
```

### 🧠 Conditional Deletion

```bash
sed -n '/pattern/!p' file # Print only lines NOT matching 'pattern'
```

### 🧹 Delete Last Line

```bash
sed '$d' file             # Delete the last line
```

## 📍 Addressing Lines

### Line Numbers

```bash
sed '2d' file            # Delete line 2
sed '3,5p' file          # Print lines 3 to 5
```

### Patterns

```bash
sed '/error/d' file      # Delete lines containing 'error'
sed '/^#/d' file         # Delete comment lines
```

### Combined

```bash
sed '1,/pattern/d' file  # Delete from line 1 to first match of 'pattern'
```

## 🧪 Advanced Substitution

### Using Capture Groups

```bash
sed 's/\(foo\)bar/\1baz/' file
```

- `\(...\)` captures a group.
- `\1`, `\2`, etc., refer to captured groups.

### Escaping Special Characters

```bash
sed 's/\/usr\/bin/\/usr\/local\/bin/' file
```

Or use alternate delimiter:

```bash
sed 's|/usr/bin|/usr/local/bin|' file
```

## 🧨 In-Place Editing

```bash
sed -i 's/foo/bar/g' file           # Edit file directly
sed -i.bak 's/foo/bar/g' file       # Backup original as file.bak
```

## 📂 Multiple Commands

### Inline

```bash
sed -e 's/foo/bar/' -e '/baz/d' file
```

### Block Syntax

```bash
sed '
s/foo/bar/
s/baz/qux/
' file
```

## 🧵 Append, Insert, Change

```bash
sed '/pattern/a\Text to append' file
sed '/pattern/i\Text to insert' file
sed '/pattern/c\New line content' file
```

## 🔄 Translate Characters

```bash
sed 'y/abc/ABC/' file     # a→A, b→B, c→C
```

## 🧠 Useful Recipes

### Remove Blank Lines

```bash
sed '/^$/d' file
```

### Remove Leading/Trailing Whitespace

```bash
sed 's/^[ \t]*//' file     # Remove leading
sed 's/[ \t]*$//' file     # Remove trailing
```

### Replace Tabs with Spaces

```bash
sed 's/\t/    /g' file
```

### Number Lines

```bash
sed = file | sed 'N;s/\n/\t/'
```

## 📚 Resources

- `man sed`
- GNU sed manual: [https://www.gnu.org/software/sed/manual/sed.html](https://www.gnu.org/software/sed/manual/sed.html)