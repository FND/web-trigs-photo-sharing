let MAX = "middleware".length + 4;

export function register(app, routes) {
	let uris = Object.entries(routes).reduce((memo, [route, descriptor]) => {
		report(route);
		let { name, uri, middleware, ...methods } = descriptor;
		if(name) {
			report("name", name);
		} else {
			throw new Error(`missing name for route \`${route}\``);
		}

		[].concat(middleware || []).forEach(mw => {
			report("middleware", mw.name);
			app.use(route, mw);
		});
		Object.entries(methods).forEach(([method, handler]) => {
			if(method.toUpperCase() !== method) {
				report("ignoring", method);
				return;
			}
			report(method, handler.name);
			method = method.toLowerCase();
			app[method](route, handler);
		});

		if(memo[name]) {
			throw new Error(`duplicate route name \`${name}\``);
		}
		memo[name] = params => {
			if(uri) {
				if(uri.call) { // arbitrary signature (e.g. for positional arguments)
					params = uri.call(descriptor, params);
				} else if(uri.pop) { // allow-list for parameter names -- XXX: unnecessary?
					params = uri.reduce((memo, name) => {
						memo[name] = params[name];
						return memo;
					}, {});
				}
			}
			return supplant(route, params);
		};
		return memo;
	}, {});
	return (name, ...params) => uris[name](...params);
}

// performs string substitution of named parameters prefixed with `:`
// adapted from Douglas Crockford <http://javascript.crockford.com/remedial.html>
let PATTERN = /:([a-zA-Z0-9]+)/g; // XXX: too restrictive?
function supplant(str, params) {
	return str.indexOf(":") === -1 ? str : str.replace(PATTERN, (match, key) => {
		let res = params[key];
		return typeof res === "string" || typeof res === "number" ?
			encodeURIComponent(res) : match;
	});
}

function report(msg, identifier) {
	if(identifier) {
		msg = `    ${msg.padEnd(MAX, " ")}\`${identifier}\``;
	}
	console.error("[ROUTER]", msg);
}
