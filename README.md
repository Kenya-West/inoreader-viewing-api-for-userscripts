# inoreader-viewing-api-for-userscripts

This userscript provides an API for other userscripts to modify the viewing experience of Inoreader.

Based on [Kenya-West/userscript-typescript-template-kw](https://github.com/Kenya-West/userscript-typescript-template-kw).

## Features

### Styles support

Just write your styles in `src/assets/styles/styles.scss` and they will append in web page's `<head></head>`!

You can also add your own files with `.css` or `.scss` extension in `StylesInjecter` class.

### Splitted assets for different development workflow

The repository generates two different assets (files):

1. One is fully compiled (`index.user.js`);
2. The second (`index.hot-reload.user.js`) has userscript's meta info and reference to the first asset so you can copy and paste its entire code to Tampermonkey **once**.

This allows you faster updating scripts by automatically picking up recent changes.

### Better tooling support

The project has different classes to:
- Render, remove elements;
- Guards (which are TS decorators) that allow you to restrict method/function execution;
- HTML element finders;
- Build your own HTML elements declaratively.

## Usage

### API

This scripts produces list of events, prefixed with `tm_inoreader-viewing-api-for-userscripts_`:

| Event Name                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| `articleAdded`                    | Triggered when a article is added. It appies both for new and read articles.                                       |
| `articleNewAdded`                 | Triggered when a new article is added. |
| `articleReadAdded`                | Triggered when an already read read article is added.                                 |
| `articleMediaLoadCompleted`       | Triggered when the media associated with an article has finished loading. It appies both for new and read articles.   |
| `articleMediaLoadFailed`          | Triggered when the media associated with an article has failed to load. It appies both for new and read articles.     |
| `articleMediaLoadSuccess`         | Triggered when the media associated with an article has successfully loaded. It appies both for new and read articles.|
| `articleNewMediaLoadCompleted`    | Triggered when the media associated with a **new** article has finished loading.|
| `articleNewMediaLoadFailed`       | Triggered when the media associated with a **new** article has failed to load.  |
| `articleNewMediaLoadSuccess`      | Triggered when the media associated with a **new** article has successfully loaded.|
| `articleReadMediaLoadCompleted`   | Triggered when the media associated with a **read** article has finished loading.|
| `articleReadMediaLoadFailed`      | Triggered when the media associated with a **read** article has failed to load. |
| `articleReadMediaLoadSuccess`     | Triggered when the media associated with a **read** article has successfully loaded.|
| `articleModified`                 | Triggered when an article is modified.                                      |

In your userscript, you can subscribe to events like this:

```js
document.addEventListener('tm_inoreader-viewing-api-for-userscripts_articleAdded', (e) => {
    // your code
    // All data is in `e.detail?.details`
});
```

All data is accessed through `e.detail?.details` object. It contains `element` (`HTMLElement`) of article and various flags and text data of the article. Look into [element.model.ts](https://github.com/Kenya-West/inoreader-viewing-api-for-userscripts/blob/master/src/custom/models/element.model.ts#L6) file to see which fields are available to read.

### Development

- Clone this repository

```powershell
# Use Github CLI
$ gh repo clone kenya-west/inoreader-viewing-api-for-userscripts
# Or use 'git clone' command directly
$ git clone https://github.com/Kenya-West/inoreader-viewing-api-for-userscripts.git
```

1. Install dependencies with `npm ci`.
2. Edit settings in `userscript` object in [`package.json`](./package.json), you can refer to the comments in [`plugins/userscript.plugin.ts`](./plugins/userscript.plugin.ts).
3. Code your userscript in `src` directory (like [`src/index.ts`](./src/index.ts)).
4. Generate userscript with `npm run build` or `npm run build:watch` to auto-update resulting bundle on changes.
5. Copy generated userscript contents `index.hot-reload.user.ts` to **Tampermonkey** -> **Add new script**.

### 3. (Optional) Compile other file types

You need install other loader plugins to support other file types.

### 4. Debug

Allow Tampermonkey's access to local file URIs ([Tampermonkey FAQs](https://tampermonkey.net/faq.php?ext=dhdg#Q204)) and import built userscript's file URL. 

### 5. Publish you userscript

You can publish your userscript to [Greasy Fork](https://greasyfork.org/) or other websites.

You can push your userscript to [Github](https://github.com) and import it to [Greasy Fork](https://greasyfork.org/import).

## Roadmap

### 🕒 Add top icon buttons support
### 🕒 Add footer text element
### 🕒 Add replacement for cover image with image or video
### 🕒 Add carousel support
