/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { NotifierController } from "../../controllers/NotifierController";
import { Serializer } from "../../di/Serializer";
import { HttpServerHelper } from "../../helpers/HttpServerHelper";
import { JsonUtil } from "../../utils/JsonUtil";
export declare class NotifySerializer extends Serializer {
    protected notifierController: NotifierController;
    protected jsonUtil: JsonUtil;
    protected httpServerHelper: HttpServerHelper;
    constructor(notifierController: NotifierController, jsonUtil: JsonUtil, httpServerHelper: HttpServerHelper);
    serialize(_sessionID: string, req: IncomingMessage, resp: ServerResponse, _: any): void;
    canHandle(route: string): boolean;
}
