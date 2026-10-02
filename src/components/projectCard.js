const template = await fetch(new URL("./projectCard.html", import.meta.url).href).then(res => res.text());

export const projectCard = ({ id, title, description, hasPage }) => template
    .replace("%id%", id)
    .replace("%title%", title)
    .replace("%description%", description)
    .replace(hasPage ? "%pagelink%" : /%pagelink%.+/m, "");