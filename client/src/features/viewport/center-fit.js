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
var geometry_1 = require("../../utils/geometry");
var keyboard_1 = require("../../utils/keyboard");
var smodel_1 = require("../../base/model/smodel");
var command_1 = require("../../base/commands/command");
var key_tool_1 = require("../../base/views/key-tool");
var model_1 = require("../bounds/model");
var model_2 = require("../select/model");
var viewport_1 = require("./viewport");
var model_3 = require("./model");
/**
 * Triggered when the user requests the viewer to center on the current model. The resulting
 * CenterCommand changes the scroll setting of the viewport accordingly and resets the zoom to its default.
 * This action can also be sent from the model source to the client in order to perform such a
 * viewport change programmatically.
 */
var CenterAction = /** @class */ (function () {
    function CenterAction(elementIds, animate) {
        if (animate === void 0) { animate = true; }
        this.elementIds = elementIds;
        this.animate = animate;
        this.kind = CenterCommand.KIND;
    }
    return CenterAction;
}());
exports.CenterAction = CenterAction;
/**
 * Triggered when the user requests the viewer to fit its content to the available drawing area.
 * The resulting FitToScreenCommand changes the zoom and scroll settings of the viewport so the model
 * can be shown completely. This action can also be sent from the model source to the client in order
 * to perform such a viewport change programmatically.
 */
