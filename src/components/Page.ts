import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	catalog: HTMLElement[];
	basketCounter: number;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _basketCounter: HTMLElement;
	protected pageWrapper: HTMLElement;
	protected buttonBasket: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.buttonBasket = ensureElement<HTMLButtonElement>('.header__basket');

		this.buttonBasket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, value);
	}

	set locked(value: boolean) {
		this.toggleClass(this.container, 'page_locked', value);
		this.toggleClass(this.pageWrapper, 'page__wrapper_locked', value);
	}
}
