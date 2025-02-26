import { IOrder, IUser, TBasketItem } from '../types';

export class Order {
	protected order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	setOrder(user: IUser, card: TBasketItem[]) {
		this.order = {
			payment: user.payment,
			email: user.email,
			phone: user.phone,
			address: user.address,
			total: card.reduce((acc, item) => acc + item.price, 0),
			items: card.map((item) => item.id),
		};
	}

	getOrder(): IOrder {
		return this.order;
	}

	clearOrder() {
		this.order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}
}
