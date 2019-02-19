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
var animation_1 = require("../../base/animations/animation");
var model_1 = require("./model");
var ViewportAction = /** @class */ (function () {
    function ViewportAction(elementId, newViewport, animate) {
        this.elementId = elementId;
        this.newViewport = newViewport;
        this.animate = animate;
        this.kind = ViewportCommand.KIND;
    }
    return ViewportAction;
}());
exports.ViewportAction = ViewportAction;
var ViewportCommand = /** @class */ (function (_super) {
    __extends(ViewportCommand, _super);
    function ViewportCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.newViewport = action.newViewport;
        return _this;
    }
    ViewportCommand.prototype.execute = function (context) {
        var model = context.root;
        var element = model.index.getById(this.action.elementId);
        if (element && model_1.isViewport(element)) {
            this.element = element;
            this.oldViewport = {
                scroll: this.element.scroll,
                zoom: this.element.zoom
            };
            if (this.action.animate)
                return new ViewportAnimation(this.element, this.oldViewport, this.newViewport, context).start();
            else {
                this.element.scroll = this.newViewport.scroll;
                this.element.zoom = this.newViewport.zoom;
            }
        }
        return model;
    };
    ViewportCommand.prototype.undo = function (context) {
        return new ViewportAnimation(this.element, this.newViewport, this.oldViewport, context).start();
    };
    ViewportCommand.prototype.redo = function (context) {
        return new ViewportAnimation(this.element, this.oldViewport, this.newViewport, context).start();
    };
    ViewportCommand.prototype.merge = function (command, context) {
        if (!this.action.animate && command instanceof ViewportCommand && this.element === command.element) {
            this.newViewport = command.newViewport;
            return true;
        }
        return false;
    };
    ViewportCommand.KIND = 'viewport';
    return ViewportCommand;
}(command_1.MergeableCommand));
exports.ViewportCommand = ViewportCommand;
var ViewportAnimation = /** @class */ (function (_super) {
    __extends(ViewportAnimation, _super);
    function ViewportAnimation(element, oldViewport, newViewport, context) {
        var _this = _super.call(this, context) || this;
        _this.element = element;
        _this.oldViewport = oldViewport;
        _this.newViewport = newViewport;
        _this.context = context;
        _this.zoomFactor = Math.log(newViewport.zoom / oldViewport.zoom);
        return _this;
    }
    ViewportAnimation.prototype.tween = function (t, context) {
        this.element.scroll = {
            x: (1 - t) * this.oldViewport.scroll.x + t * this.newViewport.scroll.x,
            y: (1 - t) * this.oldViewport.scroll.y + t * this.newViewport.scroll.y
        };
        this.element.zoom = this.oldViewport.zoom * Math.exp(t * this.zoomFactor);
        return context.root;
    };
    return ViewportAnimation;
}(animation_1.Animation));
exports.ViewportAnimation = ViewportAnimation;
