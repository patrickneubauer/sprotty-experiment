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
var smodel_1 = require("../../base/model/smodel");
var smodel_utils_1 = require("../../base/model/smodel-utils");
exports.boundsFeature = Symbol('boundsFeature');
exports.layoutContainerFeature = Symbol('layoutContainerFeature');
exports.layoutableChildFeature = Symbol('layoutableChildFeature');
exports.alignFeature = Symbol('alignFeature');
function isBoundsAware(element) {
    return 'bounds' in element;
}
exports.isBoundsAware = isBoundsAware;
function isLayoutContainer(element) {
    return isBoundsAware(element)
        && element.hasFeature(exports.layoutContainerFeature)
        && 'layout' in element;
}
exports.isLayoutContainer = isLayoutContainer;
function isLayoutableChild(element) {
    return isBoundsAware(element)
        && element.hasFeature(exports.layoutableChildFeature);
}
exports.isLayoutableChild = isLayoutableChild;
function isSizeable(element) {
    return element.hasFeature(exports.boundsFeature) && isBoundsAware(element);
}
exports.isSizeable = isSizeable;
function isAlignable(element) {
    return element.hasFeature(exports.alignFeature)
        && 'alignment' in element;
}
exports.isAlignable = isAlignable;
function getAbsoluteBounds(element) {
    var boundsAware = smodel_utils_1.findParentByFeature(element, isBoundsAware);
    if (boundsAware !== undefined) {
        var bounds = boundsAware.bounds;
        var current = boundsAware;
        while (current instanceof smodel_1.SChildElement) {
            var parent_1 = current.parent;
            bounds = parent_1.localToParent(bounds);
            current = parent_1;
        }
        return bounds;
    }
    else if (element instanceof smodel_1.SModelRoot) {
        var canvasBounds = element.canvasBounds;
        return { x: 0, y: 0, width: canvasBounds.width, height: canvasBounds.height };
    }
    else {
        return geometry_1.EMPTY_BOUNDS;
    }
}
exports.getAbsoluteBounds = getAbsoluteBounds;
/**
 * Abstract class for elements with a position and a size.
 */
var SShapeElement = /** @class */ (function (_super) {
    __extends(SShapeElement, _super);
    function SShapeElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position = geometry_1.ORIGIN_POINT;
        _this.size = geometry_1.EMPTY_DIMENSION;
        return _this;
    }
    Object.defineProperty(SShapeElement.prototype, "bounds", {
        get: function () {
            return {
                x: this.position.x,
                y: this.position.y,
                width: this.size.width,
                height: this.size.height
            };
        },
        set: function (newBounds) {
            this.position = {
                x: newBounds.x,
                y: newBounds.y
            };
            this.size = {
                width: newBounds.width,
                height: newBounds.height
            };
        },
        enumerable: true,
        configurable: true
    });
    SShapeElement.prototype.localToParent = function (point) {
        var result = {
            x: point.x + this.position.x,
            y: point.y + this.position.y,
            width: -1,
            height: -1
        };
        if (geometry_1.isBounds(point)) {
            result.width = point.width;
            result.height = point.height;
        }
        return result;
    };
    SShapeElement.prototype.parentToLocal = function (point) {
        var result = {
            x: point.x - this.position.x,
            y: point.y - this.position.y,
            width: -1,
            height: -1
        };
        if (geometry_1.isBounds(point)) {
            result.width = point.width;
            result.height = point.height;
        }
        return result;
    };
    return SShapeElement;
}(smodel_1.SChildElement));
exports.SShapeElement = SShapeElement;
