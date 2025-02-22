import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected cards: ICard[];
	protected preview: string | null;

	constructor(protected events: IEvents) {
    }

	setCards(items: ICard[]) {
		this.cards = items;
		this.events.emit('cards:changed', this.cards);
	}

	getCard(cardID: string) {
		return this.cards.find((item) => item.id === cardID);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}
}
