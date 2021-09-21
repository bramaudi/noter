export const nl2br = (str: string) => {
	var breakTag = '<br />';
  var replaceStr = '$1'+ breakTag;
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

export const truncateText = (str: string, limit = 300, useWordBoundary = true) => {
  if (str.length <= limit) return str;
  const subString = str.substr(0, limit-1); // the original check
  return (
    useWordBoundary 
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString
  ) + '...'
};

export const encodeHTMLEntities = (str: string) => {
  return str
    .replace(/./gm, s => (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";")
    .replace(/\t/g, () => '&nbsp;&nbsp;&nbsp;&nbsp;') // 1 tab = 4 spaces
    // .replace(/\u0020/g, t => '&nbsp;') // encode spacebar
}

export const parseURL = (str: string) => {
  var url_regex = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return str.replace(url_regex, '<a class="text-blue-800" target="_blank" href="$1">$1</a>');
}