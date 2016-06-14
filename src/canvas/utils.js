export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randIndex(arr) {
    return randomInt(0, arr.length - 1);
}

const emojiRanges = [
    [0x0001f330, 0x0001f335],
    [0x0001f337, 0x0001f37c],
    [0x0001f380, 0x0001f393],
    [0x0001f3a0, 0x0001f3c4],
    [0x0001f3c6, 0x0001f3ca],
    [0x0001f3e0, 0x0001f3f0],
    [0x0001f400, 0x0001f43e],
    [0x0001f440, 0x0001f440],
    [0x0001f442, 0x0001f4f7],
    [0x0001f4f9, 0x0001f4fc],
/**
 * Doesnt contain much characters in the default font    
    [0x0001f500, 0x0001f53d],
    [0x0001f540, 0x0001f543],
    [0x0001f550, 0x0001f567],
*/    
];

export function randomEmoji() {
  const randRange = emojiRanges[randIndex(emojiRanges)];
  return String.fromCodePoint(randomInt(randRange[0], randRange[1]));
}

export function randomColor() {
  return [
    randomInt(60, 255),
    randomInt(60, 255),
    randomInt(60, 255),
    0.5 + Math.random() / 2
  ];
}
