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
    [0x0001f4f9, 0x0001f4fc]
];

export function randomEmoji() {
  const randRange = emojiRanges[randIndex(emojiRanges)];
  return String.fromCodePoint(randomInt(randRange[0], randRange[1]));
}

/**
 *
 *
 * @param {boolean} [alpha=false]
 * @returns {Array} vector4 containing RGBA
 */
export function randomColor(alpha=false) {
  const alphaVal = alpha ? 0.5 + Math.random() / 2 : 1;
  return [
    randomInt(60, 255),
    randomInt(60, 255),
    randomInt(60, 255),
    alphaVal,
  ];
}

function measureText(text, fontSize, fontFamily) {
  let w, h, div = measureText.div || document.createElement('div');
  div.style.font = fontSize + 'px/' + fontSize + 'px ' + fontFamily;
  div.style.padding = '0';
  div.style.margin = '0';
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.innerHTML = text;
  if (!measureText.div) document.body.appendChild(div);
  w = div.clientWidth;
  h = div.clientHeight;
  measureText.div = div;
  return { width: w, height: h };
}

export function createTextBuffer(text='A', fontSize=24, fontFamily='Arial') {
    // Create offscreen buffer for our text rendering.
    // This way all we have to do is draw our buffer to
    // the main canvas rather than drawing text each frame.
    const textBuffer = document.createElement('canvas');

    const m = measureText(text, fontSize, fontFamily);
    // Resize the buffer.
    textBuffer.width = m.width;
    textBuffer.height = m.height;
    // Render to our buffer.
    const ctx = textBuffer.getContext('2d');
    ctx.font = fontSize + 'px/' + fontSize + 'px ' + fontFamily;
    // Set the baseline to middle and offset by half the text height.
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, m.height/2);

    return textBuffer;
}