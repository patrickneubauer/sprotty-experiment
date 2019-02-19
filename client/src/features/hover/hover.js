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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var keyboard_1 = require("../../utils/keyboard");
var geometry_1 = require("../../utils/geometry");
var types_1 = require("../../base/types");
var smodel_1 = require("../../base/model/smodel");
var mouse_tool_1 = require("../../base/views/mouse-tool");
var command_1 = require("../../base/commands/command");
var smodel_factory_1 = require("../../base/model/smodel-factory");
var key_tool_1 = require("../../base/views/key-tool");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var model_1 = require("../bounds/model");
var model_2 = require("./model");
/**
 * Triggered when the user puts the mouse pointer over an element.
 */
var HoverFeedbackAction = /** @class */ (function () {
    function HoverFeedbackAction(mouseoverElement, mouseIsOver) {
        this.mouseoverElement = mouseoverElement;
        this.mouseIsOver = mouseIsOver;
        this.kind = HoverFeedbackCommand.KIND;
    }
    return HoverFeedbackAction;
}());
exports.HoverFeedbackAction = HoverFeedbackAction;
var HoverFeedbackCommand = /** @class */ (function (_super) {
    __extends(HoverFeedbackCommand, _super);
    function HoverFeedbackCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    HoverFeedbackCommand.prototype.execute = function (context) {
        var model = context.root;
        var modelElement = model.index.getById(this.action.mouseoverElement);
        if (modelElement) {
            if (model_2.isHoverable(modelElement)) {
                modelElement.hoverFeedback = this.action.mouseIsOver;
            }
        }
        return this.redo(context);
    };
    HoverFeedbackCommand.prototype.undo = function (context) {
        return context.root;
    };
    HoverFeedbackCommand.prototype.redo = function (context) {
        return context.root;
    };
    HoverFeedbackCommand.KIND = 'hoverFeedback';
    return HoverFeedbackCommand;
}(command_1.Command));
exports.HoverFeedbackCommand = HoverFeedbackCommand;
/**
 * Triggered when the user hovers the mouse pointer over an element to get a popup with details on
 * that element. This action is sent from the client to the model source, e.g. a DiagramServer.
 * The response is a SetPopupModelAction.
 */
var RequestPopupModelAction = /** @class */ (function () {
    function RequestPopupModelAction(elementId, bounds) {
        this.elementId = elementId;
        this.bounds = bounds;
        this.kind = RequestPopupModelAction.KIND;
    }
    RequestPopupModelAction.KIND = 'requestPopupModel';
    return RequestPopupModelAction;
}());
exports.RequestPopupModelAction = RequestPopupModelAction;
/**
 * Sent from the model source to the client to display a popup in response to a RequestPopupModelAction.
 * This action can also be used to remove any existing popup by choosing EMPTY_ROOT as root element.
 */
