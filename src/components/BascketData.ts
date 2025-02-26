import { IBasketData, ICard, TBasketItem } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected products: TBasketItem[];

	constructor(protected events: IEvents) {
		this.products = [];
	}

	actionWithProduct(card: ICard) {
		if (card.price !== null) {
			if (this.getInBasket(card.id)) {
				this.products = this.products.filter((item) => item.id !== card.id);
				this.events.emit('basket:changed', card);
			} else {
				this.products.push({
					id: card.id,
					price: card.price,
				});
				this.events.emit('basket:changed', card);
			}
		} else return console.log('Бесценный товар добавить нельзя');
	}

	getProducts() {
		return this.products;
	}

	getSumPrice() {
		return this.products.reduce((acc, item) => acc + item.price, 0);
	}

	getInBasket(itemID: string) {
		return this.products.some((item) => item.id === itemID);
	}

	getIndexProduct(card: ICard) {
		return this.products.findIndex((item) => item.id === card.id) + 1;
	}

	clearBasket() {
		this.products = [];
		this.events.emit('basket:changed');
	}
}
