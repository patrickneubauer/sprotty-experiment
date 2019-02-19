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
var command_1 = require("../commands/command");
var initialize_canvas_1 = require("./initialize-canvas");
/**
 * Sent from the client to the model source (e.g. a DiagramServer) in order to request a model. Usually this
 * is the first message that is sent to the source, so it is also used to initiate the communication.
 * The response is a SetModelAction or an UpdateModelAction.
 */
var RequestModelAction = /** @class */ (function () {
    function RequestModelAction(options) {
        this.options = options;
        this.kind = RequestModelAction.KIND;
    }
    RequestModelAction.KIND = 'requestModel';
    return RequestModelAction;
}());
exports.RequestModelAction = RequestModelAction;
/**
 * Sent from the model source to the client in order to set the model. If a model is already present, it is replaced.
 */
var SetModelAction = /** @class */ (function () {
    function SetModelAction(newRoot) {
        this.newRoot = newRoot;
        this.kind = SetModelCommand.KIND;
    }
    return SetModelAction;
}());
exports.SetModelAction = SetModelAction;
var SetModelCommand = /** @class */ (function (_super) {
    __extends(SetModelCommand, _super);
    function SetModelCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    SetModelCommand.prototype.execute = function (context) {
        this.oldRoot = context.modelFactory.createRoot(context.root);
        this.newRoot = context.modelFactory.createRoot(this.action.newRoot);
        return this.newRoot;
    };
    SetModelCommand.prototype.undo = function (context) {
        return this.oldRoot;
    };
    SetModelCommand.prototype.redo = function (context) {
        return this.newRoot;
    };
    Object.defineProperty(SetModelCommand.prototype, "blockUntil", {
        get: function () {
            return function (action) { return action.kind === initialize_canvas_1.InitializeCanvasBoundsCommand.KIND; };
        },
        enumerable: true,
        configurable: true
    });
    SetModelCommand.KIND = 'setModel';
    SetModelCommand = __decorate([
        inversify_1.injectable()
    ], SetModelCommand);
    return SetModelCommand;
}(command_1.Command));
exports.SetModelCommand = SetModelCommand;
