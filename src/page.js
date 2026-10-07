import Cicero from "./cicero/src/Cicero.js";
import { projectCard } from "./components/projectCard.js";
import { projectDataFor } from "./projectLoader.js";
import { preprocessTranslations, translationsReady } from "./translationKeys.js";

const pages = await fetch("/pages/pageIndex.json").then(res => res.json());
const translations = await translationsReady;

const pageLoader = (pathProvider, preprocess = content => content) => contentProvider => async key => {
    const main = document.querySelector("main");
    const path = pathProvider(key);

    const { content, data } = await contentProvider(key, path, main);
    if (content === false) return;

    main.innerHTML = preprocess(content, translations);
    document.title = data.title;

    main.querySelectorAll("[src]").forEach(sourced => sourced.src = new URL(
        sourced.getAttribute("src"),
        new URL(path, location)
    ));

    main.querySelectorAll("script").forEach(Cicero.Router.replaceAndRunScript);
};

const loadPage = pageLoader(
    key => `/pages/${key}/index.html`,
    preprocessTranslations,
)(async (key, path, main, bypassindex = false) => {
    const p = bypassindex ? { id: key, title: key } : pages.find(entry => entry.id === key);
    if (!p) {
        main.innerHTML = `Sorry m8, can't find that. <a id="tryhard">Try anyways?</a>`;
        document.querySelector("#tryhard").onclick = () => loadPage(key, path, main, true);
        throw new Error("Sorry m8, can't find that");
    }

    if (p.ex === true) {
        location.replace(path);
        return false;
    }

    const content = await fetch(path)
        .then(res => res.ok ? res.text() : `Sorry m8, ERROR ${res.status}`)
        .catch(error => `Sorry m8: ${error.message}`);

    return { content, data: p };
});

const loadProjectPage = pageLoader(
    key => `/pages/${key}/index.html`,
    preprocessTranslations,
)(async (key, path) => {
    const project = projectDataFor(key);
    if (!project) {
        throw new Error(`Sorry m8, can't find project "${key}"`);
    }

    const content = await fetch(path)
        .then(res => res.ok ? res.text() : `Sorry m8, ERROR ${res.status}`)
        .catch(error => `Sorry m8: ${error.message}`);

    return {
        content: `<h1>${project.title}</h1><div class="page-card-container">${projectCard(project, true)}</div>${content}`,
        data: project,
    };
});

const loadHomeSection = sectionId => loadPage("home").then(() => {
    setTimeout(
        () => document.getElementById(sectionId)?.scrollIntoView(),
        200
    );
});

const router = new Cicero.Router()
    .redirect("", "/")
    .route("/", () => loadPage("home"))
    .route("about", () => loadHomeSection("about"))
    .route("contact", () => loadHomeSection("contact"))

    .route("/projects/", () => loadPage("projects"))
    .route("/projects/:projectId", (params) => loadProjectPage(params.projectId))

    .start();

document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="/#"]');
    if (!link) return;

    const sectionId = new URL(link.href).hash.slice(1);
    if (!["about", "contact"].includes(sectionId)) return;

    event.preventDefault();
    history.pushState({ path: sectionId }, "", link.href);

    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView();
    } else {
        loadHomeSection(sectionId);
    }
});

window.router = router;