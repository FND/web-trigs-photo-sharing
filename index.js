import express from "express";
import nunjucks from "nunjucks";
import { fileURLToPath } from "url";
import path from "path";

let HOST = "localhost";
let PORT = 3000;
let IMAGES = [{
	url: "/photos/perseverance",
	source: "https://images.nasa.gov/details-PIA24430",
	image: "https://images-assets.nasa.gov/image/PIA24430/PIA24430~small.jpg",
	caption: "Perseverance's First Full-Color Look at Mars",
	liked: Math.random() > 0.5,
	likes: 11
}, {
	url: "/photos/covid",
	source: "https://phil.cdc.gov/Details.aspx?pid=23311",
	image: "https://phil.cdc.gov//PHIL_Images/23311/23311_lores.jpg",
	caption: "coronavirus morphology",
	liked: Math.random() > 0.5,
	likes: 5
}, {
	url: "/photos/shakyamuni",
	source: "https://collections.si.edu/search/detail/edanmdm:fsg,_F1909.94",
	image: "https://ids.si.edu/ids/deliveryService?id=FS-7755_05&max=500",
	caption: "Pedestal with lotus petals, lions, and donor, originally supporting a Shijia Buddha (Shakyamuni) figure",
	liked: Math.random() > 0.5,
	likes: 3
}, {
	url: "/photos/horse-butts",
	source: "https://www.flickr.com/photos/statelibraryofnsw/4425270,0480/",
	image: "https://live.staticflickr.com/4851/44252700480_24c12b914c_z.jpg",
	caption: "Stephen Butts on a white horse, Macquarie Street, Sydney, c.1850",
	liked: Math.random() > 0.5,
	likes: 7
}];

let ROOT = path.dirname(fileURLToPath(import.meta.url));

let app = express();
app.use("/", express.static(absolutePath("./assets")));
nunjucks.configure(absolutePath("./views"), {
	express: app
});

app.get("/", (req, res) => {
	res.render("index.html", { images: IMAGES });
});

app.use("/photos/:id", express.urlencoded({ extended: false }));
app.post("/photos/:id", (req, res) => {
	let op = req.body.liked === "1" ? "liked" : "unliked";
	console.error(`${op} photo: ${req.params.id}`);
	res.redirect("/");
});

let server = app.listen(PORT, HOST, _ => {
	let { address, port } = server.address();
	console.error(`→ http://${address}:${port}`);
});

function absolutePath(filepath) {
	return path.resolve(ROOT, filepath);
}
