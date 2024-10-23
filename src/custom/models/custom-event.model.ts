import { Logger } from "../../utils/logger";
import { ElementAddedModel, ElementRootModel } from "./element.model";
import { CustomEventSuffix } from "./events.model";

export interface CustomEventElementAddedModel extends CustomEvent {
    detail: ElementRootModel<ElementAddedModel>;
}

export function createCustomEvent(
    elementAddedModel: ElementRootModel<ElementAddedModel>,
    eventSuffix: CustomEventSuffix = CustomEventSuffix.articleAdded,
): CustomEventElementAddedModel {
    const eventName = `tm_inoreader-viewing-api-for-userscripts_${eventSuffix}`;

    Logger.log(`Creating custom event: ${eventName} for element with id ${elementAddedModel.details.id}`, "info");

    return new CustomEvent(eventName, {
        detail: elementAddedModel,
    });
}
