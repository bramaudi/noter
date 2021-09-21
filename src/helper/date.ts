export const formatDate = (dateStr: string): string => {
	const current = new Date()
	const x = new Date(dateStr)
	if (!x) return dateStr
	const year = current.getFullYear() !== x.getFullYear() ? `, ${x.getFullYear()}` : ''
	const months_lang = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const month = months_lang[x.getMonth()]
	const date = x.getDate()
	return `${month} ${date} ${year}`
}

export const toIsoString = (date: Date): string => {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num: number) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };

  return date.getFullYear() +
		'-' + pad(date.getMonth() + 1) +
		'-' + pad(date.getDate()) +
		'T' + pad(date.getHours()) +
		':' + pad(date.getMinutes()) +
		':' + pad(date.getSeconds()) +
		dif + pad(tzo / 60) +
		':' + pad(tzo % 60);
}