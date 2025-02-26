import { ICard } from '../../types';
import { ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ICardView {
	id: string;
	title: string;
	price: number;
	category?: string;
	image?: string;
	description?: string;
	cardIndex?: number;
}

export class Card extends Component<ICardView> {
	protected events: IEvents;
	protected _cardID: string;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _cardIndex?: HTMLElement;
	protected cardActionButton?: HTMLButtonElement;
	protected cardDelete?: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._cardIndex = container.querySelector('.basket__item-index');
		this.cardActionButton = container.querySelector('.card__row .card__button');
		this.cardDelete = container.querySelector('.basket__item-delete');

		if (container.classList.contains('gallery__item')) {
			container.addEventListener('click', () => {
				this.events.emit('card:select', { id: this.id });
			});
		}

		if (this.cardActionButton) {
			this.cardActionButton.addEventListener('click', () => {
				this.events.emit('card:submit', { id: this.id });
			});
		}

		if (this.cardDelete) {
			this.cardDelete.addEventListener('click', () => {
				this.events.emit('card:delete', { id: this.id });
			});
		}
	}

	set id(id: string) {
		this._cardID = id;
	}

	get id() {
		return this._cardID;
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set price(price: number) {
		if (price === null) {
			this.setDisabled(this.cardActionButton, true);
			this.setText(this._price, 'Бесценно');
			this.setText(this.cardActionButton, 'Товар нельзя добавить');
		} else {
			this.setDisabled(this.cardActionButton, false);
			if (String(price).length <= 4) {
				this.setText(this._price, price);
			} else {
				this.setText(this._price, formatNumber(price));
			}
		}
	}

	set category(category: string) {
		this.setText(this._category, category);
		if (this._category) {
			switch (category) {
				case 'софт-скил':
					this._category.className = 'card__category card__category_soft';
					break;
				case 'хард-скил':
					this._category.className = 'card__category card__category_hard';
					break;
				case 'другое':
					this._category.className = 'card__category card__category_other';
					break;
				case 'дополнительное':
					this._category.className = 'card__category card__category_additional';
					break;
				case 'кнопка':
					this._category.className = 'card__category card__category_button';
					break;
			}
		}
	}

	set image(image: string) {
		this.setImage(this._image, image, this.title);
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set cardIndex(value: number) {
		this.setText(this._cardIndex, value);
	}

	set cardButtonInBasket(value: boolean) {
		if (value) {
			this.setText(this.cardActionButton, 'Убрать');
		} else {
			this.setText(this.cardActionButton, 'В корзину');
		}
	}

	render(dataCard: ICard, inBasket?: boolean): HTMLElement {
		this.cardButtonInBasket = inBasket;
		Object.assign(this, dataCard);
		return this.container;
	}
}
