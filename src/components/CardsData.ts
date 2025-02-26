import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected _cards: ICard[];
	protected preview: string | null;

	constructor(protected events: IEvents) {}

	setCards(items: ICard[]) {
		this._cards = items;
		this.events.emit('cards:changed');
	}

	getCard(cardID: string) {
		return this._cards.find((item) => item.id === cardID);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

	get cards() {
		return this._cards;
	}
}
