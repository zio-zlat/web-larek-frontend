import { IEvents } from './base/events';
import { Form } from './common/Form';

interface IFormOrder {
	buttonPay: string;
	address: string;
}

export class FormOrder extends Form<IFormOrder> {
	protected _buttonsPay: NodeListOf<HTMLButtonElement>;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonsPay = container.querySelectorAll('.button[type="button"]');

		this._buttonsPay.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.buttonPay = btn.name;
				this.events.emit(`user-${btn.name}:change`, {
					field: 'payment',
					value: btn.name,
					formName: this.formName,
				});
			});
		});
	}

	set buttonPay(value: string) {
		this._buttonsPay.forEach((btn) => {
			if (btn.getAttribute('name') === value) {
				btn.classList.add('button_alt-active');
			} else {
				btn.classList.remove('button_alt-active');
			}
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
