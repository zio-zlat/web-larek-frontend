import { ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	totalPrice: number;
	valid: boolean;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this.button = container.querySelector('.basket__button');

		if (this.button) {
			this.button.addEventListener('click', () => {
				this.events.emit('basket:submit');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set totalPrice(value: number) {
		if (String(value).length <= 4) {
			this.setText(this._price, value);
		} else {
			this.setText(this._price, formatNumber(value));
		}
	}

	set valid(value: number) {
		if (value !== 0) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
			this.setText(this._price, 'В корзине нет товаров');
		}
	}
}
