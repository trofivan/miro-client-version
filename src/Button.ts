export enum IconState {
	Enabled = '✓',
	Disabled = 'X',
	Undefined = '?',
}

const Colors = {
	[IconState.Enabled]: '#1A8000',
	[IconState.Disabled]: '#DB0000',
	[IconState.Undefined]: '#666666',
}

export interface IButton {
	setState(state: IconState): void
	onButtonClick(): void
}

export class Button implements IButton {
	constructor() {}

	setState(state: IconState) {
		chrome.action.setBadgeText({text: state})
		chrome.action.setBadgeBackgroundColor({
			color: Colors[state]
		})
	}

	onButtonClick() {}
}
