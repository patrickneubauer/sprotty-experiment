"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
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
var model_1 = require("./model");
var command_1 = require("../../base/commands/command");
var smodel_1 = require("../../base/model/smodel");
var animation_1 = require("../../base/animations/animation");
function createRoutingHandle(kind, parentId, index) {
    var handle = new model_1.SRoutingHandle();
    handle.type = kind === 'junction' ? 'routing-point' : 'volatile-routing-point';
    handle.kind = kind;
    handle.pointIndex = index;
    return handle;
}
exports.createRoutingHandle = createRoutingHandle;
function createRoutingHandles(editTarget) {
    var rpCount = editTarget.routingPoints.length;
    var targetId = editTarget.id;
    editTarget.add(createRoutingHandle('line', targetId, -1));
    for (var i = 0; i < rpCount; i++) {
        editTarget.add(createRoutingHandle('junction', targetId, i));
        editTarget.add(createRoutingHandle('line', targetId, i));
    }
}
exports.createRoutingHandles = createRoutingHandles;
var SwitchEditModeAction = /** @class */ (function () {
    function SwitchEditModeAction(elementsToActivate, elementsToDeactivate) {
        if (elementsToActivate === void 0) { elementsToActivate = []; }
        if (elementsToDeactivate === void 0) { elementsToDeactivate = []; }
        this.elementsToActivate = elementsToActivate;
        this.elementsToDeactivate = elementsToDeactivate;
        this.kind = SwitchEditModeCommand.KIND;
    }
    return SwitchEditModeAction;
}());
exports.SwitchEditModeAction = SwitchEditModeAction;
var SwitchEditModeCommand = /** @class */ (function (_super) {
    __extends(SwitchEditModeCommand, _super);
    function SwitchEditModeCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.elementsToActivate = [];
        _this.elementsToDeactivate = [];
        _this.handlesToRemove = [];
        return _this;
    }
    SwitchEditModeCommand.prototype.execute = function (context) {
        var _this = this;
        var index = context.root.index;
        this.action.elementsToActivate.forEach(function (id) {
            var element = index.getById(id);
            if (element !== undefined)
                _this.elementsToActivate.push(element);
        });
        this.action.elementsToDeactivate.forEach(function (id) {
            var element = index.getById(id);
            if (element !== undefined)
                _this.elementsToDeactivate.push(element);
            if (element instanceof model_1.SRoutingHandle && model_1.isRoutable(element.parent)) {
                var parent_1 = element.parent;
                if (_this.shouldRemoveHandle(element, parent_1)) {
                    _this.handlesToRemove.push({ handle: element, parent: parent_1 });
                    _this.elementsToDeactivate.push(parent_1);
                    _this.elementsToActivate.push(parent_1);
                }
            }
        });
        return this.doExecute(context);
    };
    SwitchEditModeCommand.prototype.doExecute = function (context) {
        this.handlesToRemove.forEach(function (entry) {
            entry.point = entry.parent.routingPoints.splice(entry.handle.pointIndex, 1)[0];
        });
        this.elementsToDeactivate.forEach(function (element) {
            if (model_1.isRoutable(element) && element instanceof smodel_1.SParentElement)
                element.removeAll(function (child) { return child instanceof model_1.SRoutingHandle; });
            else if (element instanceof model_1.SRoutingHandle)
                element.editMode = false;
        });
        this.elementsToActivate.forEach(function (element) {
            if (model_1.canEditRouting(element) && element instanceof smodel_1.SParentElement)
                createRoutingHandles(element);
            else if (element instanceof model_1.SRoutingHandle)
                element.editMode = true;
        });
        return context.root;
    };
    SwitchEditModeCommand.prototype.shouldRemoveHandle = function (handle, parent) {
        if (handle.kind === 'junction') {
            var route = parent.route();
            return route.find(function (rp) { return rp.pointIndex === handle.pointIndex; }) === undefined;
        }
        return false;
    };
    SwitchEditModeCommand.prototype.undo = function (context) {
        this.handlesToRemove.forEach(function (entry) {
            if (entry.point !== undefined)
                entry.parent.routingPoints.splice(entry.handle.pointIndex, 0, entry.point);
        });
        this.elementsToActivate.forEach(function (element) {
            if (model_1.isRoutable(element) && element instanceof smodel_1.SParentElement)
                element.removeAll(function (child) { return child instanceof model_1.SRoutingHandle; });
            else if (element instanceof model_1.SRoutingHandle)
                element.editMode = false;
        });
        this.elementsToDeactivate.forEach(function (element) {
            if (model_1.canEditRouting(element) && element instanceof smodel_1.SParentElement)
                createRoutingHandles(element);
            else if (element instanceof model_1.SRoutingHandle)
                element.editMode = true;
        });
        return context.root;
    };
    SwitchEditModeCommand.prototype.redo = function (context) {
        return this.doExecute(context);
    };
    SwitchEditModeCommand.KIND = "switchEditMode";
    SwitchEditModeCommand = __decorate([
        inversify_1.injectable()
    ], SwitchEditModeCommand);
    return SwitchEditModeCommand;
}(command_1.Command));
exports.SwitchEditModeCommand = SwitchEditModeCommand;
var MoveRoutingHandleAction = /** @class */ (function () {
    function MoveRoutingHandleAction(moves, animate) {
        if (animate === void 0) { animate = true; }
        this.moves = moves;
        this.animate = animate;
        this.kind = MoveRoutingHandleCommand.KIND;
    }
    return MoveRoutingHandleAction;
}());
exports.MoveRoutingHandleAction = MoveRoutingHandleAction;
var MoveRoutingHandleCommand = /** @class */ (function (_super) {
    __extends(MoveRoutingHandleCommand, _super);
    function MoveRoutingHandleCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.resolvedMoves = new Map;
        _this.originalRoutingPoints = new Map;
        return _this;
    }
    MoveRoutingHandleCommand.prototype.execute = function (context) {
        var _this = this;
        var model = context.root;
        this.action.moves.forEach(function (move) {
            var resolvedMove = _this.resolve(move, model.index);
            if (resolvedMove !== undefined) {
                _this.resolvedMoves.set(resolvedMove.elementId, resolvedMove);
                var parent_2 = resolvedMove.parent;
                if (model_1.isRoutable(parent_2))
                    _this.originalRoutingPoints.set(parent_2.id, parent_2.routingPoints.slice());
            }
        });
        if (this.action.animate) {
            return new MoveHandlesAnimation(model, this.resolvedMoves, this.originalRoutingPoints, context).start();
        }
        else {
            return this.doMove(context);
        }
    };
    MoveRoutingHandleCommand.prototype.resolve = function (move, index) {
        var element = index.getById(move.elementId);
        if (element instanceof model_1.SRoutingHandle) {
            return {
                elementId: move.elementId,
                element: element,
                parent: element.parent,
                fromPosition: move.fromPosition,
                toPosition: move.toPosition
            };
        }
        return undefined;
    };
    MoveRoutingHandleCommand.prototype.doMove = function (context) {
        this.resolvedMoves.forEach(function (res) {
            var handle = res.element;
            var parent = res.parent;
            if (model_1.isRoutable(parent)) {
                var points = parent.routingPoints;
                var index_1 = handle.pointIndex;
                if (handle.kind === 'line') {
                    // Upgrade to a proper routing point
                    handle.kind = 'junction';
                    handle.type = 'routing-point';
                    points.splice(index_1 + 1, 0, res.fromPosition || points[Math.max(index_1, 0)]);
                    parent.children.forEach(function (child) {
                        if (child instanceof model_1.SRoutingHandle && (child === handle || child.pointIndex > index_1))
                            child.pointIndex++;
                    });
                    parent.add(createRoutingHandle('line', parent.id, index_1));
                    parent.add(createRoutingHandle('line', parent.id, index_1 + 1));
                    index_1++;
                }
                if (index_1 >= 0 && index_1 < points.length) {
                    points[index_1] = res.toPosition;
                }
            }
        });
        return context.root;
    };
    MoveRoutingHandleCommand.prototype.undo = function (context) {
        var _this = this;
        if (this.action.animate) {
            return new MoveHandlesAnimation(context.root, this.resolvedMoves, this.originalRoutingPoints, context, true).start();
        }
        else {
            this.resolvedMoves.forEach(function (res) {
                var parent = res.parent;
                var points = _this.originalRoutingPoints.get(parent.id);
                if (points !== undefined && model_1.isRoutable(parent)) {
                    parent.routingPoints = points;
                    parent.removeAll(function (e) { return e instanceof model_1.SRoutingHandle; });
                    createRoutingHandles(parent);
                }
            });
            return context.root;
        }
    };
    MoveRoutingHandleCommand.prototype.redo = function (context) {
        if (this.action.animate) {
            return new MoveHandlesAnimation(context.root, this.resolvedMoves, this.originalRoutingPoints, context, false).start();
        }
        else {
            return this.doMove(context);
        }
    };
    MoveRoutingHandleCommand.KIND = 'moveHandle';
    MoveRoutingHandleCommand = __decorate([
        inversify_1.injectable()
    ], MoveRoutingHandleCommand);
    return MoveRoutingHandleCommand;
}(command_1.Command));
exports.MoveRoutingHandleCommand = MoveRoutingHandleCommand;
var MoveHandlesAnimation = /** @class */ (function (_super) {
    __extends(MoveHandlesAnimation, _super);
    function MoveHandlesAnimation(model, handleMoves, originalRoutingPoints, context, reverse) {
        if (reverse === void 0) { reverse = false; }
        var _this = _super.call(this, context) || this;
        _this.model = model;
        _this.handleMoves = handleMoves;
        _this.originalRoutingPoints = originalRoutingPoints;
        _this.reverse = reverse;
        return _this;
    }
    MoveHandlesAnimation.prototype.tween = function (t) {
        var _this = this;
        this.handleMoves.forEach(function (handleMove) {
            var parent = handleMove.parent;
            if (model_1.isRoutable(parent) && handleMove.fromPosition !== undefined) {
                if (_this.reverse && t === 1) {
                    var revPoints = _this.originalRoutingPoints.get(parent.id);
                    if (revPoints !== undefined) {
                        parent.routingPoints = revPoints;
                        parent.removeAll(function (e) { return e instanceof model_1.SRoutingHandle; });
                        createRoutingHandles(parent);
                        return;
                    }
                }
                var points = parent.routingPoints;
                var index = handleMove.element.pointIndex;
                if (index >= 0 && index < points.length) {
                    if (_this.reverse) {
                        points[index] = {
                            x: (1 - t) * handleMove.toPosition.x + t * handleMove.fromPosition.x,
                            y: (1 - t) * handleMove.toPosition.y + t * handleMove.fromPosition.y
                        };
                    }
                    else {
                        points[index] = {
                            x: (1 - t) * handleMove.fromPosition.x + t * handleMove.toPosition.x,
                            y: (1 - t) * handleMove.fromPosition.y + t * handleMove.toPosition.y
                        };
                    }
                }
            }
        });
        return this.model;
    };
    return MoveHandlesAnimation;
}(animation_1.Animation));
exports.MoveHandlesAnimation = MoveHandlesAnimation;
