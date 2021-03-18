/**
 * Generates a non-repeating id
 * every time it is invoked
 */
const generateId = (function GenerateId() {
  let id = 1;

  return function generateId() {
    return id++ + "";
  };
})();

class Reconnaissance {
  constructor(items) {
    this.items = items;
    if (this.items.length === 0)
      throw new Error(
        `Expected config of social sites to be present, but did not get any`
      );
    this._generateConfig();
  }
  _generateConfig() {
    this.items.forEach((item) => {
      const id = generateId();
      item["id"] = id;
    });

    return items;
  }

  createContextMenu() {
    const context = "selection";
    const items = this._generateConfig();

    chrome.contextMenus.create({
      title: "Start Reconnaissance",
      contexts: [context],
      id: "parent",
    });

    items.forEach((item) => {
      chrome.contextMenus.create({
        title: item.name,
        contexts: [context],
        id: item.id,
        parentId: "parent",
      });
    });
  }

  search({ id, text }) {
    const { dork } = this.items.find((item) => item.id === id);

    this._openSiteInNewGoogleTab({ text, dork });
  }

  _openSiteInNewGoogleTab({ text, dork }) {
    const url =
      "https://www.google.com/search?q=" +
      encodeURIComponent(`${text} ${dork}`);
    window.open(url, "_blank");
  }
}

const items = [
  { name: "Linkedin", dork: "@linkedin" },
  { name: "Twitter", dork: "@twitter" },
];
const reconnaissance = new Reconnaissance(items);

function onInstalled() {
  reconnaissance.createContextMenu();
}

function onClickHandler({ selectionText, menuItemId }) {
  reconnaissance.search({ id: menuItemId, text: selectionText });
}

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.contextMenus.onClicked.addListener(onClickHandler);
