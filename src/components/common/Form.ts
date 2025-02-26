import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected formName: string;
	protected formButton: HTMLButtonElement;
	protected formErrors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.formName = container.getAttribute('name');
		this.formButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.container
		);
		this.formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		container.addEventListener('input', (evt: InputEvent) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.events.emit(`user-${String(field)}:change`, {
				field,
				value,
				formName: this.formName,
			});
		});

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}-button:submit`);
		});
	}

	set valid(isValid: boolean) {
		this.formButton.disabled = !isValid;
	}

	set errors(value: string) {
		this.setText(this.formErrors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...other } = state;
		super.render({ valid, errors });
		Object.assign(this, other);
		return this.container;
	}
}
