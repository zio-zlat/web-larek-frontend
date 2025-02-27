import { formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IConfirmView {
	description: number;
}

export class Confirm extends Component<IConfirmView> {
	protected _description: HTMLElement;
	protected buttonSuccess: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._description = container.querySelector('.order-success__description');
		this.buttonSuccess = container.querySelector('.button');

		if (this.buttonSuccess) {
			this.buttonSuccess.addEventListener('click', () => {
				this.events.emit('confirm:submit');
			});
		}
	}

	set description(value: number) {
		if (String(value).length <= 4) {
			this.setText(this._description, `Списано ${value} синапсов`);
		} else {
			this.setText(
				this._description,
				`Списано ${formatNumber(value)} синапсов`
			);
		}
	}
}
