import Cicero from "./cicero/src/Cicero.js";

const router = new Cicero.Router();

router
    .redirect("", "/")
    .route("/", () => loadPage("home"))

    .route("/projects/:projectId", (params) => loadPage(p.projectId))

    .start();

window.router = router;