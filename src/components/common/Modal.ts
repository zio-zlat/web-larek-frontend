import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalContent {
	content: HTMLElement;
}

export class Modal extends Component<IModalContent> {
	protected _content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.closeEsc = this.closeEsc.bind(this);
	}

	set content(item: HTMLElement) {
		this._content.replaceChildren(item);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this.closeEsc);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		document.removeEventListener('keydown', this.closeEsc);
		this.events.emit('modal:close');
	}

	protected closeEsc(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModalContent): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
