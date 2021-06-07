import {Button, IButton, IconState} from './Button'
import {ITab, Tab} from './Tab'
import {FeatureFlags, FeatureNames, IFeatureFlags} from './FeatureFlags'

const updateButtonState = (featureFlags: IFeatureFlags, button: IButton) => {
	setTimeout(async () => {
		const isFeatureAvailable = await featureFlags.isFeatureAvailable(FeatureNames.LAYOUT_4)

		if (isFeatureAvailable === true) {
			button.setState(IconState.Enabled)
		}

		if (isFeatureAvailable === false) {
			button.setState(IconState.Disabled)
		}

		if (isFeatureAvailable === undefined) {
			button.setState(IconState.Undefined)
		}
	}, 100)
}

const toggleFeatureFlag = async ({id, url}: chrome.tabs.Tab, featureName: FeatureNames, tab: ITab, featureFlags: IFeatureFlags) => {
	if (id) {
		const isMiro = await tab.isMiroDomain(id)

		if (isMiro && url) {
			const isFeatureAvailable = await featureFlags.isFeatureAvailable(featureName)
			const {origin, pathname} = new URL(url)
			chrome.tabs.update({
				url: `${origin}${pathname}?${isFeatureAvailable ? `featuresOff` : `featuresOn`}=${featureName}`,
			})
		}
	}
}

async function init() {
	const tab = new Tab()

	const button = new Button()
	const featureFlags = new FeatureFlags()

	const updateButtonStateWrapper = () => updateButtonState(featureFlags, button)
	const toggleFeatureFlagWrapper = async (activeTab: chrome.tabs.Tab) => toggleFeatureFlag(activeTab, FeatureNames.LAYOUT_4, tab, featureFlags)

	chrome.tabs.onActivated.addListener(updateButtonStateWrapper)
	chrome.tabs.onUpdated.addListener(updateButtonStateWrapper)
	chrome.windows.onFocusChanged.addListener(updateButtonStateWrapper)
	chrome.action.onClicked.addListener(toggleFeatureFlagWrapper)

	updateButtonStateWrapper()
}

init()
