import CryptoJS from 'crypto-js'

export const encrypt = (data, pharse) => {
	return CryptoJS.AES.encrypt(data, pharse).toString()
}

export const decrypt = (cipher, pharse) => {
	return CryptoJS.AES.decrypt(cipher, pharse)
		.toString(CryptoJS.enc.Utf8)
}