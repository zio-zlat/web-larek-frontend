export interface ICard {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number;
}

export interface IUser {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface ICardsData {
	setCards(items: ICard[]): void;
	getCard(cardID: string): ICard;
	setPreview(item: ICard): void;
}

export interface IUserData {
	//setUserData(field: keyof IUser, value: string, formName: string): void;
	setUserData(field: keyof IUser, value: string): void;
	getUserData(): IUser;
	//validateUser(formName: string): boolean;
	validateUser(field: keyof IUser): boolean;
}

export type TBasketItem = Pick<ICard, 'id' | 'price'>;

export interface IBasketData {
	actionWithProduct(card: ICard): void;
	getProducts(): TBasketItem[];
	getAmountProducts(): number;
	getSumPrice(): number;
	getInBasket(itemID: string): boolean;
	clearBasket(): void;
}

export type TFormErrors = Partial<Record<keyof IUser, string>>;
