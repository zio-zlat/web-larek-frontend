import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { ProductsData } from './components/model/ProductsData';
import { BasketData } from './components/model/BascketData';
import { UserData } from './components/model/UserData';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IUser } from './types';
import { Card } from './components/view/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/view/Basket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { Order } from './components/model/OrderData';
import { Confirm } from './components/view/Confirm';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Модели данных для работы приложения
const cardsData = new ProductsData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);
const orderData = new Order();

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const confirmTemplate = ensureElement<HTMLTemplateElement>('#success');

// Переиспользуемые контейнеры
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(formOrderTemplate), events);
const formContacts = new FormContacts(
	cloneTemplate(formContactsTemplate),
	events
);
const confirmModal = new Confirm(cloneTemplate(confirmTemplate), events);
const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

// Отображение католога карточек на главной странице
events.on('products:changed', () => {
	page.catalog = cardsData.cards.map((card) => {
		const cardGallery = new Card(cloneTemplate(cardTemplate), events);
		return cardGallery.render(card);
	});
});

// Выбор карточки
events.on('card:select', (card: Partial<IProduct>) => {
	cardsData.setPreview(card.id);
});

// Открытие выбранной карточки
events.on('preview:changed', (card: IProduct) => {
	modal.render({
		content: cardPreview.render(card, basketData.getInBasket(card.id)),
	});
});

// Нажатие на кнопку в карточке товара
events.on('card:submit', (card: IProduct) => {
	basketData.actionWithProduct(cardsData.getProduct(card.id));
	cardPreview.cardButtonInBasket = basketData.getInBasket(card.id);
});

// Открытие модального окна с корзиной
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
	basket.valid = basketData.getProducts().length;
});

// Если произошли изменения в корзине, то пересчитать данные
events.on('basket:changed', () => {
	page.basketCounter = basketData.getProducts().length;

	const listBasket = basketData.getProducts().map((item) => {
		return cardsData.getProduct(item.id);
	});
	basket.items = listBasket.map((item) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
		cardBasket.cardIndex = basketData.getIndexProduct(item);
		return cardBasket.render(item);
	});

	basket.totalPrice = basketData.getSumPrice();
	basket.valid = basketData.getProducts().length;
});

// Удаление карточки товара из корзины
events.on('card:delete', (card: Partial<IProduct>) => {
	basketData.actionWithProduct(cardsData.getProduct(card.id));
});

// Произошло нажатие на кнопку в корзине, нужно открыть модальное окно с формой заказа
events.on('basket:submit', () => {
	if (basketData.getProducts().length !== 0) {
		modal.render({
			content: formOrder.render({
				buttonPay: '',
				address: '',
				valid: false,
				errors: [],
			}),
		});
		userData.clearUser();
	} else console.log('Перейти к оформлению с пустой корзиной нельзя');
});

// Изменилось любое поле или кнопка в форме
events.on(/^user\-.*:change/, (data: { field: keyof IUser; value: string }) => {
	userData.setUserData(data.field, data.value);
});

// Изменение валидации формы
events.on('formErrors:change', (errors: Partial<IUser>) => {
	const { address, payment, email, phone } = errors;
	formOrder.valid = !address && !payment;
	formOrder.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('');

	formContacts.valid = !email && !phone;
	if (email && phone) {
		formContacts.errors = 'Необходимо указать email и телефон';
	} else
		formContacts.errors = Object.values({ email, phone })
			.filter((i) => !!i)
			.join('');
});

// Произошло нажатие на кнопку в форме заказа, нужно открыть модальное окно с формой контактов
events.on('order-button:submit', () => {
	if (userData.getUserData().address && userData.getUserData().payment) {
		modal.render({
			content: formContacts.render({
				email: '',
				phone: '',
				valid: false,
				errors: [],
			}),
		});
	} else console.log('Не заполнен адрес или способ оплаты');
});

// Если данные пользователя валидны, то сформировать заказ
events.on('valid-user:changed', () => {
	orderData.setOrder(userData.getUserData(), basketData.getProducts());
});

// Отправляем данные о заказе на сервер
events.on('contacts-button:submit', () => {
	api
		.postOrder(orderData.getOrder())
		.then((result) => {
			modal.render({
				content: confirmModal.render({
					description: result.total,
				}),
			});
			basketData.clearBasket();
			orderData.clearOrder();
		})
		.catch((error) => {
			console.log(error);
		});
});

// Закрытие модального окна с подтверждением заказа
events.on('confirm:submit', () => {
	modal.close();
});

// При открытии модального окна заблокировать страницу
events.on('modal:open', () => {
	page.locked = true;
});

// ...и разблокировать
events.on('modal:close', () => {
	page.locked = false;
});

// Получение данных с сервера
api
	.getCards()
	.then((data: IProduct[]) => {
		cardsData.setProducts(data);
	})
	.catch((err) => {
		console.log(err);
	});
