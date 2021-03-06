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
var smodel_1 = require("../../base/model/smodel");
var mouse_tool_1 = require("../../base/views/mouse-tool");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var viewport_1 = require("./viewport");
var model_1 = require("./model");
var model_2 = require("../move/model");
var model_3 = require("../edit/model");
function isScrollable(element) {
    return 'scroll' in element;
}
exports.isScrollable = isScrollable;
var ScrollMouseListener = /** @class */ (function (_super) {
    __extends(ScrollMouseListener, _super);
    function ScrollMouseListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScrollMouseListener.prototype.mouseDown = function (target, event) {
        var moveable = smodel_utils_1.findParentByFeature(target, model_2.isMoveable);
        if (moveable === undefined && !(target instanceof model_3.SRoutingHandle)) {
            var viewport = smodel_utils_1.findParentByFeature(target, model_1.isViewport);
            if (viewport)
                this.lastScrollPosition = { x: event.pageX, y: event.pageY };
            else
                this.lastScrollPosition = undefined;
        }
        return [];
    };
    ScrollMouseListener.prototype.mouseMove = function (target, event) {
        if (event.buttons === 0)
            this.mouseUp(target, event);
        else if (this.lastScrollPosition) {
            var viewport = smodel_utils_1.findParentByFeature(target, model_1.isViewport);
            if (viewport) {
                var dx = (event.pageX - this.lastScrollPosition.x) / viewport.zoom;
                var dy = (event.pageY - this.lastScrollPosition.y) / viewport.zoom;
                var newViewport = {
                    scroll: {
                        x: viewport.scroll.x - dx,
                        y: viewport.scroll.y - dy
                    },
                    zoom: viewport.zoom
                };
                this.lastScrollPosition = { x: event.pageX, y: event.pageY };
                return [new viewport_1.ViewportAction(viewport.id, newViewport, false)];
            }
        }
        return [];
    };
    ScrollMouseListener.prototype.mouseEnter = function (target, event) {
        if (target instanceof smodel_1.SModelRoot && event.buttons === 0)
            this.mouseUp(target, event);
        return [];
    };
    ScrollMouseListener.prototype.mouseUp = function (target, event) {
        this.lastScrollPosition = undefined;
        return [];
    };
    return ScrollMouseListener;
}(mouse_tool_1.MouseListener));
exports.ScrollMouseListener = ScrollMouseListener;
