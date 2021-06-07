export enum FeatureNames {
	'LAYOUT_4' = 'LAYOUT_4'
}

export interface IFeatureFlags {
	isFeatureAvailable(featureName: FeatureNames): Promise<true | false | undefined>
}

export class FeatureFlags implements IFeatureFlags {
	constructor() {}

	async isFeatureAvailable(featureName: FeatureNames): Promise<true | false | undefined> {
		try {
			const enabledFeatures = await this.getEnabledFeatures()

			return enabledFeatures?.filter(feature => feature === featureName).length === 1
		} catch (e) {
			return undefined
		}
	}

	private async getEnabledFeatures(): Promise<string[] | undefined> {
		const [activeTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})

		if (activeTab && activeTab.id) {
			const [result] = await chrome.scripting.executeScript({
				target: {
					tabId: activeTab.id,
				},
				function: () => {
					const features = localStorage.getItem('rtb__enabled_features')
					return features !== null ? JSON.parse(features) : undefined
				},
			})

			return result.result as string[] | undefined
		}
	}
}