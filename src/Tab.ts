import {isMiroDomain} from './helpers'

export interface ITab {
	isMiroDomain(tabId: number): Promise<boolean>
}

export class Tab implements ITab {
	async isMiroDomain(tabId: number) {
		const activeTab = await chrome.tabs.get(tabId)
		const tabUrl = activeTab.url

		return tabUrl ? isMiroDomain(tabUrl) : false
	}
}