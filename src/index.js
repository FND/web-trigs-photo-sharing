import { register } from "./router.js";
import { Store } from "./store.js";
import express from "express";
import nunjucks from "nunjucks";
import { fileURLToPath } from "url";
import path from "path";

let HOST = "localhost";
let PORT = 3000;
let ROOT = path.dirname(fileURLToPath(import.meta.url));
let STORE = new Store();
let ROUTES = {
	"/": {
		middleware: express.static(absolutePath("../assets")),
		GET: showRoot
	},
	"/photos/:id": {
		middleware: express.urlencoded({ extended: false }),
		POST: toggleLike
	}
};
let USER = {
	id: "johndoe",
	name: "John Doe",
	avatar: "dummy.jpg",
	role: "web dresser"
};

let app = express();
nunjucks.configure(absolutePath("../views"), {
	express: app
});
register(app, ROUTES);

let server = app.listen(PORT, HOST, () => {
	let { address, port } = server.address();
	console.error(`→ http://${address}:${port}`);
});

function showRoot(req, res) {
	res.render("index.html", {
		profile: USER,
		entries: STORE.all
	});
}

function toggleLike(req, res) {
	let { user, liked } = req.body;
	let op = liked === "1" ? "liked" : "unliked";
	console.error(`${user} ${op} photo: ${req.params.id}`);
	res.redirect("/");
}

function absolutePath(filepath) {
	return path.resolve(ROOT, filepath);
}
