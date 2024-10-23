import { singleton } from "tsyringe";

@singleton()
export class WatcherService {
    public callbackItemAnyCreated: ((element: HTMLElement) => void) | undefined;
    public callbackItemMediaLoadCompleted: ((element: HTMLElement, loadedSuccessfully: boolean) => void) | undefined;

    public watchNewItems(): void {
        // Select the node that will be observed for mutations
        const targetNode = document.body;

        // Options for the observer (which mutations to observe)
        const mutationObserverGlobalConfig = {
            attributes: false,
            childList: true,
            subtree: true,
        };

        /**
         * Callback function to execute when mutations are observed
         * @param mutationsList - List of mutations observed
         * @param observer - The MutationObserver instance
         */
        const callback = (mutationsList: Array<MutationRecord>, observer: MutationObserver): void => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node: Node): void => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // treat node as an HTMLElement
                            const element = node as HTMLElement;
                            if (element.id?.indexOf("article_") !== -1 && element.classList.contains("ar")) {
                                if (this.callbackItemAnyCreated) {
                                    this.callbackItemAnyCreated(element);

                                    if (this.callbackItemMediaLoadCompleted && element?.querySelector(".article_tile_picture") !== null) {
                                        void this.watchMediaCompletelyLoaded(element);
                                    }
                                }
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
    }

    private async watchMediaCompletelyLoaded(element: HTMLElement): Promise<void> {
        const imageElement = this.getImageElement(element);
        if (imageElement) {
            const imageUrl = this.getImageLink(imageElement);
            if (imageUrl) {
                const isSuccessfullyLoaded = await this.isSuccessfullyLoaded(imageUrl);

                if (this.callbackItemMediaLoadCompleted) {
                    this.callbackItemMediaLoadCompleted(element, isSuccessfullyLoaded);
                }
            }
        }
    }

    private getImageElement(element: HTMLElement): HTMLImageElement | null {
        const divImageElement: HTMLImageElement | null = element.querySelector(".article_tile_picture[style*='background-image']");
        return divImageElement ?? null;
    }

    private getImageLink(div: HTMLElement): string | null {
        const backgroundImageUrl = div?.style.backgroundImage;
        return this.commonGetUrlFromBackgroundImage(backgroundImageUrl);
    }

    private commonGetUrlFromBackgroundImage(backgroundImageUrl: string): string | null {
        let imageUrl: string | undefined;
        try {
            imageUrl = backgroundImageUrl?.match(/url\("(.*)"\)/)?.[1];
        } catch (error) {
            imageUrl = backgroundImageUrl?.slice(5, -2);
        }

        if (!imageUrl || imageUrl === undefined) {
            return null;
        }

        if (!imageUrl?.startsWith("http")) {
            console.error(`The image could not be parsed. Image URL: ${imageUrl}`);
            return null;
        }
        return imageUrl;
    }

    private isSuccessfullyLoaded(imageUrl: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = function(): void {
                resolve(true);
            };
            img.onerror = function(): void {
                resolve(false);
            };
        });
    }
}
