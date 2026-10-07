const template = await fetch(new URL("./projectCard.html", import.meta.url).href).then(res => res.text());

export const projectCard = ({ id, title, description, hasPage }) => template
    .replaceAll("%id%", id)
    .replaceAll("%title%", title)
    .replace("%description%", description)
    .replace("%pagelink%", hasPage ? `/projects/${id}` : "")
    .replace(hasPage ? "%pagelinklabel%" : /%pagelinklabel%.+/m, "");