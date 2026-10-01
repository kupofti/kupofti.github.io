# Utilisation de l'IA

## 2026/09/06
>Working off of this page and style base, elaborate a portfolio site layout while in-keeping with the existing stylistic choices (dark, épuré, using relatively simple or minimal elements, center column, CRT bleed, amber phosphorous, higher-contrast but dulled sharp outlines, ascii/cp437 box ui), adding a system of sections and cards to show off a thumbnail of each project and a small description that links to their own page.

Affectés: `index.html`, `style/layout.css`

Traitement: accepté tel-quel comme visualisation, appropriation distincte future

## 2026/09/23
>Add a translation key system using a flat json lang file (keys based on base language text, can be nested objects too but should resolve the same). Make the system intuitive and not require manual writing of translation keys in the html (optimally no extra params added to html tags). If possible, make a utility to create a lang dict from a page's contents using predictable and consistent keys. Exclude content that is strictly non-language from translation (e.g. the slashes in the navigation, the year, the "->" arrows, etc). Do not duplicate/discriminate strictly identical keys (now that I think of it, I don't think the discriminators are needed, since it's extremely unlikely that a same exact text will be in such a fragment where it must be written in different ways in one language but not in another).

Affectés: `index.html`, `src/translationKeys.js`

Traitement: utilisé pour créer le dossier `lang`, modifié `downloadLanguageDictionary` pour une traduction plus facile.

## 2026/10/01
>Improve the translation key system to be more standard, and add it as a pre-processing step to the page.js page loader. Also implement the loadProjectPage, which is like a normal page loader but it adds the project-specific card to the top, bypassing the pageIndex to use the projects data directly to use that id to get the pages/:projectId page

Affectés: `src/page.js`, `src/translationKeys.js`

Traitement: accepté

# 5 questions de bloc

1. Qu'est-ce que j'ai accompli depuis le dernier bloc?
2. Quelle a été ma principale difficulté et comment je l'ai surmontée?
3. Qu'est-ce que j'ai appris que je ne savais pas avant?
4. Quelle est ma prochaine étape concrète?
5. Est-ce que j'ai utilisé l'IA? Si oui, pour quoi et qu'est-ce que ça m'a appris?

## Bloc 1

1. La création du style, des maquettes, et d'un prototype du site.
2. J'ai de la difficulté à arriver à un design spécifique à partir de zéro. Utiliser l'IA pur genérer des variations de design m'a aidé a identifier quels éléments j'aimais et quels je ne voudrait pas utiliser pour me présenter.
3. L'existance de Figma Make.
4. Rendre mon prototype de site fonctionnel à part juste les styles de base et le populer avec du vrai texte.
5. Oui (2026/09/06), pour l'élaboration du style et contenu de mon prototype de site à partir de la base existante (rapprocher du style spécifique du portfolio au lieu de mon style de site de base). L'IA agentique est à la fois plus puissante et plus stupide que je ne le pensais. Je suis habitué au fonctionnement des GML mais pas aux harnais d'agents. 