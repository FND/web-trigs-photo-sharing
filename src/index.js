import { register } from "./router.js";
import { Store } from "./store.js";
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

let HOST = "localhost";
let PORT = 3000;
let ROOT = path.dirname(fileURLToPath(import.meta.url));
let STORE = new Store();
let ROUTES = {
	"/": {
		name: "root",
		middleware: express.static(absolutePath("../assets")),
		GET: showRoot
	},
	"/:filepath": {
		// NB: corresponding handler registered as `root` middleware
		name: "asset",
		uri: filepath => ({
			filepath: filepath.split("/")
		})
	},
	"/photos/:id": {
		name: "photo",
		uri: id => ({ id }),
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
app.use(cookieParser("e3259fb6-4d9d-464e-85d2-509abf383099"));
nunjucks.configure(absolutePath("../views"), { express: app });
let resolveURI = register(app, ROUTES);

let server = app.listen(PORT, HOST, () => {
	let { address, port } = server.address();
	console.error(`→ http://${address}:${port}`);
});

function showRoot(req, res) {
	if(req.signedCookies.user !== USER.id) {
		res.cookie("user", USER.id, {
			httpOnly: true,
			signed: true
		});
	}

	res.render("index.html", {
		currentUser: USER.id,
		profile: USER,
		entries: STORE.all,
		resolveURI
	});
}

function toggleLike(req, res) {
	let { user } = req.signedCookies;
	if(!user) {
		res.set("Content-Type", "text/plain");
		res.status(401).send("unauthorized");
		return;
	}

	let { id } = req.params;
	let { liked } = req.body;
	if(liked === "1") {
		STORE.addLike(id, user);
	} else {
		STORE.removeLike(id, user);
	}
	res.redirect(resolveURI("root"));
}

function absolutePath(filepath) {
	return path.resolve(ROOT, filepath);
}