var SetPopupModelAction = /** @class */ (function () {
    function SetPopupModelAction(newRoot) {
        this.newRoot = newRoot;
        this.kind = SetPopupModelCommand.KIND;
    }
    return SetPopupModelAction;
}());
exports.SetPopupModelAction = SetPopupModelAction;
var SetPopupModelCommand = /** @class */ (function (_super) {
    __extends(SetPopupModelCommand, _super);
    function SetPopupModelCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    SetPopupModelCommand.prototype.execute = function (context) {
        this.oldRoot = context.root;
        this.newRoot = context.modelFactory.createRoot(this.action.newRoot);
        return this.newRoot;
    };
    SetPopupModelCommand.prototype.undo = function (context) {
        return this.oldRoot;
    };
    SetPopupModelCommand.prototype.redo = function (context) {
        return this.newRoot;
    };
    SetPopupModelCommand.KIND = 'setPopupModel';
    return SetPopupModelCommand;
}(command_1.PopupCommand));
exports.SetPopupModelCommand = SetPopupModelCommand;
var AbstractHoverMouseListener = /** @class */ (function (_super) {
    __extends(AbstractHoverMouseListener, _super);
    function AbstractHoverMouseListener(options, state) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.state = state;
        return _this;
    }
    AbstractHoverMouseListener.prototype.stopMouseOutTimer = function () {
        if (this.state.mouseOutTimer !== undefined) {
            window.clearTimeout(this.state.mouseOutTimer);
            this.state.mouseOutTimer = undefined;
        }
    };
    AbstractHoverMouseListener.prototype.startMouseOutTimer = function () {
        var _this = this;
        this.stopMouseOutTimer();
        return new Promise(function (resolve) {
            _this.state.mouseOutTimer = window.setTimeout(function () {
                _this.state.popupOpen = false;
                _this.state.previousPopupElement = undefined;
                resolve(new SetPopupModelAction({ type: smodel_factory_1.EMPTY_ROOT.type, id: smodel_factory_1.EMPTY_ROOT.id }));
            }, _this.options.popupCloseDelay);
        });
    };
    AbstractHoverMouseListener.prototype.stopMouseOverTimer = function () {
        if (this.state.mouseOverTimer !== undefined) {
            window.clearTimeout(this.state.mouseOverTimer);
            this.state.mouseOverTimer = undefined;
        }
    };
    AbstractHoverMouseListener = __decorate([
        __param(0, inversify_1.inject(types_1.TYPES.ViewerOptions)),
        __param(1, inversify_1.inject(types_1.TYPES.HoverState))
    ], AbstractHoverMouseListener);
    return AbstractHoverMouseListener;
}(mouse_tool_1.MouseListener));
exports.AbstractHoverMouseListener = AbstractHoverMouseListener;
var HoverMouseListener = /** @class */ (function (_super) {
    __extends(HoverMouseListener, _super);
    function HoverMouseListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HoverMouseListener.prototype.computePopupBounds = function (target, mousePosition) {
        // Default position: below the mouse cursor
        var offset = { x: -5, y: 20 };
        var targetBounds = model_1.getAbsoluteBounds(target);
        var canvasBounds = target.root.canvasBounds;
        var boundsInWindow = geometry_1.translate(targetBounds, canvasBounds);
        var distRight = boundsInWindow.x + boundsInWindow.width - mousePosition.x;
        var distBottom = boundsInWindow.y + boundsInWindow.height - mousePosition.y;
        if (distBottom <= distRight && this.allowSidePosition(target, 'below', distBottom)) {
            // Put the popup below the target element
            offset = { x: -5, y: Math.round(distBottom + 5) };
        }
        else if (distRight <= distBottom && this.allowSidePosition(target, 'right', distRight)) {
            // Put the popup right of the target element
            offset = { x: Math.round(distRight + 5), y: -5 };
        }
        var leftPopupPosition = mousePosition.x + offset.x;
        var canvasRightBorderPosition = canvasBounds.x + canvasBounds.width;
        if (leftPopupPosition > canvasRightBorderPosition) {
            leftPopupPosition = canvasRightBorderPosition;
        }
        var topPopupPosition = mousePosition.y + offset.y;
        var canvasBottomBorderPosition = canvasBounds.y + canvasBounds.height;
        if (topPopupPosition > canvasBottomBorderPosition) {
            topPopupPosition = canvasBottomBorderPosition;
        }
        return { x: leftPopupPosition, y: topPopupPosition, width: -1, height: -1 };
    };
    HoverMouseListener.prototype.allowSidePosition = function (target, side, distance) {
        return !(target instanceof smodel_1.SModelRoot) && distance <= 150;
    };
    HoverMouseListener.prototype.startMouseOverTimer = function (target, event) {
        var _this = this;
        this.stopMouseOverTimer();
        return new Promise(function (resolve) {
            _this.state.mouseOverTimer = window.setTimeout(function () {
                var popupBounds = _this.computePopupBounds(target, { x: event.pageX, y: event.pageY });
                resolve(new RequestPopupModelAction(target.id, popupBounds));
                _this.state.popupOpen = true;
                _this.state.previousPopupElement = target;
            }, _this.options.popupOpenDelay);
        });
    };
    HoverMouseListener.prototype.mouseOver = function (target, event) {
        var result = [];
        var popupTarget = smodel_utils_1.findParent(target, model_2.hasPopupFeature);
        if (this.state.popupOpen && (popupTarget === undefined ||
            this.state.previousPopupElement !== undefined && this.state.previousPopupElement.id !== popupTarget.id)) {
            result.push(this.startMouseOutTimer());
        }
        else {
            this.stopMouseOverTimer();
            this.stopMouseOutTimer();
        }
        if (popupTarget !== undefined &&
            (this.state.previousPopupElement === undefined || this.state.previousPopupElement.id !== popupTarget.id)) {
            result.push(this.startMouseOverTimer(popupTarget, event));
        }
        var hoverTarget = smodel_utils_1.findParentByFeature(target, model_2.isHoverable);
        if (hoverTarget !== undefined)
            result.push(new HoverFeedbackAction(hoverTarget.id, true));
        return result;
    };
    HoverMouseListener.prototype.mouseOut = function (target, event) {
        var result = [];
        if (this.state.popupOpen) {
            var popupTarget = smodel_utils_1.findParent(target, model_2.hasPopupFeature);
            if (this.state.previousPopupElement !== undefined && popupTarget !== undefined
                && this.state.previousPopupElement.id === popupTarget.id)
                result.push(this.startMouseOutTimer());
        }
        this.stopMouseOverTimer();
        var hoverTarget = smodel_utils_1.findParentByFeature(target, model_2.isHoverable);
        if (hoverTarget !== undefined)
            result.push(new HoverFeedbackAction(hoverTarget.id, false));
        return result;
    };
    HoverMouseListener.prototype.mouseMove = function (target, event) {
        var result = [];
        if (this.state.previousPopupElement !== undefined && this.closeOnMouseMove(this.state.previousPopupElement, event)) {
            result.push(this.startMouseOutTimer());
        }
        var popupTarget = smodel_utils_1.findParent(target, model_2.hasPopupFeature);
        if (popupTarget !== undefined && (this.state.previousPopupElement === undefined
            || this.state.previousPopupElement.id !== popupTarget.id)) {
            result.push(this.startMouseOverTimer(popupTarget, event));
        }
        return result;
    };
    HoverMouseListener.prototype.closeOnMouseMove = function (target, event) {
        return target instanceof smodel_1.SModelRoot;
    };
    HoverMouseListener = __decorate([
        inversify_1.injectable()
    ], HoverMouseListener);
    return HoverMouseListener;
}(AbstractHoverMouseListener));
exports.HoverMouseListener = HoverMouseListener;
var PopupHoverMouseListener = /** @class */ (function (_super) {
    __extends(PopupHoverMouseListener, _super);
    function PopupHoverMouseListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PopupHoverMouseListener.prototype.mouseOut = function (target, event) {
        return [this.startMouseOutTimer()];
    };
    PopupHoverMouseListener.prototype.mouseOver = function (target, event) {
        this.stopMouseOutTimer();
        this.stopMouseOverTimer();
        return [];
    };
    PopupHoverMouseListener = __decorate([
        inversify_1.injectable()
    ], PopupHoverMouseListener);
    return PopupHoverMouseListener;
}(AbstractHoverMouseListener));
exports.PopupHoverMouseListener = PopupHoverMouseListener;
var HoverKeyListener = /** @class */ (function (_super) {
    __extends(HoverKeyListener, _super);
    function HoverKeyListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HoverKeyListener.prototype.keyDown = function (element, event) {
        if (keyboard_1.matchesKeystroke(event, 'Escape')) {
            return [new SetPopupModelAction({ type: smodel_factory_1.EMPTY_ROOT.type, id: smodel_factory_1.EMPTY_ROOT.id })];
        }
        return [];
    };
    return HoverKeyListener;
}(key_tool_1.KeyListener));
exports.HoverKeyListener = HoverKeyListener;
