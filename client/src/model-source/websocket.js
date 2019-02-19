"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var diagram_server_1 = require("./diagram-server");
/**
 * An external ModelSource that connects to the model provider using a
 * websocket.
 */
var WebSocketDiagramServer = /** @class */ (function (_super) {
    __extends(WebSocketDiagramServer, _super);
    function WebSocketDiagramServer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebSocketDiagramServer.prototype.listen = function (webSocket) {
        var _this = this;
        webSocket.addEventListener('message', function (event) {
            _this.messageReceived(event.data);
        });
        webSocket.addEventListener('error', function (event) {
            _this.logger.error(_this, 'error event received', event);
        });
        this.webSocket = webSocket;
    };
    WebSocketDiagramServer.prototype.disconnect = function () {
        if (this.webSocket) {
            this.webSocket.close();
            this.webSocket = undefined;
        }
    };
    WebSocketDiagramServer.prototype.sendMessage = function (message) {
        if (this.webSocket) {
            this.webSocket.send(JSON.stringify(message));
        }
        else {
            throw new Error('WebSocket is not connected');
        }
    };
    WebSocketDiagramServer = __decorate([
        inversify_1.injectable()
    ], WebSocketDiagramServer);
    return WebSocketDiagramServer;
}(diagram_server_1.DiagramServer));
exports.WebSocketDiagramServer = WebSocketDiagramServer;
