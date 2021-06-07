export interface ICookies {
	getValue(name: string): Promise<string | undefined>
	setValue(name: string, value: string): Promise<boolean>
	remove(name: string): Promise<boolean>
}

export class Cookies implements ICookies {
	constructor(private url: string) {}

	async getValue(name: string) {
		const cookie = await chrome.cookies.get({
			url: this.url,
			name,
		})

		return cookie?.value
	}

	async setValue(name: string, value: string) {
		const cookie = await chrome.cookies.set({
			url: this.url,
			name,
			value,
		})

		return !!cookie
	}

	async remove(name: string) {
		const cookie = await chrome.cookies.remove({
			url: this.url,
			name,
		})

		return !!cookie
	}
}