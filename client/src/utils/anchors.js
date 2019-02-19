"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var geometry_1 = require("./geometry");
function computeCircleAnchor(position, radius, refPoint, offset) {
    if (offset === void 0) { offset = 0; }
    var cx = position.x + radius;
    var cy = position.y + radius;
    var dx = cx - refPoint.x;
    var dy = cy - refPoint.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var normX = (dx / distance) || 0;
    var normY = (dy / distance) || 0;
    return {
        x: cx - normX * (radius + offset),
        y: cy - normY * (radius + offset)
    };
}
exports.computeCircleAnchor = computeCircleAnchor;
function getXIntersection(yIntersection, centerPoint, point) {
    var t = (yIntersection - centerPoint.y) / (point.y - centerPoint.y);
    return (point.x - centerPoint.x) * t + centerPoint.x;
}
function getYIntersection(xIntersection, centerPoint, point) {
    var t = (xIntersection - centerPoint.x) / (point.x - centerPoint.x);
    return (point.y - centerPoint.y) * t + centerPoint.y;
}
var NearestPointFinder = /** @class */ (function () {
    function NearestPointFinder(centerPoint, refPoint) {
        this.centerPoint = centerPoint;
        this.refPoint = refPoint;
        this.currentDist = -1;
    }
    NearestPointFinder.prototype.addCandidate = function (x, y) {
        var dx = this.refPoint.x - x;
        var dy = this.refPoint.y - y;
        var dist = dx * dx + dy * dy;
        if (this.currentDist < 0 || dist < this.currentDist) {
            this.currentBest = {
                x: x,
                y: y
            };
            this.currentDist = dist;
        }
    };
    Object.defineProperty(NearestPointFinder.prototype, "best", {
        get: function () {
            if (this.currentBest === undefined)
                return this.centerPoint;
            else
                return this.currentBest;
        },
        enumerable: true,
        configurable: true
    });
    return NearestPointFinder;
}());
function computeRectangleAnchor(bounds, refPoint, offset) {
    var c = geometry_1.center(bounds);
    var finder = new NearestPointFinder(c, refPoint);
    if (!geometry_1.almostEquals(c.y, refPoint.y)) {
        var xTop = getXIntersection(bounds.y, c, refPoint);
        if (xTop >= bounds.x && xTop <= bounds.x + bounds.width)
            finder.addCandidate(xTop, bounds.y - offset);
        var xBottom = getXIntersection(bounds.y + bounds.height, c, refPoint);
        if (xBottom >= bounds.x && xBottom <= bounds.x + bounds.width)
            finder.addCandidate(xBottom, bounds.y + bounds.height + offset);
    }
    if (!geometry_1.almostEquals(c.x, refPoint.x)) {
        var yLeft = getYIntersection(bounds.x, c, refPoint);
        if (yLeft >= bounds.y && yLeft <= bounds.y + bounds.height)
            finder.addCandidate(bounds.x - offset, yLeft);
        var yRight = getYIntersection(bounds.x + bounds.width, c, refPoint);
        if (yRight >= bounds.y && yRight <= bounds.y + bounds.height)
            finder.addCandidate(bounds.x + bounds.width + offset, yRight);
    }
    return finder.best;
}
exports.computeRectangleAnchor = computeRectangleAnchor;
function computeDiamondAnchor(bounds, refPoint, offset) {
    var referenceLine = new geometry_1.PointToPointLine(geometry_1.center(bounds), refPoint);
    var closestDiamondSide = new geometry_1.Diamond(bounds).closestSideLine(refPoint);
    var anchorPoint = closestDiamondSide.intersection(referenceLine);
    return geometry_1.shiftTowards(anchorPoint, refPoint, offset);
}
exports.computeDiamondAnchor = computeDiamondAnchor;
