// ==UserScript==
// @name        Emoji replacer
// @namespace   Violentmonkey Scripts
// @match       https://anilist.co/*
// @grant       none
// @version     1.1
// @author      - Mistaf
// @description replaces emojis in messages with the HTML entities to be displayed on anilist as emoji
// @downloadURL https://raw.githubusercontent.com/Mistaf/anilist-emojis/main/EmojiReplacer.js
// @updateURL   https://raw.githubusercontent.com/Mistaf/anilist-emojis/main/EmojiReplacer.js
// ==/UserScript==

const config = { childList: true, subtree: true };

const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (
            mutation.target.className == "activity-edit" ||
            mutation.target.className == "comment-editor active"
        ) {
            const textArea = mutation.target.querySelector("textarea");
            const actions = Array.from(mutation.addedNodes).find(
                (node) => node.className == "actions"
            );

            const markdownEditor = mutation.target.querySelector(
                "div.markdown-editor"
            );
            if (
                markdownEditor &&
                markdownEditor.lastChild.className != "emojiReplacer"
            ) {
                let emojiButton = document.createElement("div");
                emojiButton.className = "emojiReplacer";
                emojiButton.append("😀");

                emojiButton.onclick = (event) => {
                    const textArea =
                        markdownEditor.parentElement.querySelector("textarea");
                    replaceEmojis(textArea);
                };
                markdownEditor.append(emojiButton);
            }
            if (actions) {
                const saveButtons = actions.querySelectorAll("div.button.save");
                saveButtons.forEach((saveButton) => {
                    saveButton.addEventListener("click", () => {
                        replaceEmojis(textArea);
                    });
                });
            }
        }
    }
};

function replaceEmojis(textArea) {
    textArea.value
        .match(
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
        )
        .forEach((match) => {
            textArea.value = textArea.value.replace(
                match,
                `&#${match.codePointAt()};`
            );
        });
}

const observer = new MutationObserver(callback);

const interval = setInterval(() => {
    const targetNode = document.querySelector("div#app");
    if (targetNode && targetNode.children.length > 0) {
        observer.observe(targetNode, config);
        clearInterval(interval);
    }
}, 100);
