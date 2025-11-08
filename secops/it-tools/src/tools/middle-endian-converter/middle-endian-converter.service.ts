export interface EndianResult {
  bigEndian: string
  littleEndian: string
};

export function convertEndian(
  hexInput: string,
  bitLength: 16 | 32 | 64,
  middleEndianType: 'byte-swapped' | 'word-swapped',
): EndianResult {
  const hex = hexInput.replace(/^0x/, '').toUpperCase();

  if (!/^[0-9A-F]+$/.test(hex)) {
    throw new Error('Invalid hex input. Only 0-9 and A-F allowed.');
  }

  const byteCount = bitLength / 8;
  if (hex.length !== byteCount * 2) {
    throw new Error(`Input must be ${byteCount * 2} hex characters for ${bitLength}-bit.`);
  }

  const bytes = hex.match(/.{2}/g);
  if (!bytes) {
    throw new Error('Failed to parse bytes.');
  }

  const reordered: string[] = [];

  if (middleEndianType === 'byte-swapped') {
    for (let i = 0; i < bytes.length; i += 2) {
      reordered.push(bytes[i + 1], bytes[i]);
    }
  }
  else if (middleEndianType === 'word-swapped') {
    for (let i = 0; i < bytes.length; i += 4) {
      reordered.push(...bytes.slice(i + 2, i + 4), ...bytes.slice(i, i + 2));
    }
  }
  else {
    throw new Error('Unsupported middle-endian format.');
  }

  return {
    bigEndian: `0x${reordered.join('')}`,
    littleEndian: `0x${[...reordered].reverse().join('')}`,
  };
}

export function formatInteger(hexInput: string): {
  decimal: string
  octal: string
  hexadecimal: string
} {
  try {
    const hex = hexInput.replace(/^0x/, '');
    const intValue = BigInt(`0x${hex}`);

    return {
      decimal: intValue.toString(10),
      octal: `0o${intValue.toString(8)}`,
      hexadecimal: `0x${intValue.toString(16).toUpperCase()}`,
    };
  }
  catch {
    return {
      decimal: 'Invalid',
      octal: 'Invalid',
      hexadecimal: 'Invalid',
    };
  }
}
