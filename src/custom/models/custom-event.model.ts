import { ElementAddedModel, ElementRootModel } from "./element.model";

export interface CustomEventElementAddedModel extends CustomEvent {
    detail: ElementRootModel<ElementAddedModel>;
}

export function createCustomEventElementAddedModel(
    elementAddedModel: ElementRootModel<ElementAddedModel>
): CustomEventElementAddedModel {
    return new CustomEvent("tm_inoreader-viewing-api-for-userscripts_elementAdded", {
        detail: elementAddedModel,
    });
}
