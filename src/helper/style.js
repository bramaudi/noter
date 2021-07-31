const autoTitleSize = (str = '') => {
	const { length: len } = str
	if (len >= 30) return 'text-sm'
	else if (len >= 10) return 'text-base'
	else if (len >= 5) return 'text-lg'
	else return 'text-xl'
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
	x = +x // parseInt
	const hex = x.toString(16)
	return hex.length === 1 ? '0' + hex : hex
}).join('')

const hexToRgbArray = (hex) => {
	if (hex.slice(0, 1) === '#') hex = hex.slice(1);
	if (!/^(?:[0-9a-f]{3}){1,2}$/i.test(hex)) throw new Error(`Invalid HEX color: "${hex}"`);
	// normalize / convert 3-chars hex to 6-chars.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	return [
		parseInt(hex.slice(0, 2), 16), // r
		parseInt(hex.slice(2, 4), 16), // g
		parseInt(hex.slice(4, 6), 16)  // b
	];
}

const invertToBW = (color) => {
	const options = {
    black: '#000000',
    white: '#ffffff',
    threshold: Math.sqrt(1.05 * 0.05) - 0.05
	}
	const getLuminance = (c) => {
    let i, x;
    const a = []; // so we don't mutate
    for (i = 0; i < c.length; i++) {
			x = c[i] / 255;
			a[i] = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
	}
	return getLuminance(hexToRgbArray(color)) > options.threshold
		? options.black
		: options.white
}

const truncateText = (str = '', limit = 20, suffix = '...') => {
	const words = str.split(' ')
	if (words.length > limit) {
		words.splice(limit, 0, suffix) // add suffix before limited string
		words.splice(limit + 1, (words.length - limit)) // delete the rest
	}
	return words.join(' ')
}

export {
	autoTitleSize,
	rgbToHex,
	invertToBW,
	truncateText
}