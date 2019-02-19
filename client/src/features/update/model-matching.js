"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var smodel_1 = require("../../base/model/smodel");
function forEachMatch(matchResult, callback) {
    for (var id in matchResult) {
        if (matchResult.hasOwnProperty(id))
            callback(id, matchResult[id]);
    }
}
exports.forEachMatch = forEachMatch;
var ModelMatcher = /** @class */ (function () {
    function ModelMatcher() {
    }
    ModelMatcher.prototype.match = function (left, right) {
        var result = {};
        this.matchLeft(left, result);
        this.matchRight(right, result);
        return result;
    };
    ModelMatcher.prototype.matchLeft = function (element, result, parentId) {
        var match = result[element.id];
        if (match !== undefined) {
            match.left = element;
            match.leftParentId = parentId;
        }
        else {
            match = {
                left: element,
                leftParentId: parentId
            };
            result[element.id] = match;
        }
        if (smodel_1.isParent(element)) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.matchLeft(child, result, element.id);
            }
        }
    };
    ModelMatcher.prototype.matchRight = function (element, result, parentId) {
        var match = result[element.id];
        if (match !== undefined) {
            match.right = element;
            match.rightParentId = parentId;
        }
        else {
            match = {
                right: element,
                rightParentId: parentId
            };
            result[element.id] = match;
        }
        if (smodel_1.isParent(element)) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.matchRight(child, result, element.id);
            }
        }
    };
    return ModelMatcher;
}());
exports.ModelMatcher = ModelMatcher;
function applyMatches(root, matches) {
    var index;
    if (root instanceof smodel_1.SModelRoot) {
        index = root.index;
    }
    else {
        index = new smodel_1.SModelIndex();
        index.add(root);
    }
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var newElementInserted = false;
        if (match.left !== undefined && match.leftParentId !== undefined) {
            var parent_1 = index.getById(match.leftParentId);
            if (parent_1 !== undefined && parent_1.children !== undefined) {
                var i = parent_1.children.indexOf(match.left);
                if (i >= 0) {
                    if (match.right !== undefined && match.leftParentId === match.rightParentId) {
                        parent_1.children.splice(i, 1, match.right);
                        newElementInserted = true;
                    }
                    else {
                        parent_1.children.splice(i, 1);
                    }
                }
                index.remove(match.left);
            }
        }
        if (!newElementInserted && match.right !== undefined && match.rightParentId !== undefined) {
            var parent_2 = index.getById(match.rightParentId);
            if (parent_2 !== undefined) {
                if (parent_2.children === undefined)
                    parent_2.children = [];
                parent_2.children.push(match.right);
            }
        }
    }
}
exports.applyMatches = applyMatches;
