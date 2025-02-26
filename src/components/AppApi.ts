import { ICard, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IAppApi {
	getCards: () => Promise<ICard[]>;
	postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getCards(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
