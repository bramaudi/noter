export const autoTitleSize = (str = '') => {
	const { length: len } = str
	if (len < 10) return 'text-2xl'
	else if (len < 30) return 'text-xl'
	else if (len < 50) return 'text-lg'
	else return 'text-sm'
}