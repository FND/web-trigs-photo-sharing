let MAX = "middleware".length + 4;

export function register(app, routes) {
	Object.entries(routes).forEach(([route, descriptor]) => {
		report(route);
		let { middleware, ...methods } = descriptor;
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
	});
}

function report(msg, identifier) {
	if(identifier) {
		msg = `    ${msg.padEnd(MAX, " ")}\`${identifier}\``;
	}
	console.error("[ROUTER]", msg);
}
