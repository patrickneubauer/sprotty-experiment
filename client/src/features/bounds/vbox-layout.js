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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var geometry_1 = require("../../utils/geometry");
var abstract_layout_1 = require("./abstract-layout");
/**
 * Layouts children of a container in vertical (top->bottom) direction.
 */
var VBoxLayouter = /** @class */ (function (_super) {
    __extends(VBoxLayouter, _super);
    function VBoxLayouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VBoxLayouter.prototype.getChildrenSize = function (container, containerOptions, layouter) {
        var maxWidth = -1;
        var maxHeight = 0;
        var isFirst = true;
        container.children.forEach(function (child) {
            var bounds = layouter.getBoundsData(child).bounds;
            if (bounds !== undefined && geometry_1.isValidDimension(bounds)) {
                maxHeight += bounds.height;
                if (isFirst)
                    isFirst = false;
                else
                    maxHeight += containerOptions.vGap;
                maxWidth = Math.max(maxWidth, bounds.width);
            }
        });
        return {
            width: maxWidth,
            height: maxHeight
        };
    };
    VBoxLayouter.prototype.layoutChild = function (child, boundsData, bounds, childOptions, containerOptions, currentOffset, maxWidth, maxHeight) {
        var dx = this.getDx(childOptions.hAlign, bounds, maxWidth);
        boundsData.bounds = {
            x: containerOptions.paddingLeft + child.bounds.x - bounds.x + dx,
            y: currentOffset.y + child.bounds.y - bounds.y,
            width: bounds.width,
            height: bounds.height
        };
        boundsData.boundsChanged = true;
        return {
            x: currentOffset.x,
            y: currentOffset.y + bounds.height + containerOptions.vGap
        };
    };
    VBoxLayouter.prototype.getDefaultLayoutOptions = function () {
        return {
            resizeContainer: true,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            paddingFactor: 1,
            vGap: 1,
            hAlign: 'center'
        };
    };
    VBoxLayouter.prototype.spread = function (a, b) {
        return __assign({}, a, b);
    };
    VBoxLayouter.KIND = 'vbox';
    return VBoxLayouter;
}(abstract_layout_1.AbstractLayout));
exports.VBoxLayouter = VBoxLayouter;
