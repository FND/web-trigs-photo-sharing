/* eslint-env browser */
import { ajaxify, html2dom } from "../util.js";
import { submitForm } from "../forms.js";

export default class CommunityLikes extends HTMLElement {
	connectedCallback() {
		this.addEventListener("submit", this.onSubmit);
	}

	async onSubmit(ev) {
		ev.preventDefault();

		let res = await ajaxify(this, () => submitForm(this.form, { strict: true }));
		if(!res) { // request already in progress
			return;
		}

		let html = await res.text();
		let { id } = this;
		let match = html2dom(html).querySelector(`[data-id=${id}]`);
		this.innerHTML = match.innerHTML;
	}

	get form() {
		return this.querySelector("form");
	}

	get id() {
		return this.getAttribute("data-id");
	}
}
