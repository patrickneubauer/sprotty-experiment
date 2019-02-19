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
var model_1 = require("./model");
var model_2 = require("../export/model");
/**
 * Model root element that defines a viewport, so it transforms the coordinate system with
 * a `scroll` translation and a `zoom` scaling.
 */
var ViewportRootElement = /** @class */ (function (_super) {
    __extends(ViewportRootElement, _super);
    function ViewportRootElement(index) {
        var _this = _super.call(this, index) || this;
        _this.scroll = { x: 0, y: 0 };
        _this.zoom = 1;
        _this["export"] = false;
        return _this;
    }
    ViewportRootElement.prototype.hasFeature = function (feature) {
        return feature === model_1.viewportFeature || feature === model_2.exportFeature;
    };
    ViewportRootElement.prototype.localToParent = function (point) {
        var result = {
            x: (point.x - this.scroll.x) * this.zoom,
            y: (point.y - this.scroll.y) * this.zoom,
            width: -1,
            height: -1
        };
        if (geometry_1.isBounds(point)) {
            result.width = point.width * this.zoom;
            result.height = point.height * this.zoom;
        }
        return result;
    };
    ViewportRootElement.prototype.parentToLocal = function (point) {
        var result = {
            x: (point.x / this.zoom) + this.scroll.x,
            y: (point.y / this.zoom) + this.scroll.y,
            width: -1,
            height: -1
        };
        if (geometry_1.isBounds(point) && geometry_1.isValidDimension(point)) {
            result.width = point.width / this.zoom;
            result.height = point.height / this.zoom;
        }
        return result;
    };
    return ViewportRootElement;
}(smodel_1.SModelRoot));
exports.ViewportRootElement = ViewportRootElement;
