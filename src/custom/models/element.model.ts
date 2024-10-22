export interface ElementRootModel<T> {
    details: T;
    _meta: ElementMetaModelAdded | ElementMetaModelModified;
}

export interface ElementAddedModel {
    id: string;
    element: HTMLElement;
    parent: HTMLElement;
    title: string;
    description: string;
    link: string;
    /**
     * @example "3m"
     * @example "2h"
     * @example "1d"
     */
    lastUpdated: string;
    isRead: boolean;
    isBookmarked: boolean;
    feed: ElementFeedModel;
    hasVideo: boolean;
    hasImage: boolean;
}

export interface ElementModifiedModel {
    buttonsOnTop?: ElementModifiedButtonModel[];
    chips?: string[];
    media?: ElementModifiedMediaModel[];
    mediaCarouselOptions?: boolean;
    footerString?: string;
}

export interface ElementModifiedMediaCarouselOptionsModel {
    autoplay: boolean;
    interval: number;
}

export interface ElementModifiedMediaModel {
    type: "image" | "video";
    src: string;
    autoplay?: boolean;
    sound?: boolean;
}

export interface ElementModifiedButtonModel {
    /**
     * It is an icon CSS content code in InoReader font icon.
     */
    icon: string;
    iconOnHover: string;
    iconOnClick: string;
    showWhenArticleIsSelected: boolean;
    showWhenArticleIsHovered: boolean;
    callback: (button: HTMLElement) => void;
}

/**
 * Data that is added to the element model to provide additional context.
 */
export interface ElementMetaModelAdded {
    /**
     * Always the string "tm_inoreader-viewing-api-for-userscripts".
     */
    from: string;
    readOnly: boolean;
    /**
     * Internally marked for feed item to be sent once.
     */
    returnedOnce: boolean;
}

/**
 * Metadata that is returned from userscript to apply changes to the element.
 */
export interface ElementMetaModelModified {
    from: string;
    /**
     * Do not apply the changes to the element. Why do you even need this?
     */
    doNotApply: boolean;
    /**
     * Ask for the changes to be applied only once, next time item will not be sent to consumer userscript.
     */
    applyOnce: boolean;
}

export interface ElementFeedModel {
    name: string;
    href: string;
}
