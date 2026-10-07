const template = await fetch(new URL("./projectCard.html", import.meta.url).href).then(res => res.text());

export const projectCard = ({ id, title, description, link, hasPage, date }, dedicated = false) => template
    .replaceAll("%id%", id)
    .replaceAll("%title%", title)
    .replace("%description%", description)
    .replace("%pagelink%", !dedicated && hasPage ? `/projects/${id}` : (link || ""))
    .replace("%target%", (dedicated || !hasPage) && link ? "target=\"_blank\"" : "")
    .replace("%linkhint%", (!hasPage || dedicated) ? "OPEN PROJECT " : "READ MORE ")
    .replace(hasPage || link ? "%linkhintel%" : /%linkhintel%.+/m, "")
    .replace("%date%", date ? (date.split("-").join(" / ")) : "")
    .replace("%year%", date ? (date.split("-")[0]) : "");