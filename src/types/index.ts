export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export interface IUser {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface IProductData {
	setProducts(items: IProduct[]): void;
	getProduct(productID: string): IProduct;
	setPreview(productID: string): void;
}

export interface IUserData {
	setUserData(field: keyof IUser, value: string): void;
	getUserData(): IUser;
	validateUser(): boolean;
}

export type TBasketItem = Pick<IProduct, 'id' | 'price'>;

export interface IBasketData {
	actionWithProduct(product: IProduct): void;
	getProducts(): TBasketItem[];
	getSumPrice(): number;
	getInBasket(itemID: string): boolean;
	clearBasket(): void;
}

export type TFormErrors = Partial<IUser>;

export interface IOrder extends IUser {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}
