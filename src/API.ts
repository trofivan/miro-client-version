type APISchema = {
	clientVersion: string
}

export interface IAPI {
	fetch(name: keyof APISchema): Promise<string>
}

export class API implements IAPI {
	private cache: APISchema | undefined
	private isCacheValid = false
	static CACHE_INVALIDATION_TIMEOUT = 1000 * 60 * 10

	constructor(private endpoint: string) {}

	async fetch(name: keyof APISchema) {
		if (this.cache && this.isCacheValid) {
			return this.cache[name]
		}

		const cache = await this.updateCache()
		return cache[name]
	}

	private async updateCache(): Promise<APISchema> {
		const response = await fetch(this.endpoint)
		const json: APISchema = await response.json()
		this.cache = json

		this.isCacheValid = true
		setTimeout(() => this.isCacheValid = false, API.CACHE_INVALIDATION_TIMEOUT)

		return this.cache
	}
}
