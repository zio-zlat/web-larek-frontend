# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, которые используются в приложении
Карточка товара

```
interface ICard {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}
```

Данные пользователя

```
interface IUser {
  email: string;
  phone: number;
  address: string;
  payment: string;
}
```

Интерфейс для модели коллекции карточек

```
interface ICardsData {
  setCards(cards: ICard[]): void;
  getCard(cardID: string): ICard;
  setPreview(item: ICard): void;
}
```

Данные корзины для работы корзины товаров

```
export type TBasketItem = Pick<ICard, 'id' | 'price'>
```

Интерфейс для модели коллекции карточек

```
interface IBasketData {
  actionWithProduct(card: ICard): void;
	getProducts(): TBasketItem[];
	getAmountProducts(): number;
	getSumPrice(): number;
  getInBasket(itemID: string): boolean;
  clearBasket(): void;
}
```

Данные для валидации формы пользователя

```
export type TFormErrors = Partial<Record<keyof IUser, string>>;
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данныхж;
- презентер, отвечает за связь слоев представления и данных.

### Базовый код

#### Класс API
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс CardsData
Класс отвечает за хранение и логику работы с данными карточек товаров.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- cards: ICard[] - массив объектов карточек товаров
- preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setCards(items: ICard[]): void - метод для сохранения карточек товаров
- getCard(cardID: string): ICard - возвращает карточку по ее id
- setPreview(item: ICard): void - сохраняет ID выбранной карточки в поле preview.

#### Класс UserData
Класс отвечает за хранение и логику работы с данными пользователя.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- user: IUser - данные пользователя
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setUserData(field: keyof IUser, value: string, formName: string): void - сохраняет данные пользователя в классе. Принимает атрибут name формы для валидации данных
- getUserData(): IUser - возвращает данные пользователя
- validateUser(formName: string): boolean - проверяет заполнение данных пользователя и при ошибке заполняет поле класса formErrors. 

#### Класс BasketData
Класс отвечает за хранение и логику работы с данными корзины.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- products: TBasketItem[] - массив товаров, добавленных в корзину
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- actionWithProduct(card: ICard): void - добавление товара в корзину или удаление, если товар был ранее добавлен 
- getProducts(): TBasketItem[] - возвращение массива товаров, добавленных в корзину
- getAmountProducts(): number - возвращение количества добавленных товаров
- getSumPrice(): number - возвращение общей стоимости добавленных товаров
- getInBasket(itemID: string): boolean - метод для проверки добавления товара в корзину
- clearBasket(): void - удаление товаров из корзины, после успешного заказа.

### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.\  
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает родительский контейнер модального окна и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- closeButton: HTMLButtonElement - кнопка закрытия модального окна
- _content: HTMLElement - элемент разметки, в который будет происходить добавление темплейта
- content: HTMLElement - темплейт содержания модального окна.

Методы:
- open(): void - открытие модального окна
- close(): void - закрытие модального окна
- render(data: IModalData): HTMLElement - возвращает содержимое модального окна.

#### Класс Basket
Отвечате за отображение корзины товаров. Принимает темплейт корзины для добавления в модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса:
- list: HTMLElement - элемент разметки, в котором будут выводиться добавленные товары
- price: HTMLElement - элемент разметки для вывода общей суммы
- button: HTMLElement - кнопка для перехода к оформлению заказа.

Методы:
- setItems(items: HTMLElement[]) - метод для вывода товаров в корзине
- setPrice(value: number) - метод для вывода общей суммы, добавленных в корзину товаров
- setValid(value: boolean) - метод для блокировки кнопки корзины, если в корзине не были добавлены товары.

#### Класс Form
Реализует форму ввода данных пользователя. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Принимает темплейт формы для добавления в модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса:
- form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- formButton: HTMLButtonElement - кнопка подтверждения
- formErrors: HTMLElement - элемент разметки, в котором будут выводиться ошибки формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- buttons: NodeListOf<HTMLButtonElement> - коллекция всех кнопок выбора оплаты.

Методы:
- setValid(isValid: boolean) - изменяет активность кнопки подтверждения
- getValues(): Record<string, string> - возвращает объект с данными формы, где ключ - name инпута или кнопки, значение - данные введенные пользователем
- setError(value: string) - принимает данные для отображения текста ошибки в форме
- render(data: Partial<IFormState>): HTMLFormElement - возвращает полное содержание формы.

#### Класс Confirm
Предназначен для реализации окна подтверждения корреткного оформления заказа.\
Принимает темплейт окна для добавления в модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса:
- buttonSuccess: HTMLButtonElement - кнопка подтверждения.

#### Класс Card
Класс используется для отображения карточек на главной странице сайта, в модальном окне с подробной информацией о товаре и в корзине. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми генерируются соответствующие события.\
Принимает темплейт карточки и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса:
- cardID: string - id отображаемой карточки товара
- title: HTMLElement - элемент разметки для вывода названия товара
- price: HTMLElement - элемент разметки для вывода цены товара
- category?: HTMLElement - элемент разметки для вывода категории товара
- image?: HTMLImageElement - элемент разметки для вывода изображения товара
- description?: HTMLElement - элемент разметки для вывода описания товара
- cardButton?: HTMLButtonElement - кнопка добавления товара в корзину или удаления, если ранее товар уже был добавлен
- cardIndex?: HTMLElement - элемент разметки для вывода порядкового номера товара в корзине
- cardDelete?:  HTMLButtonElement - кнопка для удаления товара из корзины.

Методы:
- render(cardData: Partial<ICardView>): HTMLElement - метод для вывода всего содержимого карточки товара
- сеттеры и геттеры для заполнения полей класса.

#### Класс Page
Отвечает за отображение блока с карточками товаров на главной странице и счетчика количества товаров в корзине.\ 
Принимает контейнер, в котором размещаются карточки товаров и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса:
- catalog: HTMLElement - элемент разметки для вывода списка товаров
- pageWrapper: HTMLElement - элемент всей страницы для блокировки прокрутки, если открыто модальное окно
- basketCounter: HTMLElement - элемент разметки для вывода количества товаров в корзине
- buttonBasket: HTMLButtonElement - кнопка для октрытия корзины.

Методы:
- setCatalog(items: HTMLElement[]) - метод для вывода товаров на страницу
- setCounter(value: number) - метод для вывода счетчика количества товаров в корзине
- setLocked(value: boolean) - метод для блокировки или разблокировки страницы при открытии модального окна.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards:changed` - изменение массива карточек товаров
- `preview:changed` - изменение открываемой в модальном окне карточки товара
- `basket:changed` - изменение массива товаров, добавленных в корзину
- `valid-user: changed` - изменение валидации данных пользователя
- `formErrors:change` - изменение валидности данных пользователя

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения в модальном окне
- `card:open` - открытие модального окна с подробным описанием товара
- `card:submit` - событие, генерируемое при нажатии на кнопку в модальном окне товара
- `card:delete` - выбор карточки для удаления из корзины
- `basket:open` - открытие модального окна c корзиной товаров
- `basket:submit` - событие, генерируемое при нажатии на кнопку в модальном окне корзины
- `order:open` - открытие модального окна c формой оформления заказа
- `cash:select` - выбор безналичной оплаты
- `card:select` - выбор оплаты картой
- `order-button:submit` - событие, генерируемое при нажатии на кнопку в модальном окне c формой оформления заказа
- `contact:open` - открытие модального окна c формой заполнения данных пользователя
- `input:change` - изменилось поле ввода данных в форме
- `contact-button:submit` - событие, генерируемое при нажатии на кнопку в модальном окне c формой заполнения данных пользователя
- `modal:open` - событие, генерируемое при открытие модального окна
- `modal:close` - событие, генерируемое при закрытии модального окна
