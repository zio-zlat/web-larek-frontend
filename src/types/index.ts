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
  cards: ICard[];
  preview: string | null;
	getCard(cardID: string): ICard;
  setPreview(item: ICard): void;
}

export interface IUserData {
	setUserData(userData: Partial<IUser>): void;
	getUserData(): Partial<IUser>;
  validateUser(formName: string): boolean;
}

export type TBasketItem = Pick<ICard, 'id' | 'price'>

export interface IBasketData {
	products: TBasketItem[];
  actionWithProduct(item: ICard): void;
	getProducts(): TBasketItem[];
	getAmountProducts(): number;
	getSumPrice(): number;
  getInBasket(itemID: string): boolean;
  clearBasket(): void;
}

export type FormErrors = Partial<Record<keyof IUser, string>>;