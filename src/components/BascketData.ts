import { IBasketData, ICard, TBasketItem } from '../types';
import { testCard1, testCard2 } from '../utils/test';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected products: TBasketItem[];

	constructor(protected events: IEvents) {
		this.products = [];
	}

	actionWithProduct(card: ICard) {
		if (this.getInBasket(card.id)) {
			this.products = this.products.filter((item) => item.id !== card.id);
			this.events.emit('basket:changed', {
				count: this.getAmountProducts(),
				sum: this.getSumPrice(),
			});
		} else {
			this.products.push({
				id: card.id,
				price: card.price,
			});
			this.events.emit('basket:changed', {
				count: this.getAmountProducts(),
				sum: this.getSumPrice(),
			});
		}
	}

	getProducts() {
		return this.products;
	}

	getAmountProducts() {
		return this.products.length;
	}

	getSumPrice() {
		return this.products.reduce((acc, item) => acc + item.price, 0);
	}

	getInBasket(itemID: string) {
		return this.products.some((item) => item.id === itemID);
	}

	clearBasket() {
		this.products = [];
		this.events.emit('basket:changed', {
			count: this.getAmountProducts(),
			sum: this.getSumPrice(),
		});
	}
}
