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
var mouse_tool_1 = require("../../base/views/mouse-tool");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var viewport_1 = require("./viewport");
var model_1 = require("./model");
function isZoomable(element) {
    return 'zoom' in element;
}
exports.isZoomable = isZoomable;
var ZoomMouseListener = /** @class */ (function (_super) {
    __extends(ZoomMouseListener, _super);
    function ZoomMouseListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomMouseListener.prototype.wheel = function (target, event) {
        var viewport = smodel_utils_1.findParentByFeature(target, model_1.isViewport);
        if (viewport) {
            var newZoom = Math.exp(-event.deltaY * 0.005);
            var factor = 1. / (newZoom * viewport.zoom) - 1. / viewport.zoom;
            var newViewport = {
                scroll: {
                    x: -(factor * event.offsetX - viewport.scroll.x),
                    y: -(factor * event.offsetY - viewport.scroll.y)
                },
                zoom: viewport.zoom * newZoom
            };
            return [new viewport_1.ViewportAction(viewport.id, newViewport, false)];
        }
        return [];
    };
    return ZoomMouseListener;
}(mouse_tool_1.MouseListener));
exports.ZoomMouseListener = ZoomMouseListener;
