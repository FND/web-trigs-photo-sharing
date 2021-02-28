/* eslint-env browser */

// copied from hijax-form
export function submitForm(form, { headers, cors, strict } = {}) {
	let method = form.getAttribute("method");
	method = method ? method.toUpperCase() : "GET";
	let uri = form.getAttribute("action");
	let payload = serializeForm(form);

	if(method === "GET") {
		if(uri.indexOf("?") !== -1) {
			throw new Error("query strings are invalid within `GET` forms' " +
					"`action` URI; please use hidden fields instead");
		}
		uri = [uri, payload].join("?");
	} else {
		headers = headers || {};
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		var body = payload; // eslint-disable-line no-var
	}

	form.setAttribute("aria-busy", "true");
	let reset = () => {
		form.removeAttribute("aria-busy");
	};
	return httpRequest(method, uri, headers, body, { cors, strict }).
		then(res => {
			reset();
			return res;
		}).
		catch(err => {
			reset();
			throw err;
		});
}

// copied from hijax-form
function serializeForm(form) {
	let selector = ["input", "textarea", "select"].
		map(tag => `${tag}[name]:not(:disabled)`).join(", ");
	let radios = {};
	return find(form, selector).reduce((params, node) => {
		let { name } = node;
		let value;
		switch(node.nodeName.toLowerCase()) {
		case "textarea":
			value = node.value;
			break;
		case "select":
			value = node.multiple ?
				find(node, "option:checked").map(opt => opt.value) :
				node.value;
			break;
		case "input":
			switch(node.type) {
			case "file":
				throw new Error("`input[type=file]` fields are unsupported");
			case "checkbox":
				if(node.checked) {
					value = node.value;
				}
				break;
			case "radio":
				if(!radios[name]) {
					let field = form.
						querySelector(`input[type=radio][name=${name}]:checked`);
					value = field ? field.value : undefined;
					if(value) {
						radios[name] = true;
					}
				}
				break;
			default:
				value = node.value;
				break;
			}
			break;
		}

		if(value !== undefined) {
			let values = value || [""];
			if(!values.pop) {
				values = [values];
			}
			values.forEach(value => {
				let param = [name, value].map(encodeURIComponent).join("=");
				params.push(param);
			});
		}
		return params;
	}, []).join("&");
}

// copied from uitil
function httpRequest(method, uri, headers, body, { cors, strict } = {}) {
	let options = {
		method,
		credentials: cors ? "include" : "same-origin"
	};
	if(headers) {
		options.headers = headers;
	}
	if(body) {
		options.body = body;
	}

	let res = fetch(uri, options);
	return !strict ? res : res.then(res => {
		if(!res.ok) {
			throw new Error(`unexpected ${res.status} response at ${uri}`);
		}
		return res;
	});
}

// adapted from uitil
function find(node, selector) {
	if(node.substr) { // for convenience
		[selector, node] = [node, selector];
	}
	let nodes = node.querySelectorAll(selector);
	return [...nodes];
}
