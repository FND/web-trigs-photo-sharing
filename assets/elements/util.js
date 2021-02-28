let BUSY = "aria-busy";

// performs an AJAX operation and manages the respective element's pending state
// NB: returns `false` without executing `fn` if a previous operation is pending
export async function ajaxify(node, fn) {
	if(node.hasAttribute(BUSY)) {
		return false;
	}

	node.setAttribute(BUSY, "true");
	try {
		let res = await deflicker(fn());
		return res;
	} finally {
		node.removeAttribute(BUSY);
	}
}

export function html2dom(html) {
	let tmp = document.createElement("template");
	tmp.innerHTML = html;
	return tmp.content.cloneNode(true);
}

// copied from uitil
export function replaceNode(oldNode, ...newNodes) {
	let container = oldNode.parentNode;
	newNodes.forEach(node => {
		container.insertBefore(node, oldNode);
	});
	container.removeChild(oldNode);
}

// defers a promise to avoid UI flickering
function deflicker(prom, minDelay = 200) {
	return Promise.all([prom, wait(minDelay)]).then(([res, _]) => res);
}

// copied from hijax-form
function wait(delay) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, delay);
	});
}
