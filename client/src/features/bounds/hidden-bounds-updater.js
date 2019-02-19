"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
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
var types_1 = require("../../base/types");
var geometry_1 = require("../../utils/geometry");
var smodel_1 = require("../../base/model/smodel");
var bounds_manipulation_1 = require("./bounds-manipulation");
var model_1 = require("./model");
var model_2 = require("../export/model");
var BoundsData = /** @class */ (function () {
    function BoundsData() {
    }
    return BoundsData;
}());
exports.BoundsData = BoundsData;
/**
 * Grabs the bounds from hidden SVG DOM elements, applies layouts and fires
 * ComputedBoundsActions.
 *
 * The actual bounds of an element can usually not be determined from the SModel
 * as they depend on the view implementation and CSS stylings. So the best way is
 * to grab them from a live (but hidden) SVG using getBBox().
 *
 * If an element is Alignable, and the top-left corner of its bounding box is not
 * the origin, we also issue a realign with the ComputedBoundsAction.
 */
var HiddenBoundsUpdater = /** @class */ (function () {
    function HiddenBoundsUpdater(actionDispatcher, layouter) {
        this.actionDispatcher = actionDispatcher;
        this.layouter = layouter;
        this.element2boundsData = new Map;
    }
    HiddenBoundsUpdater.prototype.decorate = function (vnode, element) {
        if (model_1.isSizeable(element) || model_1.isLayoutContainer(element)) {
            this.element2boundsData.set(element, {
                vnode: vnode,
                bounds: element.bounds,
                boundsChanged: false,
                alignmentChanged: false
            });
        }
        if (element instanceof smodel_1.SModelRoot)
            this.root = element;
        return vnode;
    };
    HiddenBoundsUpdater.prototype.postUpdate = function () {
        if (this.root !== undefined && model_2.isExportable(this.root) && this.root["export"])
            return;
        this.getBoundsFromDOM();
        this.layouter.layout(this.element2boundsData);
        var resizes = [];
        var realignments = [];
        this.element2boundsData.forEach(function (boundsData, element) {
            if (boundsData.boundsChanged && boundsData.bounds !== undefined)
                resizes.push({
                    elementId: element.id,
                    newBounds: boundsData.bounds
                });
            if (boundsData.alignmentChanged && boundsData.alignment !== undefined)
                realignments.push({
                    elementId: element.id,
                    newAlignment: boundsData.alignment
                });
        });
        var revision = (this.root !== undefined) ? this.root.revision : undefined;
        this.actionDispatcher.dispatch(new bounds_manipulation_1.ComputedBoundsAction(resizes, revision, realignments));
        this.element2boundsData.clear();
    };
    HiddenBoundsUpdater.prototype.getBoundsFromDOM = function () {
        var _this = this;
        this.element2boundsData.forEach(function (boundsData, element) {
            if (boundsData.bounds && model_1.isSizeable(element)) {
                var vnode = boundsData.vnode;
                if (vnode && vnode.elm) {
                    var boundingBox = _this.getBounds(vnode.elm, element);
                    if (model_1.isAlignable(element) && !(geometry_1.almostEquals(boundingBox.x, 0) && geometry_1.almostEquals(boundingBox.y, 0))) {
                        boundsData.alignment = {
                            x: -boundingBox.x,
                            y: -boundingBox.y
                        };
                        boundsData.alignmentChanged = true;
                    }
                    var newBounds = {
                        x: element.bounds.x,
                        y: element.bounds.y,
                        width: boundingBox.width,
                        height: boundingBox.height
                    };
                    if (!(geometry_1.almostEquals(newBounds.x, element.bounds.x)
                        && geometry_1.almostEquals(newBounds.y, element.bounds.y)
                        && geometry_1.almostEquals(newBounds.width, element.bounds.width)
                        && geometry_1.almostEquals(newBounds.height, element.bounds.height))) {
                        boundsData.bounds = newBounds;
                        boundsData.boundsChanged = true;
                    }
                }
            }
        });
    };
    HiddenBoundsUpdater.prototype.getBounds = function (elm, element) {
        var bounds = elm.getBBox();
        return {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    };
    HiddenBoundsUpdater = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.Layouter))
    ], HiddenBoundsUpdater);
    return HiddenBoundsUpdater;
}());
exports.HiddenBoundsUpdater = HiddenBoundsUpdater;
