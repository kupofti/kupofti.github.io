import Cicero from "./cicero/src/Cicero.js";

const router = new Cicero.Router();

router
    .redirect("", "/")

    .start();

window.router = router;