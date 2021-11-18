export const colorMixer = (
  hexColorA: string,
  hexColorB: string,
  amountToMix = 0.5
) => {
  const colorRgbA = hexToRgb(hexColorA);
  const colorRgbB = hexToRgb(hexColorB);

  const mixRgb = colorMixerRGB(colorRgbA, colorRgbB, amountToMix);

  return rgbToHex(mixRgb.r, mixRgb.g, mixRgb.b);
};

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw new Error('Color format is not valid.');
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const colorChannelMixer = (
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number
) => {
  const channelA = colorChannelA * amountToMix;
  const channelB = colorChannelB * (1 - amountToMix);
  return Math.floor(channelA + channelB);
};

const colorMixerRGB = (rgbA: RGB, rgbB: RGB, amountToMix: number): RGB => {
  const r = colorChannelMixer(rgbA.r, rgbB.r, amountToMix);
  const g = colorChannelMixer(rgbA.g, rgbB.g, amountToMix);
  const b = colorChannelMixer(rgbA.b, rgbB.b, amountToMix);

  return {
    r,
    g,
    b,
  };
};

interface RGB {
  r: number;
  g: number;
  b: number;
}
