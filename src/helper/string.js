export const nl2br = (str = '') => {
	return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />')
}

export const truncateText = ( str = '', limit = 100, useWordBoundary = true ) => {
  if (str.length <= limit) return str;
  const subString = str.substr(0, limit-1); // the original check
  return (useWordBoundary 
    ? subString.substr(0, subString.lastIndexOf(" ")) 
    : subString) + "...";
};