import { IProduct, IProductData } from '../../types';
import { IEvents } from '../base/events';

export class ProductsData implements IProductData {
	protected _product: IProduct[];
	protected preview: string | null;

	constructor(protected events: IEvents) {}

	setProducts(items: IProduct[]) {
		this._product = items;
		this.events.emit('products:changed');
	}

	getProduct(productID: string) {
		return this._product.find((item) => item.id === productID);
	}

	setPreview(productID: string) {
		this.preview = productID;
		this.events.emit('preview:changed', this.getProduct(productID));
	}

	get cards() {
		return this._product;
	}
}