var FitToScreenAction = /** @class */ (function () {
    function FitToScreenAction(elementIds, padding, maxZoom, animate) {
        if (animate === void 0) { animate = true; }
        this.elementIds = elementIds;
        this.padding = padding;
        this.maxZoom = maxZoom;
        this.animate = animate;
        this.kind = FitToScreenCommand.KIND;
    }
    return FitToScreenAction;
}());
exports.FitToScreenAction = FitToScreenAction;
var BoundsAwareViewportCommand = /** @class */ (function (_super) {
    __extends(BoundsAwareViewportCommand, _super);
    function BoundsAwareViewportCommand(animate) {
        var _this = _super.call(this) || this;
        _this.animate = animate;
        return _this;
    }
    BoundsAwareViewportCommand.prototype.initialize = function (model) {
        var _this = this;
        if (model_3.isViewport(model)) {
            this.oldViewport = {
                scroll: model.scroll,
                zoom: model.zoom
            };
            var allBounds_1 = [];
            this.getElementIds().forEach(function (id) {
                var element = model.index.getById(id);
                if (element && model_1.isBoundsAware(element))
                    allBounds_1.push(_this.boundsInViewport(element, element.bounds, model));
            });
            if (allBounds_1.length === 0) {
                model.index.all().forEach(function (element) {
                    if (model_2.isSelectable(element) && element.selected && model_1.isBoundsAware(element))
                        allBounds_1.push(_this.boundsInViewport(element, element.bounds, model));
                });
            }
            if (allBounds_1.length === 0) {
                model.index.all().forEach(function (element) {
                    if (model_1.isBoundsAware(element))
                        allBounds_1.push(_this.boundsInViewport(element, element.bounds, model));
                });
            }
            if (allBounds_1.length !== 0) {
                var bounds = allBounds_1.reduce(function (b0, b1) { return geometry_1.combine(b0, b1); });
                if (geometry_1.isValidDimension(bounds))
                    this.newViewport = this.getNewViewport(bounds, model);
            }
        }
    };
    BoundsAwareViewportCommand.prototype.boundsInViewport = function (element, bounds, viewport) {
        if (element instanceof smodel_1.SChildElement && element.parent !== viewport)
            return this.boundsInViewport(element.parent, element.parent.localToParent(bounds), viewport);
        else
            return bounds;
    };
    BoundsAwareViewportCommand.prototype.execute = function (context) {
        this.initialize(context.root);
        return this.redo(context);
    };
    BoundsAwareViewportCommand.prototype.undo = function (context) {
        var model = context.root;
        if (model_3.isViewport(model) && this.newViewport !== undefined && !this.equal(this.newViewport, this.oldViewport)) {
            if (this.animate)
                return new viewport_1.ViewportAnimation(model, this.newViewport, this.oldViewport, context).start();
            else {
                model.scroll = this.oldViewport.scroll;
                model.zoom = this.oldViewport.zoom;
            }
        }
        return model;
    };
    BoundsAwareViewportCommand.prototype.redo = function (context) {
        var model = context.root;
        if (model_3.isViewport(model) && this.newViewport !== undefined && !this.equal(this.newViewport, this.oldViewport)) {
            if (this.animate) {
                return new viewport_1.ViewportAnimation(model, this.oldViewport, this.newViewport, context).start();
            }
            else {
                model.scroll = this.newViewport.scroll;
                model.zoom = this.newViewport.zoom;
            }
        }
        return model;
    };
    BoundsAwareViewportCommand.prototype.equal = function (vp1, vp2) {
        return vp1.zoom === vp2.zoom && vp1.scroll.x === vp2.scroll.x && vp1.scroll.y === vp2.scroll.y;
    };
    return BoundsAwareViewportCommand;
}(command_1.Command));
exports.BoundsAwareViewportCommand = BoundsAwareViewportCommand;
var CenterCommand = /** @class */ (function (_super) {
    __extends(CenterCommand, _super);
    function CenterCommand(action) {
        var _this = _super.call(this, action.animate) || this;
        _this.action = action;
        return _this;
    }
    CenterCommand.prototype.getElementIds = function () {
        return this.action.elementIds;
    };
    CenterCommand.prototype.getNewViewport = function (bounds, model) {
        if (!geometry_1.isValidDimension(model.canvasBounds)) {
            return undefined;
        }
        var c = geometry_1.center(bounds);
        return {
            scroll: {
                x: c.x - 0.5 * model.canvasBounds.width,
                y: c.y - 0.5 * model.canvasBounds.height
            },
            zoom: 1
        };
    };
    CenterCommand.KIND = 'center';
    return CenterCommand;
}(BoundsAwareViewportCommand));
exports.CenterCommand = CenterCommand;
var FitToScreenCommand = /** @class */ (function (_super) {
    __extends(FitToScreenCommand, _super);
    function FitToScreenCommand(action) {
        var _this = _super.call(this, action.animate) || this;
        _this.action = action;
        return _this;
    }
    FitToScreenCommand.prototype.getElementIds = function () {
        return this.action.elementIds;
    };
    FitToScreenCommand.prototype.getNewViewport = function (bounds, model) {
        if (!geometry_1.isValidDimension(model.canvasBounds)) {
            return undefined;
        }
        var c = geometry_1.center(bounds);
        var delta = this.action.padding === undefined
            ? 0
            : 2 * this.action.padding;
        var zoom = Math.min(model.canvasBounds.width / (bounds.width + delta), model.canvasBounds.height / bounds.height + delta);
        if (this.action.maxZoom !== undefined)
            zoom = Math.min(zoom, this.action.maxZoom);
        return {
            scroll: {
                x: c.x - 0.5 * model.canvasBounds.width / zoom,
                y: c.y - 0.5 * model.canvasBounds.height / zoom
            },
            zoom: zoom
        };
    };
    FitToScreenCommand.KIND = 'fit';
    return FitToScreenCommand;
}(BoundsAwareViewportCommand));
exports.FitToScreenCommand = FitToScreenCommand;
var CenterKeyboardListener = /** @class */ (function (_super) {
    __extends(CenterKeyboardListener, _super);
    function CenterKeyboardListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CenterKeyboardListener.prototype.keyDown = function (element, event) {
        if (keyboard_1.matchesKeystroke(event, 'KeyC', 'ctrlCmd', 'shift'))
            return [new CenterAction([])];
        if (keyboard_1.matchesKeystroke(event, 'KeyF', 'ctrlCmd', 'shift'))
            return [new FitToScreenAction([])];
        return [];
    };
    return CenterKeyboardListener;
}(key_tool_1.KeyListener));
exports.CenterKeyboardListener = CenterKeyboardListener;
