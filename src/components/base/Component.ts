export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setImage(element: HTMLImageElement, value: string, alt?: string) {
		if (element) {
			element.src = value;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	protected toggleClass(
		element: HTMLElement,
		className: string,
		force?: boolean
	) {
		element.classList.toggle(className, force);
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
