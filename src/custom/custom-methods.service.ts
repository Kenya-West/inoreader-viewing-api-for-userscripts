/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { singleton } from "tsyringe";

import { createCustomEventElementAddedModel } from "./models/custom-event.model";
import { ElementAddedModel, ElementRootModel } from "./models/element.model";


@singleton()
export class CustomMethodsService {

    constructor() {
        this.init();
    }
    public init(): void {

        const appState = {
            tmObserverArticleListLinked: false,
        };

        // Select the node that will be observed for mutations
        const targetNode = document.body;

        // Options for the observer (which mutations to observe)
        const mutationObserverGlobalConfig = {
            attributes: false,
            childList: true,
            subtree: true,
        };

        const querySelectorPathArticleRoot =
            ".article_full_contents .article_content";
        const querySelectorArticleContentWrapper = ".article_tile_content_wraper";
        const querySelectorArticleFooter = ".article_tile_footer";

        /**
         * Callback function to execute when mutations are observed
         * @param mutationsList - List of mutations observed
         * @param observer - The MutationObserver instance
         */
        const callback = function(mutationsList: Array<MutationRecord>, observer: MutationObserver): void {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(function(node: Node): void {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // treat node as an HTMLElement
                            const element = node as HTMLElement;
                            if (element.id?.indexOf("article_") !== -1 && element.classList.contains("ar")) {
                                handleNewElement(node as HTMLElement);
                            }
                        }
                    });
                }
            }
        };


        // Create an observer instance linked to the callback function
        const mutationObserverGlobal = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        mutationObserverGlobal.observe(targetNode, mutationObserverGlobalConfig);


        // List of elements to observe (e.g., elements with class 'watch-item')
        const elementList = [];

        // Function to handle new elements
        function handleNewElement(element: HTMLElement): void {
            elementList.push(element);

            // Create a custom event with the element details
            const payload = emitCustomEventElementAddedPayload(element);
            const event = createCustomEventElementAddedModel(payload);

            // Dispatch the custom event
            document.dispatchEvent(event);

            console.log(`Element added with id ${payload.details.id}`, payload);
        }

        // Listen for custom events where consumers return modified elements
        document.addEventListener("tm_inoreader-viewing-api-for-userscripts_elementModified", (e: Event) => {
            const customEvent = e as CustomEvent;
            const modifiedElement: HTMLElement = customEvent.detail.element;
            const { label, info, buttons } = customEvent.detail.properties;

            // Apply changes to the element (e.g., add label, info, buttons)
            modifiedElement.querySelector(".label")!.textContent = label;
            modifiedElement.querySelector(".info")!.textContent = info;

            // Add buttons (or update if already present)
            const buttonContainer = modifiedElement.querySelector(".button-container");
            buttonContainer!.innerHTML = ""; // Clear existing buttons
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            buttons?.forEach((button: any) => {
                const btn: HTMLButtonElement = document.createElement("button");
                btn.textContent = button.text;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                btn.addEventListener("click", button.onClick);
                buttonContainer!.appendChild(btn);
            });
        });

        function emitCustomEventElementAddedPayload(element: HTMLElement): ElementRootModel<ElementAddedModel> {
            return {
                details: {
                    id: element.getAttribute("data-aid")!,
                    element,
                    parent: element.parentElement!,
                    title: element.querySelector(".article_tile_title")!.textContent!,
                    description: element.querySelector(".article_tile_content")!.textContent!,
                    link: element.querySelector(".article_tile_title > a[href]")!.getAttribute("href")!,
                    lastUpdated: element.querySelector(".article_tile_header_date")!.textContent!,
                    isRead: element.querySelector(".article_btns.btns_article_unread") === null,
                    isBookmarked: element.querySelector(".article_btns .icon-save_empty") === null,
                    feed: {
                        name: element.querySelector(".article_tile_footer_feed_title")!.textContent!,
                        href: element.querySelector(".article_tile_footer_feed_title a[href]")!.getAttribute("href")!,
                    },
                    hasVideo: element.querySelector(".article_video_div") !== null,
                    hasImage: element.querySelector(".article_tile_picture") !== null,
                },
                _meta: {
                    from: "tm_inoreader-viewing-api-for-userscripts",
                    readOnly: false,
                    returnedOnce: false,
                },
            };
        }
    }
}
