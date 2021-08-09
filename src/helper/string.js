export const nl2br = (str = '') => {
	return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />')
}

export const truncateText = ( str = '', limit = 300, useWordBoundary = true ) => {
  if (str.length <= limit) return str;
  const subString = str.substr(0, limit-1); // the original check
  return (
    useWordBoundary 
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString
  ) + '...'
};

export const encodeHTMLEntities = (str = '') => {
  return str
    .replace(/./gm, s => (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";")
    .replace(/\t/g, t => '&nbsp;&nbsp;&nbsp;&nbsp;') // 1 tab = 4 spaces
    // .replace(/\u0020/g, t => '&nbsp;') // encode spacebar
}