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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var geometry_1 = require("../../utils/geometry");
var animation_1 = require("../../base/animations/animation");
var command_1 = require("../../base/commands/command");
var fade_1 = require("../fade/fade");
var smodel_1 = require("../../base/model/smodel");
var move_1 = require("../move/move");
var model_1 = require("../fade/model");
var model_2 = require("../move/model");
var model_3 = require("../bounds/model");
var viewport_root_1 = require("../viewport/viewport-root");
var model_4 = require("../select/model");
var model_matching_1 = require("./model-matching");
var resize_1 = require("../bounds/resize");
/**
 * Sent from the model source to the client in order to update the model. If no model is present yet,
 * this behaves the same as a SetModelAction. The transition from the old model to the new one can be animated.
 */
var UpdateModelAction = /** @class */ (function () {
    function UpdateModelAction(input, animate) {
        if (animate === void 0) { animate = true; }
        this.animate = animate;
        this.kind = UpdateModelCommand.KIND;
        if (input.id !== undefined)
            this.newRoot = input;
        else
            this.matches = input;
    }
    return UpdateModelAction;
}());
exports.UpdateModelAction = UpdateModelAction;
var UpdateModelCommand = /** @class */ (function (_super) {
    __extends(UpdateModelCommand, _super);
    function UpdateModelCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    UpdateModelCommand.prototype.execute = function (context) {
        var newRoot;
        if (this.action.newRoot !== undefined) {
            newRoot = context.modelFactory.createRoot(this.action.newRoot);
        }
        else {
            newRoot = context.modelFactory.createRoot(context.root);
            if (this.action.matches !== undefined)
                this.applyMatches(newRoot, this.action.matches, context);
        }
        this.oldRoot = context.root;
        this.newRoot = newRoot;
        return this.performUpdate(this.oldRoot, this.newRoot, context);
    };
    UpdateModelCommand.prototype.performUpdate = function (oldRoot, newRoot, context) {
        if ((this.action.animate === undefined || this.action.animate) && oldRoot.id === newRoot.id) {
            var matchResult = void 0;
            if (this.action.matches === undefined) {
                var matcher = new model_matching_1.ModelMatcher();
                matchResult = matcher.match(oldRoot, newRoot);
            }
            else {
                matchResult = this.convertToMatchResult(this.action.matches, oldRoot, newRoot);
            }
            var animationOrRoot = this.computeAnimation(newRoot, matchResult, context);
            if (animationOrRoot instanceof animation_1.Animation)
                return animationOrRoot.start();
            else
                return animationOrRoot;
        }
        else {
            if (oldRoot.type === newRoot.type && geometry_1.isValidDimension(oldRoot.canvasBounds))
                newRoot.canvasBounds = oldRoot.canvasBounds;
            return newRoot;
        }
    };
    UpdateModelCommand.prototype.applyMatches = function (root, matches, context) {
        var index = root.index;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            if (match.left !== undefined) {
                var element = index.getById(match.left.id);
                if (element instanceof smodel_1.SChildElement)
                    element.parent.remove(element);
            }
            if (match.right !== undefined) {
                var element = context.modelFactory.createElement(match.right);
                var parent_1 = void 0;
                if (match.rightParentId !== undefined)
                    parent_1 = index.getById(match.rightParentId);
                if (parent_1 instanceof smodel_1.SParentElement)
                    parent_1.add(element);
                else
                    root.add(element);
            }
        }
    };
    UpdateModelCommand.prototype.convertToMatchResult = function (matches, leftRoot, rightRoot) {
        var result = {};
        for (var _i = 0, matches_2 = matches; _i < matches_2.length; _i++) {
            var match = matches_2[_i];
            var converted = {};
            var id = undefined;
            if (match.left !== undefined) {
                id = match.left.id;
                converted.left = leftRoot.index.getById(id);
                converted.leftParentId = match.leftParentId;
            }
            if (match.right !== undefined) {
                id = match.right.id;
                converted.right = rightRoot.index.getById(id);
                converted.rightParentId = match.rightParentId;
            }
            if (id !== undefined)
                result[id] = converted;
        }
        return result;
    };
    UpdateModelCommand.prototype.computeAnimation = function (newRoot, matchResult, context) {
        var _this = this;
        var animationData = {
            fades: []
        };
        model_matching_1.forEachMatch(matchResult, function (id, match) {
            if (match.left !== undefined && match.right !== undefined) {
                // The element is still there, but may have been moved
                _this.updateElement(match.left, match.right, animationData);
            }
            else if (match.right !== undefined) {
                // An element has been added
                var right = match.right;
                if (model_1.isFadeable(right)) {
                    right.opacity = 0;
                    animationData.fades.push({
                        element: right,
                        type: 'in'
                    });
                }
            }
            else if (match.left instanceof smodel_1.SChildElement) {
                // An element has been removed
                var left = match.left;
                if (model_1.isFadeable(left) && match.leftParentId !== undefined) {
                    if (newRoot.index.getById(left.id) === undefined) {
                        var parent_2 = newRoot.index.getById(match.leftParentId);
                        if (parent_2 instanceof smodel_1.SParentElement) {
                            var leftCopy = context.modelFactory.createElement(left);
                            parent_2.add(leftCopy);
                            animationData.fades.push({
                                element: leftCopy,
                                type: 'out'
                            });
                        }
                    }
                }
            }
        });
        var animations = this.createAnimations(animationData, newRoot, context);
        if (animations.length >= 2) {
            return new animation_1.CompoundAnimation(newRoot, context, animations);
        }
        else if (animations.length === 1) {
            return animations[0];
        }
        else {
            return newRoot;
        }
    };
    UpdateModelCommand.prototype.updateElement = function (left, right, animationData) {
        if (model_2.isLocateable(left) && model_2.isLocateable(right)) {
            var leftPos = left.position;
            var rightPos = right.position;
            if (!geometry_1.almostEquals(leftPos.x, rightPos.x) || !geometry_1.almostEquals(leftPos.y, rightPos.y)) {
                if (animationData.moves === undefined)
                    animationData.moves = [];
                animationData.moves.push({
                    element: right,
                    elementId: right.id,
                    fromPosition: leftPos,
                    toPosition: rightPos
                });
                right.position = leftPos;
            }
        }
        if (model_3.isBoundsAware(left) && model_3.isBoundsAware(right)) {
            if (!geometry_1.isValidDimension(right.bounds)) {
                right.bounds = {
                    x: right.bounds.x,
                    y: right.bounds.y,
                    width: left.bounds.width,
                    height: left.bounds.height
                };
            }
            else if (!geometry_1.almostEquals(left.bounds.width, right.bounds.width)
                || !geometry_1.almostEquals(left.bounds.height, right.bounds.height)) {
                if (animationData.resizes === undefined)
                    animationData.resizes = [];
                animationData.resizes.push({
                    element: right,
                    fromDimension: {
                        width: left.bounds.width,
                        height: left.bounds.height
                    },
                    toDimension: {
                        width: right.bounds.width,
                        height: right.bounds.height
                    }
                });
            }
        }
        if (model_4.isSelectable(left) && model_4.isSelectable(right)) {
            right.selected = left.selected;
        }
        if (left instanceof smodel_1.SModelRoot && right instanceof smodel_1.SModelRoot) {
            right.canvasBounds = left.canvasBounds;
        }
        if (left instanceof viewport_root_1.ViewportRootElement && right instanceof viewport_root_1.ViewportRootElement) {
            right.scroll = left.scroll;
            right.zoom = left.zoom;
        }
    };
    UpdateModelCommand.prototype.createAnimations = function (data, root, context) {
        var animations = [];
        if (data.fades.length > 0) {
            animations.push(new fade_1.FadeAnimation(root, data.fades, context, true));
        }
        if (data.moves !== undefined && data.moves.length > 0) {
            var movesMap = new Map;
            for (var _i = 0, _a = data.moves; _i < _a.length; _i++) {
                var move = _a[_i];
                movesMap.set(move.elementId, move);
            }
            animations.push(new move_1.MoveAnimation(root, movesMap, new Map, context, false));
        }
        if (data.resizes !== undefined && data.resizes.length > 0) {
            var resizesMap = new Map;
            for (var _b = 0, _c = data.resizes; _b < _c.length; _b++) {
                var resize = _c[_b];
                resizesMap.set(resize.element.id, resize);
            }
            animations.push(new resize_1.ResizeAnimation(root, resizesMap, context, false));
        }
        return animations;
    };
    UpdateModelCommand.prototype.undo = function (context) {
        return this.performUpdate(this.newRoot, this.oldRoot, context);
    };
    UpdateModelCommand.prototype.redo = function (context) {
        return this.performUpdate(this.oldRoot, this.newRoot, context);
    };
    UpdateModelCommand.KIND = 'updateModel';
    UpdateModelCommand = __decorate([
        inversify_1.injectable()
    ], UpdateModelCommand);
    return UpdateModelCommand;
}(command_1.Command));
exports.UpdateModelCommand = UpdateModelCommand;
