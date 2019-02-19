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
var model_1 = require("../select/model");
var model_2 = require("../move/model");
var model_3 = require("../hover/model");
exports.editFeature = Symbol('editFeature');
function isRoutable(element) {
    return element.routingPoints !== undefined && typeof (element.route) === 'function';
}
exports.isRoutable = isRoutable;
function canEditRouting(element) {
    return isRoutable(element) && element.hasFeature(exports.editFeature);
}
exports.canEditRouting = canEditRouting;
var SRoutingHandle = /** @class */ (function (_super) {
    __extends(SRoutingHandle, _super);
    function SRoutingHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Whether the routing point is being dragged. */
        _this.editMode = false;
        _this.hoverFeedback = false;
        _this.selected = false;
        return _this;
    }
    SRoutingHandle.prototype.hasFeature = function (feature) {
        return feature === model_1.selectFeature || feature === model_2.moveFeature || feature === model_3.hoverFeedbackFeature;
    };
    return SRoutingHandle;
}(smodel_1.SChildElement));
exports.SRoutingHandle = SRoutingHandle;
/** The angle in radians below which a routing handle is removed. */
var HANDLE_REMOVE_THRESHOLD = 0.1;
/**
 * Remove routed points that are in edit mode and for which the angle between the preceding and
 * following points falls below a threshold.
 */
function filterEditModeHandles(route, parent) {
    if (parent.children.length === 0)
        return route;
    var i = 0;
    var _loop_1 = function () {
        var curr = route[i];
        if (curr.pointIndex !== undefined) {
            var handle = parent.children.find(function (child) {
                return child instanceof SRoutingHandle && child.kind === 'junction' && child.pointIndex === curr.pointIndex;
            });
            if (handle !== undefined && handle.editMode && i > 0 && i < route.length - 1) {
                var prev = route[i - 1], next = route[i + 1];
                var prevDiff = { x: prev.x - curr.x, y: prev.y - curr.y };
                var nextDiff = { x: next.x - curr.x, y: next.y - curr.y };
                var angle = geometry_1.angleBetweenPoints(prevDiff, nextDiff);
                if (Math.abs(Math.PI - angle) < HANDLE_REMOVE_THRESHOLD) {
                    route.splice(i, 1);
                    return "continue";
                }
            }
        }
        i++;
    };
    while (i < route.length) {
        _loop_1();
    }
    return route;
}
exports.filterEditModeHandles = filterEditModeHandles;
