const template = await fetch(new URL("./projectDetails.html", import.meta.url).href).then(res => res.text());

const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const projectDetails = details => {
    if (!details || !Object.keys(details).length) return "";

    const rows = Object.entries(details)
        .map(([label, value]) => `<div><dt>${escapeHtml(label.toUpperCase())}</dt><dd>${escapeHtml(value)}</dd></div>`)
        .join("");

    return template.replace("%details%", rows);
};
