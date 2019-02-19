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
exports.__esModule = true;
var command_1 = require("../../base/commands/command");
var model_1 = require("./model");
/**
 * Sent from the model source (e.g. a DiagramServer) to the client to update the bounds of some
 * (or all) model elements.
 */
var SetBoundsAction = /** @class */ (function () {
    function SetBoundsAction(bounds) {
        this.bounds = bounds;
        this.kind = SetBoundsCommand.KIND;
    }
    return SetBoundsAction;
}());
exports.SetBoundsAction = SetBoundsAction;
/**
 * Sent from the model source to the client to request bounds for the given model. The model is
 * rendered invisibly so the bounds can derived from the DOM. The response is a ComputedBoundsAction.
 * This hidden rendering round-trip is necessary if the client is responsible for parts of the layout
 * (see `needsClientLayout` viewer option).
 */
var RequestBoundsAction = /** @class */ (function () {
    function RequestBoundsAction(newRoot) {
        this.newRoot = newRoot;
        this.kind = RequestBoundsCommand.KIND;
    }
    return RequestBoundsAction;
}());
exports.RequestBoundsAction = RequestBoundsAction;
/**
 * Sent from the client to the model source (e.g. a DiagramServer) to transmit the result of bounds
 * computation as a response to a RequestBoundsAction. If the server is responsible for parts of
 * the layout (see `needsServerLayout` viewer option), it can do so after applying the computed bounds
 * received with this action. Otherwise there is no need to send the computed bounds to the server,
 * so they can be processed locally by the client.
 */
var ComputedBoundsAction = /** @class */ (function () {
    function ComputedBoundsAction(bounds, revision, alignments) {
        this.bounds = bounds;
        this.revision = revision;
        this.alignments = alignments;
        this.kind = ComputedBoundsAction.KIND;
    }
    ComputedBoundsAction.KIND = 'computedBounds';
    return ComputedBoundsAction;
}());
exports.ComputedBoundsAction = ComputedBoundsAction;
var SetBoundsCommand = /** @class */ (function (_super) {
    __extends(SetBoundsCommand, _super);
    function SetBoundsCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.bounds = [];
        return _this;
    }
    SetBoundsCommand.prototype.execute = function (context) {
        var _this = this;
        this.action.bounds.forEach(function (b) {
            var element = context.root.index.getById(b.elementId);
            if (element && model_1.isBoundsAware(element)) {
                _this.bounds.push({
                    element: element,
                    oldBounds: element.bounds,
                    newBounds: b.newBounds
                });
            }
        });
        return this.redo(context);
    };
    SetBoundsCommand.prototype.undo = function (context) {
        this.bounds.forEach(function (b) { return b.element.bounds = b.oldBounds; });
        return context.root;
    };
    SetBoundsCommand.prototype.redo = function (context) {
        this.bounds.forEach(function (b) { return b.element.bounds = b.newBounds; });
        return context.root;
    };
    SetBoundsCommand.KIND = 'setBounds';
    return SetBoundsCommand;
}(command_1.SystemCommand));
exports.SetBoundsCommand = SetBoundsCommand;
var RequestBoundsCommand = /** @class */ (function (_super) {
    __extends(RequestBoundsCommand, _super);
    function RequestBoundsCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    RequestBoundsCommand.prototype.execute = function (context) {
        return context.modelFactory.createRoot(this.action.newRoot);
    };
    Object.defineProperty(RequestBoundsCommand.prototype, "blockUntil", {
        get: function () {
            return function (action) { return action.kind === ComputedBoundsAction.KIND; };
        },
        enumerable: true,
        configurable: true
    });
    RequestBoundsCommand.KIND = 'requestBounds';
    return RequestBoundsCommand;
}(command_1.HiddenCommand));
exports.RequestBoundsCommand = RequestBoundsCommand;
