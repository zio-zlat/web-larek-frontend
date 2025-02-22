import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CardsData } from './components/CardsData';
import { testCard1, testCard2, testCards } from './utils/test';
import { BasketData } from './components/BascketData';
import { UserData } from './components/UserData';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard } from './types';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const cardsData = new CardsData(events);
const basketData = new BasketData(events)
const userData = new UserData(events);


//cardsData.setCards(testCards)

api.getCards()
    .then((data: ICard[]) => {
        cardsData.setCards(data)
    })
    .catch(err => {
        console.log(err)
    })
console.log(cardsData);
    console.log(cardsData.getCard('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'))
