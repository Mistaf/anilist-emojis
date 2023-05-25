// ==UserScript==
// @name        Emoji replacer
// @namespace   Violentmonkey Scripts
// @match       https://anilist.co/*
// @grant       none
// @version     1.0
// @author      - Mistaf
// @description replaces emojis in messages with the HTML entities to be displayed on anilist as emoji
// @downloadURL https://raw.githubusercontent.com/Mistaf/anilist-emojis/main/EmojiReplacer.js
// @updateURL   https://raw.githubusercontent.com/Mistaf/anilist-emojis/main/EmojiReplacer.js
// ==/UserScript==

const targetNode = document.querySelector("div#app");
const config = { childList: true, subtree: true };

const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (
            mutation.target.className == "activity-edit" &&
            Array.from(mutation.addedNodes).find(
                (node) => node.className == "actions"
            )
        ) {
            const actions = Array.from(mutation.addedNodes).find(
                (node) => node.className == "actions"
            );
            const saveButtons = actions.querySelectorAll("div.button.save");
            saveButtons.forEach((saveButton) => {
                saveButton.addEventListener("click", () => {
                    const textArea =
                        saveButton.parentElement.parentElement.querySelector(
                            "textarea"
                        );
                    textArea.value
                        .match(
                            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
                        )
                        .forEach((match) => {
                            textArea.value = textArea.value.replace(
                                match,
                                `&#${match.codePointAt()};`
                            );
                            console.log(match, `$#${match.codePointAt()};`);
                        });
                });
            });
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
