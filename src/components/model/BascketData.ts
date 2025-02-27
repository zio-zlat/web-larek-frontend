import { IBasketData, IProduct, TBasketItem } from '../../types';
import { IEvents } from '../base/events';

export class BasketData implements IBasketData {
	protected products: TBasketItem[];

	constructor(protected events: IEvents) {
		this.products = [];
	}

	actionWithProduct(product: IProduct) {
		if (product.price !== null) {
			if (this.getInBasket(product.id)) {
				this.products = this.products.filter((item) => item.id !== product.id);
				this.events.emit('basket:changed', product);
			} else {
				this.products.push({
					id: product.id,
					price: product.price,
				});
				this.events.emit('basket:changed', product);
			}
		} else return console.log('Бесценный товар добавить нельзя');
	}

	getProducts() {
		return this.products;
	}

	getSumPrice() {
		return this.products.reduce((acc, item) => acc + item.price, 0);
	}

	getInBasket(productID: string) {
		return this.products.some((item) => item.id === productID);
	}

	getIndexProduct(product: IProduct) {
		return this.products.findIndex((item) => item.id === product.id) + 1;
	}

	clearBasket() {
		this.products = [];
		this.events.emit('basket:changed');
	}
}
