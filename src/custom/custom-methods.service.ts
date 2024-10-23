/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { container, singleton } from "tsyringe";

import { createCustomEvent, CustomEventElementAddedModel } from "./models/custom-event.model";
import { ElementAddedModel, ElementRootModel } from "./models/element.model";
import { CustomEventSuffix } from "./models/events.model";
import { WatcherService } from "./services/watcher.service";

@singleton()
export class CustomMethodsService {

    constructor() {
        this.init();
    }
    public init(): void {
        // Function to handle new elements
        const articleCreated = (element: HTMLElement): void => {
            // Create a custom event with the element details
            const payload = createEventPayload(element);
            const events = this.createArticleEventFactory(payload);

            // Dispatch the custom event
            events.forEach((event) => {
                document.dispatchEvent(event);
            });

            // Logger.log(`Article created with id ${payload.details.id}`, "info");
            // Logger.log(payload, "info");
        };

        const articleMediaLoaded = (element: HTMLElement, loadedSuccessfully: boolean): void => {
            const payload = createEventPayload(element);
            const events = this.createArticleMediaEventFactory(payload, loadedSuccessfully);

            events.forEach((event) => {
                document.dispatchEvent(event);
            });

            console.log(`Media loaded for element with id ${payload.details.id}`, payload);
        };

        const watcherService = container.resolve(WatcherService);
        watcherService.callbackItemAnyCreated = articleCreated;
        watcherService.callbackItemMediaLoadCompleted = articleMediaLoaded;
        watcherService.watchNewItems();


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

        function createEventPayload(element: HTMLElement): ElementRootModel<ElementAddedModel> {
            return {
                details: {
                    id: element.getAttribute("data-aid")!,
                    element,
                    parent: element.parentElement!,
                    title: element.querySelector(".article_tile_title")!.textContent!,
                    description: element.querySelector(".article_tile_content")!.textContent!,
                    link: element.querySelector(".article_tile_title > a[href]")!.getAttribute("href")!,
                    lastUpdated: element.querySelector(".article_tile_header_date")!.textContent!,
                    isRead: element.getAttribute("data-read") === "1" ||
                            element.querySelector(".article_btns.btns_article_unread") === null,
                    isBookmarked: element.querySelector(".article_btns .icon-save_empty") === null,
                    feed: {
                        name: element.querySelector(".article_tile_footer_feed_title")!.textContent!,
                        href: element.querySelector(".article_tile_footer_feed_title a[href]")!.getAttribute("href")!,
                    },
                    hasVideo: element.querySelector(".article_video_div") !== null,
                    hasImage: element.querySelector(".article_tile_picture[style*='background-image']") !== null,
                },
                _meta: {
                    from: "tm_inoreader-viewing-api-for-userscripts",
                    readOnly: false,
                    returnedOnce: false,
                },
            };
        }
    }

    private createArticleEventFactory(payload: ElementRootModel<ElementAddedModel>): CustomEventElementAddedModel[] {
        const events: CustomEventElementAddedModel[] = [];

        events.push(createCustomEvent(payload, CustomEventSuffix.articleAdded));
        if (payload.details.isRead) {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleReadAdded));
        } else {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleNewAdded));
        }

        return events;
    }

    private createArticleMediaEventFactory(
        payload: ElementRootModel<ElementAddedModel>,
        loadedSuccessfully: boolean): CustomEventElementAddedModel[] {
        const events: CustomEventElementAddedModel[] = [];

        events.push(createCustomEvent(payload, CustomEventSuffix.articleMediaLoadCompleted));
        if (loadedSuccessfully) {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleMediaLoadSuccess));
        } else {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleMediaLoadFailed));
        }
        if (payload.details.isRead) {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleReadMediaLoadCompleted));
            if (loadedSuccessfully) {
                events.push(createCustomEvent(payload, CustomEventSuffix.articleReadMediaLoadSuccess));
            } else {
                events.push(createCustomEvent(payload, CustomEventSuffix.articleReadMediaLoadFailed));
            }
        } else {
            events.push(createCustomEvent(payload, CustomEventSuffix.articleNewMediaLoadCompleted));
            if (loadedSuccessfully) {
                events.push(createCustomEvent(payload, CustomEventSuffix.articleNewMediaLoadSuccess));
            } else {
                events.push(createCustomEvent(payload, CustomEventSuffix.articleNewMediaLoadFailed));
            }
        }

        return events;
    }
}
