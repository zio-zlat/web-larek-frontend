import { IUser, IUserData, TFormErrors } from '../types';
import { IEvents } from './base/events';

export class UserData implements IUserData {
	protected user: IUser = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	protected formErrors: TFormErrors = {};
	constructor(protected events: IEvents) {}

	setUserData(field: keyof IUser, value: string) {
		this.user[field] = value;

		if (this.validateUser()) {
			this.events.emit('valid-user:changed');
		}
	}

	getUserData(): IUser {
		return this.user;
	}

	validateUser(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.user.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.user.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.user.address) {
			errors.address = 'Необходимо указать адресс доставки';
		}
		if (!this.user.payment) {
			errors.payment = 'Нет ';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearUser() {
		this.user = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
	}
}
