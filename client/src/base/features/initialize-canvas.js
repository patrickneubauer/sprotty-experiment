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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../types");
var geometry_1 = require("../../utils/geometry");
var smodel_1 = require("../model/smodel");
var command_1 = require("../commands/command");
/**
 * Grabs the bounds from the root element in page coordinates and fires a
 * InitializeCanvasBoundsAction. This size is needed for other actions such
 * as FitToScreenAction.
 */
var CanvasBoundsInitializer = /** @class */ (function () {
    function CanvasBoundsInitializer(actionDispatcher) {
        this.actionDispatcher = actionDispatcher;
    }
    CanvasBoundsInitializer.prototype.decorate = function (vnode, element) {
        if (element instanceof smodel_1.SModelRoot && !geometry_1.isValidDimension(element.canvasBounds)) {
            this.rootAndVnode = [element, vnode];
        }
        return vnode;
    };
    CanvasBoundsInitializer.prototype.postUpdate = function () {
        if (this.rootAndVnode !== undefined) {
            var domElement = this.rootAndVnode[1].elm;
            var oldBounds = this.rootAndVnode[0].canvasBounds;
            if (domElement !== undefined) {
                var newBounds = this.getBoundsInPage(domElement);
                if (!(geometry_1.almostEquals(newBounds.x, oldBounds.x)
                    && geometry_1.almostEquals(newBounds.y, oldBounds.y)
                    && geometry_1.almostEquals(newBounds.width, oldBounds.width)
                    && geometry_1.almostEquals(newBounds.height, oldBounds.width)))
                    this.actionDispatcher.dispatch(new InitializeCanvasBoundsAction(newBounds));
            }
            this.rootAndVnode = undefined;
        }
    };
    CanvasBoundsInitializer.prototype.getBoundsInPage = function (element) {
        var bounds = element.getBoundingClientRect();
        var scroll = typeof window !== 'undefined' ? { x: window.scrollX, y: window.scrollY } : geometry_1.ORIGIN_POINT;
        return {
            x: bounds.left + scroll.x,
            y: bounds.top + scroll.y,
            width: bounds.width,
            height: bounds.height
        };
    };
    CanvasBoundsInitializer = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher))
    ], CanvasBoundsInitializer);
    return CanvasBoundsInitializer;
}());
exports.CanvasBoundsInitializer = CanvasBoundsInitializer;
var InitializeCanvasBoundsAction = /** @class */ (function () {
    function InitializeCanvasBoundsAction(newCanvasBounds) {
        this.newCanvasBounds = newCanvasBounds;
        this.kind = InitializeCanvasBoundsCommand.KIND;
    }
    return InitializeCanvasBoundsAction;
}());
exports.InitializeCanvasBoundsAction = InitializeCanvasBoundsAction;
var InitializeCanvasBoundsCommand = /** @class */ (function (_super) {
    __extends(InitializeCanvasBoundsCommand, _super);
    function InitializeCanvasBoundsCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    InitializeCanvasBoundsCommand.prototype.execute = function (context) {
        this.newCanvasBounds = this.action.newCanvasBounds;
        context.root.canvasBounds = this.newCanvasBounds;
        return context.root;
    };
    InitializeCanvasBoundsCommand.prototype.undo = function (context) {
        return context.root;
    };
    InitializeCanvasBoundsCommand.prototype.redo = function (context) {
        return context.root;
    };
    InitializeCanvasBoundsCommand.KIND = 'initializeCanvasBounds';
    return InitializeCanvasBoundsCommand;
}(command_1.SystemCommand));
exports.InitializeCanvasBoundsCommand = InitializeCanvasBoundsCommand;
