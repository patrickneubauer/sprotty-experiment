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
var animation_1 = require("../../base/animations/animation");
var ResizeAnimation = /** @class */ (function (_super) {
    __extends(ResizeAnimation, _super);
    function ResizeAnimation(model, elementResizes, context, reverse) {
        if (reverse === void 0) { reverse = false; }
        var _this = _super.call(this, context) || this;
        _this.model = model;
        _this.elementResizes = elementResizes;
        _this.reverse = reverse;
        return _this;
    }
    ResizeAnimation.prototype.tween = function (t) {
        var _this = this;
        this.elementResizes.forEach(function (elementResize) {
            var element = elementResize.element;
            var newDimension = (_this.reverse) ? {
                width: (1 - t) * elementResize.toDimension.width + t * elementResize.fromDimension.width,
                height: (1 - t) * elementResize.toDimension.height + t * elementResize.fromDimension.height
            } : {
                width: (1 - t) * elementResize.fromDimension.width + t * elementResize.toDimension.width,
                height: (1 - t) * elementResize.fromDimension.height + t * elementResize.toDimension.height
            };
            element.bounds = {
                x: element.bounds.x,
                y: element.bounds.y,
                width: newDimension.width,
                height: newDimension.height
            };
        });
        return this.model;
    };
    return ResizeAnimation;
}(animation_1.Animation));
exports.ResizeAnimation = ResizeAnimation;
