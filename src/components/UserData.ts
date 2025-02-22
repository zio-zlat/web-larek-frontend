import { IUser, IUserData, TFormErrors } from '../types';
import { IEvents } from './base/events';

export class UserData implements IUserData {
	protected user: IUser = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	formErrors: TFormErrors = {};
	constructor(protected events: IEvents) {}

	setUserData(field: keyof IUser, value: string) {
		this.user[field] = value;

		if (this.validateUser(field)) {
			this.events.emit('valid-user: changed', this.formErrors);
		}
	}

	getUserData(): IUser {
		return this.user;
	}

	validateUser(field: keyof IUser): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.user[field]) {
			if (field === 'address') {
				errors.address = 'Необходимо указать адресс доставки';
			}
			if (field === 'email') {
				errors.email = 'Необходимо указать email';
			}
			if (field === 'phone') {
				errors.phone = 'Необходимо указать телефон';
			}
		}
		// if (formName === 'order') {
		//     if (!this.user.address) {
		//         errors.email = 'Необходимо указать адресс доставки';
		//     }
		// }
		// if (formName === 'contacts') {
		//     if (!this.user.email) {
		//         errors.email = 'Необходимо указать email';
		//     }
		//     if (!this.user.phone) {
		//         errors.phone = 'Необходимо указать телефон';
		//     }
		// }
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
