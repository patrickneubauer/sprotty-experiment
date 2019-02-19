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
var smodel_1 = require("../../base/model/smodel");
var smodel_2 = require("../../base/model/smodel");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var command_1 = require("../../base/commands/command");
var animation_1 = require("../../base/animations/animation");
var mouse_tool_1 = require("../../base/views/mouse-tool");
var vnode_utils_1 = require("../../base/views/vnode-utils");
var model_1 = require("../viewport/model");
var model_2 = require("../select/model");
var model_3 = require("../bounds/model");
var model_4 = require("../edit/model");
var edit_routing_1 = require("../edit/edit-routing");
var model_5 = require("./model");
var MoveAction = /** @class */ (function () {
    function MoveAction(moves, animate) {
        if (animate === void 0) { animate = true; }
        this.moves = moves;
        this.animate = animate;
        this.kind = MoveCommand.KIND;
    }
    return MoveAction;
}());
exports.MoveAction = MoveAction;
var MoveCommand = /** @class */ (function (_super) {
    __extends(MoveCommand, _super);
    function MoveCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.resolvedMoves = new Map;
        _this.resolvedRoutes = new Map;
        return _this;
    }
    MoveCommand.prototype.execute = function (context) {
        var _this = this;
        var model = context.root;
        var attachedElements = new Set;
        this.action.moves.forEach(function (move) {
            var resolvedMove = _this.resolve(move, model.index);
            if (resolvedMove !== undefined) {
                _this.resolvedMoves.set(resolvedMove.elementId, resolvedMove);
                model.index.getAttachedElements(resolvedMove.element).forEach(function (e) { return attachedElements.add(e); });
            }
        });
        attachedElements.forEach(function (element) { return _this.handleAttachedElement(element); });
        if (this.action.animate) {
            return new MoveAnimation(model, this.resolvedMoves, this.resolvedRoutes, context).start();
        }
        else {
            return this.doMove(context);
        }
    };
    MoveCommand.prototype.resolve = function (move, index) {
        var element = index.getById(move.elementId);
        if (element !== undefined && model_5.isLocateable(element)) {
            var fromPosition = move.fromPosition || { x: element.position.x, y: element.position.y };
            return {
                elementId: move.elementId,
                element: element,
                fromPosition: fromPosition,
                toPosition: move.toPosition
            };
        }
        return undefined;
    };
    MoveCommand.prototype.handleAttachedElement = function (element) {
        if (model_4.isRoutable(element)) {
            var source = element.source;
            var sourceMove = source ? this.resolvedMoves.get(source.id) : undefined;
            var target = element.target;
            var targetMove = target ? this.resolvedMoves.get(target.id) : undefined;
            if (sourceMove !== undefined && targetMove !== undefined) {
                var deltaX_1 = targetMove.toPosition.x - targetMove.fromPosition.x;
                var deltaY_1 = targetMove.toPosition.y - targetMove.fromPosition.y;
                this.resolvedRoutes.set(element.id, {
                    elementId: element.id,
                    element: element,
                    fromRoute: element.routingPoints,
                    toRoute: element.routingPoints.map(function (rp) { return ({
                        x: rp.x + deltaX_1,
                        y: rp.y + deltaY_1
                    }); })
                });
            }
        }
    };
    MoveCommand.prototype.doMove = function (context, reverse) {
        this.resolvedMoves.forEach(function (res) {
            if (reverse)
                res.element.position = res.fromPosition;
            else
                res.element.position = res.toPosition;
        });
        this.resolvedRoutes.forEach(function (res) {
            if (reverse)
                res.element.routingPoints = res.fromRoute;
            else
                res.element.routingPoints = res.toRoute;
        });
        return context.root;
    };
    MoveCommand.prototype.undo = function (context) {
        return new MoveAnimation(context.root, this.resolvedMoves, this.resolvedRoutes, context, true).start();
    };
    MoveCommand.prototype.redo = function (context) {
        return new MoveAnimation(context.root, this.resolvedMoves, this.resolvedRoutes, context, false).start();
    };
    MoveCommand.prototype.merge = function (command, context) {
        var _this = this;
        if (!this.action.animate && command instanceof MoveCommand) {
            command.action.moves.forEach(function (otherMove) {
                var existingMove = _this.resolvedMoves.get(otherMove.elementId);
                if (existingMove) {
                    existingMove.toPosition = otherMove.toPosition;
                }
                else {
                    var resolvedMove = _this.resolve(otherMove, context.root.index);
                    if (resolvedMove)
                        _this.resolvedMoves.set(resolvedMove.elementId, resolvedMove);
                }
            });
            return true;
        }
        return false;
    };
    MoveCommand.KIND = 'move';
    return MoveCommand;
}(command_1.MergeableCommand));
exports.MoveCommand = MoveCommand;
var MoveAnimation = /** @class */ (function (_super) {
    __extends(MoveAnimation, _super);
    function MoveAnimation(model, elementMoves, elementRoutes, context, reverse) {
        if (reverse === void 0) { reverse = false; }
        var _this = _super.call(this, context) || this;
        _this.model = model;
        _this.elementMoves = elementMoves;
        _this.elementRoutes = elementRoutes;
        _this.reverse = reverse;
        return _this;
    }
    MoveAnimation.prototype.tween = function (t) {
        var _this = this;
        this.elementMoves.forEach(function (elementMove) {
            if (_this.reverse) {
                elementMove.element.position = {
                    x: (1 - t) * elementMove.toPosition.x + t * elementMove.fromPosition.x,
                    y: (1 - t) * elementMove.toPosition.y + t * elementMove.fromPosition.y
                };
            }
            else {
                elementMove.element.position = {
                    x: (1 - t) * elementMove.fromPosition.x + t * elementMove.toPosition.x,
                    y: (1 - t) * elementMove.fromPosition.y + t * elementMove.toPosition.y
                };
            }
        });
        this.elementRoutes.forEach(function (elementRoute) {
            var route = [];
            for (var i = 0; i < elementRoute.fromRoute.length && i < elementRoute.toRoute.length; i++) {
                var fp = elementRoute.fromRoute[i];
                var tp = elementRoute.toRoute[i];
                if (_this.reverse) {
                    route.push({
                        x: (1 - t) * tp.x + t * fp.x,
                        y: (1 - t) * tp.y + t * fp.y
                    });
                }
                else {
                    route.push({
                        x: (1 - t) * fp.x + t * tp.x,
                        y: (1 - t) * fp.y + t * tp.y
                    });
                }
            }
            elementRoute.element.routingPoints = route;
        });
        return this.model;
    };
    return MoveAnimation;
}(animation_1.Animation));
exports.MoveAnimation = MoveAnimation;
var MoveMouseListener = /** @class */ (function (_super) {
    __extends(MoveMouseListener, _super);
    function MoveMouseListener() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasDragged = false;
        return _this;
    }
    MoveMouseListener.prototype.mouseDown = function (target, event) {
        var result = [];
        if (event.button === 0) {
            var moveable = smodel_utils_1.findParentByFeature(target, model_5.isMoveable);
            var isRoutingHandle = target instanceof model_4.SRoutingHandle;
            if (moveable !== undefined || isRoutingHandle) {
                this.lastDragPosition = { x: event.pageX, y: event.pageY };
            }
            else {
                this.lastDragPosition = undefined;
            }
            this.hasDragged = false;
            if (isRoutingHandle) {
                result.push(new edit_routing_1.SwitchEditModeAction([target.id], []));
            }
        }
        return result;
    };
    MoveMouseListener.prototype.mouseMove = function (target, event) {
        var _this = this;
        var result = [];
        if (event.buttons === 0)
            this.mouseUp(target, event);
        else if (this.lastDragPosition) {
            var viewport = smodel_utils_1.findParentByFeature(target, model_1.isViewport);
            this.hasDragged = true;
            var zoom = viewport ? viewport.zoom : 1;
            var dx_1 = (event.pageX - this.lastDragPosition.x) / zoom;
            var dy_1 = (event.pageY - this.lastDragPosition.y) / zoom;
            var nodeMoves_1 = [];
            var handleMoves_1 = [];
            target.root.index.all()
                .filter(function (element) { return model_2.isSelectable(element) && element.selected; })
                .forEach(function (element) {
                if (model_5.isMoveable(element)) {
                    nodeMoves_1.push({
                        elementId: element.id,
                        fromPosition: {
                            x: element.position.x,
                            y: element.position.y
                        },
                        toPosition: {
                            x: element.position.x + dx_1,
                            y: element.position.y + dy_1
                        }
                    });
                }
                else if (element instanceof model_4.SRoutingHandle) {
                    var point = _this.getHandlePosition(element);
                    if (point !== undefined) {
                        handleMoves_1.push({
                            elementId: element.id,
                            fromPosition: point,
                            toPosition: {
                                x: point.x + dx_1,
                                y: point.y + dy_1
                            }
                        });
                    }
                }
            });
            this.lastDragPosition = { x: event.pageX, y: event.pageY };
            if (nodeMoves_1.length > 0)
                result.push(new MoveAction(nodeMoves_1, false));
            if (handleMoves_1.length > 0)
                result.push(new edit_routing_1.MoveRoutingHandleAction(handleMoves_1, false));
        }
        return result;
    };
    MoveMouseListener.prototype.getHandlePosition = function (handle) {
        var parent = handle.parent;
        if (!model_4.isRoutable(parent)) {
            return undefined;
        }
        if (handle.kind === 'line') {
            var getIndex = function (rp) {
                if (rp.pointIndex !== undefined)
                    return rp.pointIndex;
                else if (rp.kind === 'target')
                    return parent.routingPoints.length;
                else
                    return -1;
            };
            var route = parent.route();
            var rp1 = void 0, rp2 = void 0;
            for (var _i = 0, route_1 = route; _i < route_1.length; _i++) {
                var rp = route_1[_i];
                var i = getIndex(rp);
                if (i <= handle.pointIndex && (rp1 === undefined || i > getIndex(rp1)))
                    rp1 = rp;
                if (i > handle.pointIndex && (rp2 === undefined || i < getIndex(rp2)))
                    rp2 = rp;
            }
            if (rp1 !== undefined && rp2 !== undefined) {
                return geometry_1.centerOfLine(rp1, rp2);
            }
        }
        else if (handle.pointIndex >= 0) {
            return parent.routingPoints[handle.pointIndex];
        }
        return undefined;
    };
    MoveMouseListener.prototype.mouseEnter = function (target, event) {
        if (target instanceof smodel_2.SModelRoot && event.buttons === 0)
            this.mouseUp(target, event);
        return [];
    };
    MoveMouseListener.prototype.mouseUp = function (target, event) {
        var result = [];
        if (this.lastDragPosition) {
            target.root.index.all()
                .forEach(function (element) {
                if (element instanceof model_4.SRoutingHandle && element.editMode)
                    result.push(new edit_routing_1.SwitchEditModeAction([], [element.id]));
            });
        }
        this.hasDragged = false;
        this.lastDragPosition = undefined;
        return result;
    };
    MoveMouseListener.prototype.decorate = function (vnode, element) {
        return vnode;
    };
    return MoveMouseListener;
}(mouse_tool_1.MouseListener));
exports.MoveMouseListener = MoveMouseListener;
var LocationDecorator = /** @class */ (function () {
    function LocationDecorator() {
    }
    LocationDecorator.prototype.decorate = function (vnode, element) {
        var translate = '';
        if (model_5.isLocateable(element) && element instanceof smodel_1.SChildElement && element.parent !== undefined) {
            translate = 'translate(' + element.position.x + ', ' + element.position.y + ')';
        }
        if (model_3.isAlignable(element)) {
            if (translate.length > 0)
                translate += ' ';
            translate += 'translate(' + element.alignment.x + ', ' + element.alignment.y + ')';
        }
        if (translate.length > 0)
            vnode_utils_1.setAttr(vnode, 'transform', translate);
        return vnode;
    };
    LocationDecorator.prototype.postUpdate = function () {
    };
    LocationDecorator = __decorate([
        inversify_1.injectable()
    ], LocationDecorator);
    return LocationDecorator;
}());
exports.LocationDecorator = LocationDecorator;
