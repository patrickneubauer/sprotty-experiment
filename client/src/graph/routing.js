"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var geometry_1 = require("../utils/geometry");
var LinearEdgeRouter = /** @class */ (function () {
    function LinearEdgeRouter() {
    }
    LinearEdgeRouter.prototype.route = function (edge, options) {
        if (options === void 0) { options = { minimalPointDistance: 2 }; }
        var source = edge.source;
        var target = edge.target;
        if (source === undefined || target === undefined) {
            return [];
        }
        var sourceAnchor;
        var targetAnchor;
        var rpCount = edge.routingPoints !== undefined ? edge.routingPoints.length : 0;
        if (rpCount >= 1) {
            // Use the first routing point as start anchor reference
            var p0 = edge.routingPoints[0];
            sourceAnchor = source.getTranslatedAnchor(p0, edge.parent, edge, edge.sourceAnchorCorrection);
            // Use the last routing point as end anchor reference
            var pn = edge.routingPoints[rpCount - 1];
            targetAnchor = target.getTranslatedAnchor(pn, edge.parent, edge, edge.targetAnchorCorrection);
        }
        else {
            // Use the target center as start anchor reference
            var startRef = geometry_1.center(target.bounds);
            sourceAnchor = source.getTranslatedAnchor(startRef, target.parent, edge, edge.sourceAnchorCorrection);
            // Use the source center as end anchor reference
            var endRef = geometry_1.center(source.bounds);
            targetAnchor = target.getTranslatedAnchor(endRef, source.parent, edge, edge.targetAnchorCorrection);
        }
        var result = [];
        result.push({ kind: 'source', x: sourceAnchor.x, y: sourceAnchor.y });
        for (var i = 0; i < rpCount; i++) {
            var p = edge.routingPoints[i];
            if (i > 0 && i < rpCount - 1
                || i === 0 && geometry_1.maxDistance(sourceAnchor, p) >= options.minimalPointDistance + (edge.sourceAnchorCorrection || 0)
                || i === rpCount - 1 && geometry_1.maxDistance(p, targetAnchor) >= options.minimalPointDistance + (edge.targetAnchorCorrection || 0)) {
                result.push({ kind: 'linear', x: p.x, y: p.y, pointIndex: i });
            }
        }
        result.push({ kind: 'target', x: targetAnchor.x, y: targetAnchor.y });
        return result;
    };
    LinearEdgeRouter = __decorate([
        inversify_1.injectable()
    ], LinearEdgeRouter);
    return LinearEdgeRouter;
}());
exports.LinearEdgeRouter = LinearEdgeRouter;
