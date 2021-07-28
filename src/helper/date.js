export const formatDate = (dateString) => {
	const current = new Date()
	const x = new Date(dateString)
	if (!x) return null
	const year = current.getFullYear() !== x.getFullYear() ? `, ${x.getFullYear()}` : ''
	const months_lang = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const month = months_lang[x.getMonth()]
	const date = x.getDate()
	return `${month} ${date} ${year}`
}