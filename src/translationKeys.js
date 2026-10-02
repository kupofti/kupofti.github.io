const DEFAULT_LANGUAGE = "en";
const ATTRIBUTES = ["title", "aria-label", "placeholder"];
const ORIGINALS = new WeakMap();
const KEY_HINT_LENGTH = 32;

const clean = (value) => value.replace(/\s+/g, " ").trim();
const isLanguageText = (value) => /[^\W\d_]/u.test(value);

function hash(value) {
	let result = 0x811c9dc5;
	for (let index = 0; index < value.length; index++) {
		result ^= value.charCodeAt(index);
		result = Math.imul(result, 0x01000193);
	}
	return (result >>> 0).toString(16).padStart(8, "0");
}

function keyFor(value, attribute) {
	const hint = value.length > KEY_HINT_LENGTH
		? `${value.slice(0, KEY_HINT_LENGTH).trimEnd()}…`
		: value;
	const prefix = attribute ? `@${attribute}:` : "";
	return `${prefix}${hint}~${hash(value)}`;
}

function sourceValue(node, attribute) {
	const original = ORIGINALS.get(node);
	if (attribute) {
		if (!original) ORIGINALS.set(node, new Map());
		const values = ORIGINALS.get(node);
		if (!values.has(attribute)) values.set(attribute, node.getAttribute(attribute));
		return values.get(attribute);
	}
	if (!ORIGINALS.has(node)) ORIGINALS.set(node, node.nodeValue);
	return ORIGINALS.get(node);
}

function entries(root) {
	const result = [];
	const add = (value, node, attribute) => {
		const source = clean(value || "");
		if (!source || !isLanguageText(source)) return;
		result.push({
			key: keyFor(source, attribute),
			node,
			attribute,
		});
	};
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode: (node) => /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(node.parentElement?.tagName)
			? NodeFilter.FILTER_REJECT
			: NodeFilter.FILTER_ACCEPT,
	});

	let node;
	while ((node = walker.nextNode())) add(sourceValue(node), node);
	root.querySelectorAll("*").forEach((element) => {
		ATTRIBUTES.forEach((attribute) => {
			if (element.hasAttribute(attribute)) add(sourceValue(element, attribute), element, attribute);
		});
	});
	return result;
}

function setValue(entry, value) {
	if (entry.attribute) {
		entry.node.setAttribute(entry.attribute, value);
		return;
	}
	const original = entry.node.nodeValue || "";
	entry.node.nodeValue = `${original.match(/^\s*/)[0]}${value}${original.match(/\s*$/)[0]}`;
}

export function createLanguageDictionary(root = document, origin = {}) {
	const current = Object.fromEntries(entries(root).map((entry) => [entry.key, clean(
		entry.attribute ? entry.node.getAttribute(entry.attribute) : entry.node.nodeValue,
	)]));
	if (!Object.keys(origin).length) {
		return current;
	}
	return Object.fromEntries(Object.keys(origin).map((key) => [
		key,
		current[key] || origin[key],
	]));
}

export function applyTranslations(root, dictionary) {
	entries(root).forEach((entry) => {
		if (typeof dictionary[entry.key] === "string") setValue(entry, dictionary[entry.key]);
	});
}

export function preprocessTranslations(content, dictionary) {
	const template = document.createElement("template");
	template.innerHTML = content;
	applyTranslations(template.content, dictionary);
	return template.innerHTML;
}

export async function loadLanguage(files) {
	const dictionaries = await Promise.all(files.map(async (file) => (await fetch(file)).json()));
	return Object.assign({}, ...dictionaries);
}

export async function initTranslations({
	root = document,
	language = new URLSearchParams(window.location.search).get("lang") ||
		window.localStorage.getItem("language") ||
		navigator.language.split("-")[0] ||
		DEFAULT_LANGUAGE,
	files = (selectedLanguage) => [`lang/${selectedLanguage}.json`],
} = {}) {
	const selectedLanguage = language.toLowerCase();
	const paths = typeof files === "function" ? files(selectedLanguage) : files;
	const dictionary = await loadLanguage(paths);
	applyTranslations(root, dictionary);
	document.documentElement.lang = selectedLanguage;
	return dictionary;
}

export async function downloadLanguageDictionary(root = document, filename = "en.json") {
	const json = JSON.stringify(createLanguageDictionary(
        root, 
        filename == `${DEFAULT_LANGUAGE}.json` ? {} : await loadLanguage([`lang/${DEFAULT_LANGUAGE}.json`])
    ), null, 2);

	const link = document.createElement("a");
	link.href = URL.createObjectURL(new Blob([`${json}\n`], { type: "application/json" }));
	link.download = filename;
	link.click();
	URL.revokeObjectURL(link.href);
}

export const translationsReady = typeof window === "undefined"
	? Promise.resolve({})
	: new Promise(resolve => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", resolve, { once: true });
		} else {
			resolve();
		}
	}).then(() => initTranslations()).catch(error => {
		console.error("Unable to initialize translations", error);
		return {};
	});

if (typeof window !== "undefined") {
	window.translationTools = {
		applyTranslations,
		createLanguageDictionary,
		downloadLanguageDictionary,
		initTranslations,
		loadLanguage,
		preprocessTranslations,
	};
}
