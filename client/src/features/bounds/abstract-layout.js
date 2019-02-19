"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var geometry_1 = require("../../utils/geometry");
var smodel_1 = require("../../base/model/smodel");
var model_1 = require("./model");
var AbstractLayout = /** @class */ (function () {
    function AbstractLayout() {
    }
    AbstractLayout.prototype.layout = function (container, layouter) {
        var boundsData = layouter.getBoundsData(container);
        var options = this.getLayoutOptions(container);
        var childrenSize = this.getChildrenSize(container, options, layouter);
        var maxWidth = options.paddingFactor * (options.resizeContainer
            ? childrenSize.width
            : Math.max(0, this.getFixedContainerBounds(container, options, layouter).width) - options.paddingLeft - options.paddingRight);
        var maxHeight = options.paddingFactor * (options.resizeContainer
            ? childrenSize.height
            : Math.max(0, this.getFixedContainerBounds(container, options, layouter).height) - options.paddingTop - options.paddingBottom);
        if (maxWidth > 0 && maxHeight > 0) {
            var offset = this.layoutChildren(container, layouter, options, maxWidth, maxHeight);
            boundsData.bounds = this.getFinalContainerBounds(container, offset, options, maxWidth, maxHeight);
            boundsData.boundsChanged = true;
        }
    };
    AbstractLayout.prototype.getFinalContainerBounds = function (container, lastOffset, options, maxWidth, maxHeight) {
        return {
            x: container.bounds.x,
            y: container.bounds.y,
            width: maxWidth + options.paddingLeft + options.paddingRight,
            height: maxHeight + options.paddingTop + options.paddingBottom
        };
    };
    AbstractLayout.prototype.getFixedContainerBounds = function (container, layoutOptions, layouter) {
        var currentContainer = container;
        while (true) {
            if (model_1.isBoundsAware(currentContainer)) {
                var bounds = currentContainer.bounds;
                if (model_1.isLayoutContainer(currentContainer) && layoutOptions.resizeContainer)
                    layouter.log.error(currentContainer, 'Resizable container found while detecting fixed bounds');
                if (geometry_1.isValidDimension(bounds))
                    return bounds;
            }
            if (currentContainer instanceof smodel_1.SChildElement) {
                currentContainer = currentContainer.parent;
            }
            else {
                layouter.log.error(currentContainer, 'Cannot detect fixed bounds');
                return geometry_1.EMPTY_BOUNDS;
            }
        }
    };
    AbstractLayout.prototype.layoutChildren = function (container, layouter, containerOptions, maxWidth, maxHeight) {
        var _this = this;
        var currentOffset = {
            x: containerOptions.paddingLeft + 0.5 * (maxWidth - (maxWidth / containerOptions.paddingFactor)),
            y: containerOptions.paddingTop + 0.5 * (maxHeight - (maxHeight / containerOptions.paddingFactor))
        };
        container.children.forEach(function (child) {
            if (model_1.isLayoutableChild(child)) {
                var boundsData = layouter.getBoundsData(child);
                var bounds = boundsData.bounds;
                var childOptions = _this.getChildLayoutOptions(child, containerOptions);
                if (bounds !== undefined && geometry_1.isValidDimension(bounds)) {
                    currentOffset = _this.layoutChild(child, boundsData, bounds, childOptions, containerOptions, currentOffset, maxWidth, maxHeight);
                }
            }
        });
        return currentOffset;
    };
    AbstractLayout.prototype.getDx = function (hAlign, bounds, maxWidth) {
        switch (hAlign) {
            case 'left':
                return 0;
            case 'center':
                return 0.5 * (maxWidth - bounds.width);
            case 'right':
                return maxWidth - bounds.width;
        }
    };
    AbstractLayout.prototype.getDy = function (vAlign, bounds, maxHeight) {
        switch (vAlign) {
            case 'top':
                return 0;
            case 'center':
                return 0.5 * (maxHeight - bounds.height);
            case 'bottom':
                return maxHeight - bounds.height;
        }
    };
    AbstractLayout.prototype.getChildLayoutOptions = function (child, containerOptions) {
        var layoutOptions = child.layoutOptions;
        if (layoutOptions === undefined)
            return containerOptions;
        else
            return this.spread(containerOptions, layoutOptions);
    };
    AbstractLayout.prototype.getLayoutOptions = function (element) {
        var _this = this;
        var current = element;
        var allOptions = [];
        while (current !== undefined) {
            var layoutOptions = current.layoutOptions;
            if (layoutOptions !== undefined)
                allOptions.push(layoutOptions);
            if (current instanceof smodel_1.SChildElement)
                current = current.parent;
            else
                break;
        }
        return allOptions.reverse().reduce(function (a, b) { return _this.spread(a, b); }, this.getDefaultLayoutOptions());
    };
    return AbstractLayout;
}());
exports.AbstractLayout = AbstractLayout;
