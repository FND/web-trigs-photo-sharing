let ENTRIES = [{
	id: "perseverance",
	source: "https://images.nasa.gov/details-PIA24430",
	image: "https://images-assets.nasa.gov/image/PIA24430/PIA24430~small.jpg",
	caption: "Perseverance's First Full-Color Look at Mars",
	likes: 11
}, {
	id: "covid",
	source: "https://phil.cdc.gov/Details.aspx?pid=23311",
	image: "https://phil.cdc.gov//PHIL_Images/23311/23311_lores.jpg",
	caption: "coronavirus morphology",
	likes: 5
}, {
	id: "shakyamuni",
	source: "https://collections.si.edu/search/detail/edanmdm:fsg,_F1909.94",
	image: "https://ids.si.edu/ids/deliveryService?id=FS-7755_05&max=500",
	// eslint-disable-next-line max-len
	caption: "Pedestal with lotus petals, lions, and donor, originally supporting a Shijia Buddha (Shakyamuni) figure",
	likes: 3
}, {
	id: "horse-butts",
	source: "https://www.flickr.com/photos/statelibraryofnsw/4425270,0480/",
	image: "https://live.staticflickr.com/4851/44252700480_24c12b914c_z.jpg",
	caption: "Stephen Butts on a white horse, Macquarie Street, Sydney, c.1850",
	likes: 7
}];

export class Store {
	constructor() {
		this._entries = ENTRIES.reduce((memo, entry) => {
			memo.set(entry.id, new Entry(entry));
			return memo;
		}, new Map());
	}

	get all() {
		return [...this._entries.values()];
	}
}

export class Entry {
	constructor({ id, source, image, caption, likes }) {
		Object.assign(this, { id, source, image, caption, likes });
	}

	get liked() {
		return Math.random() > 0.5;
	}

	get url() {
		return `/photos/${this.id}`; // XXX: hard-coded
	}
}
