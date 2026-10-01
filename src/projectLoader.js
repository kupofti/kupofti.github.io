const projects = await fetch("/data/projects.json").then(res => res.json());

export const projectDataFor = (id) => projects.find(entry => entry.id === id);
export { projects };