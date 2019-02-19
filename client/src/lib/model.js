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
var smodel_1 = require("../base/model/smodel");
var geometry_1 = require("../utils/geometry");
var anchors_1 = require("../utils/anchors");
var model_1 = require("../features/bounds/model");
var model_2 = require("../features/move/model");
var model_3 = require("../features/select/model");
var sgraph_1 = require("../graph/sgraph");
/**
 * A node that is represented by a circle.
 */
var CircularNode = /** @class */ (function (_super) {
    __extends(CircularNode, _super);
    function CircularNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    Object.defineProperty(CircularNode.prototype, "radius", {
        get: function () {
            var d = Math.min(this.size.width, this.size.height);
            return d > 0 ? d / 2 : 0;
        },
        enumerable: true,
        configurable: true
    });
    CircularNode.prototype.getAnchor = function (refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var strokeCorrection = 0.5 * this.strokeWidth;
        return anchors_1.computeCircleAnchor(this.position, this.radius, refPoint, offset + strokeCorrection);
    };
    return CircularNode;
}(sgraph_1.SNode));
exports.CircularNode = CircularNode;
/**
 * A node that is represented by a rectangle.
 */
var RectangularNode = /** @class */ (function (_super) {
    __extends(RectangularNode, _super);
    function RectangularNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    RectangularNode.prototype.getAnchor = function (refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var strokeCorrection = 0.5 * this.strokeWidth;
        return anchors_1.computeRectangleAnchor(this.bounds, refPoint, offset + strokeCorrection);
    };
    return RectangularNode;
}(sgraph_1.SNode));
exports.RectangularNode = RectangularNode;
/**
 * A node that is represented by a diamond.
 */
var DiamondNode = /** @class */ (function (_super) {
    __extends(DiamondNode, _super);
    function DiamondNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    DiamondNode.prototype.getAnchor = function (refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var strokeCorrection = 0.5 * this.strokeWidth;
        return anchors_1.computeDiamondAnchor(this.bounds, refPoint, offset + strokeCorrection);
    };
    return DiamondNode;
}(sgraph_1.SNode));
exports.DiamondNode = DiamondNode;
/**
 * A port that is represented by a circle.
 */
var CircularPort = /** @class */ (function (_super) {
    __extends(CircularPort, _super);
    function CircularPort() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    Object.defineProperty(CircularPort.prototype, "radius", {
        get: function () {
            var d = Math.min(this.size.width, this.size.height);
            return d > 0 ? d / 2 : 0;
        },
        enumerable: true,
        configurable: true
    });
    CircularPort.prototype.getAnchor = function (refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var strokeCorrection = 0.5 * this.strokeWidth;
        return anchors_1.computeCircleAnchor(this.position, this.radius, refPoint, offset + strokeCorrection);
    };
    return CircularPort;
}(sgraph_1.SPort));
exports.CircularPort = CircularPort;
/**
 * A port that is represented by a rectangle.
 */
var RectangularPort = /** @class */ (function (_super) {
    __extends(RectangularPort, _super);
    function RectangularPort() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    RectangularPort.prototype.getAnchor = function (refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var strokeCorrection = 0.5 * this.strokeWidth;
        return anchors_1.computeRectangleAnchor(this.bounds, refPoint, offset + strokeCorrection);
    };
    return RectangularPort;
}(sgraph_1.SPort));
exports.RectangularPort = RectangularPort;
/**
 * Root model element class for HTML content. Usually this is rendered with a `div` DOM element.
 */
var HtmlRoot = /** @class */ (function (_super) {
    __extends(HtmlRoot, _super);
    function HtmlRoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.classes = [];
        return _this;
    }
    return HtmlRoot;
}(smodel_1.SModelRoot));
exports.HtmlRoot = HtmlRoot;
/**
 * Pre-rendered elements contain HTML or SVG code to be transferred to the DOM. This can be useful to
 * render complex figures or to compute the view on the server instead of the client code.
 */
var PreRenderedElement = /** @class */ (function (_super) {
    __extends(PreRenderedElement, _super);
    function PreRenderedElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreRenderedElement;
}(smodel_1.SChildElement));
exports.PreRenderedElement = PreRenderedElement;
/**
 * Same as PreRenderedElement, but with a position and a size.
 */
var ShapedPreRenderedElement = /** @class */ (function (_super) {
    __extends(ShapedPreRenderedElement, _super);
    function ShapedPreRenderedElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position = geometry_1.ORIGIN_POINT;
        _this.size = geometry_1.EMPTY_DIMENSION;
        _this.selected = false;
        _this.alignment = geometry_1.ORIGIN_POINT;
        return _this;
    }
    Object.defineProperty(ShapedPreRenderedElement.prototype, "bounds", {
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
    ShapedPreRenderedElement.prototype.hasFeature = function (feature) {
        return feature === model_2.moveFeature || feature === model_1.boundsFeature || feature === model_3.selectFeature || feature === model_1.alignFeature;
    };
    return ShapedPreRenderedElement;
}(PreRenderedElement));
exports.ShapedPreRenderedElement = ShapedPreRenderedElement;
