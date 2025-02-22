import { ICard, IUser } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IAppApi {
	getCards: () => Promise<ICard[]>;
}

interface IOrderResult {
    id: string;
    total: number;
}

interface IOrder{
    user: IUser;
    total: number;
    items: [];
}

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
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

    // postOrder(order: IOrder): Promise<IOrderResult> {
    //     return this.post('/order', order).then
    // }
}
