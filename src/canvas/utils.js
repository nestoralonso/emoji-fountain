export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomEmoji() {
  const min = 0x1F300;
  const max = 0x1F5FF;

  return String.fromCodePoint(randomInt(min, max));
}

export function randomColor() {
  return [
    randomInt(60, 255),
    randomInt(60, 255),
    randomInt(60, 255),
    0.5 + Math.random() / 2
  ];
}
