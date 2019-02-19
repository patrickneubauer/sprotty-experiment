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
var types_1 = require("../types");
var smodel_1 = require("../model/smodel");
var action_1 = require("../actions/action");
var vnode_utils_1 = require("./vnode-utils");
var MouseTool = /** @class */ (function () {
    function MouseTool(actionDispatcher, domHelper, mouseListeners) {
        if (mouseListeners === void 0) { mouseListeners = []; }
        this.actionDispatcher = actionDispatcher;
        this.domHelper = domHelper;
        this.mouseListeners = mouseListeners;
    }
    MouseTool.prototype.register = function (mouseListener) {
        this.mouseListeners.push(mouseListener);
    };
    MouseTool.prototype.deregister = function (mouseListener) {
        var index = this.mouseListeners.indexOf(mouseListener);
        if (index >= 0)
            this.mouseListeners.splice(index, 1);
    };
    MouseTool.prototype.getTargetElement = function (model, event) {
        var target = event.target;
        var index = model.index;
        while (target) {
            if (target.id) {
                var element = index.getById(this.domHelper.findSModelIdByDOMElement(target));
                if (element !== undefined)
                    return element;
            }
            target = target.parentNode;
        }
        return undefined;
    };
    MouseTool.prototype.handleEvent = function (methodName, model, event) {
        var _this = this;
        this.focusOnMouseEvent(methodName, model);
        var element = this.getTargetElement(model, event);
        if (!element)
            return;
        var actions = this.mouseListeners
            .map(function (listener) { return listener[methodName].apply(listener, [element, event]); })
            .reduce(function (a, b) { return a.concat(b); });
        if (actions.length > 0) {
            event.preventDefault();
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var actionOrPromise = actions_1[_i];
                if (action_1.isAction(actionOrPromise)) {
                    this.actionDispatcher.dispatch(actionOrPromise);
                }
                else {
                    actionOrPromise.then(function (action) {
                        _this.actionDispatcher.dispatch(action);
                    });
                }
            }
        }
    };
    MouseTool.prototype.focusOnMouseEvent = function (methodName, model) {
        if (document) {
            var domElement = document.getElementById(this.domHelper.createUniqueDOMElementId(model));
            if (methodName === 'mouseDown' && domElement !== null && typeof domElement.focus === 'function')
                domElement.focus();
        }
    };
    MouseTool.prototype.mouseOver = function (model, event) {
        this.handleEvent('mouseOver', model, event);
    };
    MouseTool.prototype.mouseOut = function (model, event) {
        this.handleEvent('mouseOut', model, event);
    };
    MouseTool.prototype.mouseEnter = function (model, event) {
        this.handleEvent('mouseEnter', model, event);
    };
    MouseTool.prototype.mouseLeave = function (model, event) {
        this.handleEvent('mouseLeave', model, event);
    };
    MouseTool.prototype.mouseDown = function (model, event) {
        this.handleEvent('mouseDown', model, event);
    };
    MouseTool.prototype.mouseMove = function (model, event) {
        this.handleEvent('mouseMove', model, event);
    };
    MouseTool.prototype.mouseUp = function (model, event) {
        this.handleEvent('mouseUp', model, event);
    };
    MouseTool.prototype.wheel = function (model, event) {
        this.handleEvent('wheel', model, event);
    };
    MouseTool.prototype.doubleClick = function (model, event) {
        this.handleEvent('doubleClick', model, event);
    };
    MouseTool.prototype.decorate = function (vnode, element) {
        if (element instanceof smodel_1.SModelRoot) {
            vnode_utils_1.on(vnode, 'mouseover', this.mouseOver.bind(this), element);
            vnode_utils_1.on(vnode, 'mouseout', this.mouseOut.bind(this), element);
            vnode_utils_1.on(vnode, 'mouseenter', this.mouseEnter.bind(this), element);
            vnode_utils_1.on(vnode, 'mouseleave', this.mouseLeave.bind(this), element);
            vnode_utils_1.on(vnode, 'mousedown', this.mouseDown.bind(this), element);
            vnode_utils_1.on(vnode, 'mouseup', this.mouseUp.bind(this), element);
            vnode_utils_1.on(vnode, 'mousemove', this.mouseMove.bind(this), element);
            vnode_utils_1.on(vnode, 'wheel', this.wheel.bind(this), element);
            vnode_utils_1.on(vnode, 'contextmenu', function (target, event) {
                event.preventDefault();
            }, element);
            vnode_utils_1.on(vnode, 'dblclick', this.doubleClick.bind(this), element);
        }
        vnode = this.mouseListeners.reduce(function (n, listener) { return listener.decorate(n, element); }, vnode);
        return vnode;
    };
    MouseTool.prototype.postUpdate = function () {
    };
    MouseTool = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.DOMHelper)),
        __param(2, inversify_1.multiInject(types_1.TYPES.MouseListener)), __param(2, inversify_1.optional())
    ], MouseTool);
    return MouseTool;
}());
exports.MouseTool = MouseTool;
var PopupMouseTool = /** @class */ (function (_super) {
    __extends(PopupMouseTool, _super);
    function PopupMouseTool(actionDispatcher, domHelper, mouseListeners) {
        if (mouseListeners === void 0) { mouseListeners = []; }
        var _this = _super.call(this, actionDispatcher, domHelper, mouseListeners) || this;
        _this.actionDispatcher = actionDispatcher;
        _this.domHelper = domHelper;
        _this.mouseListeners = mouseListeners;
        return _this;
    }
    PopupMouseTool = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.DOMHelper)),
        __param(2, inversify_1.multiInject(types_1.TYPES.PopupMouseListener)), __param(2, inversify_1.optional())
    ], PopupMouseTool);
    return PopupMouseTool;
}(MouseTool));
exports.PopupMouseTool = PopupMouseTool;
var MouseListener = /** @class */ (function () {
    function MouseListener() {
    }
    MouseListener.prototype.mouseOver = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseOut = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseEnter = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseLeave = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseDown = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseMove = function (target, event) {
        return [];
    };
    MouseListener.prototype.mouseUp = function (target, event) {
        return [];
    };
    MouseListener.prototype.wheel = function (target, event) {
        return [];
    };
    MouseListener.prototype.doubleClick = function (target, event) {
        return [];
    };
    MouseListener.prototype.decorate = function (vnode, element) {
        return vnode;
    };
    MouseListener = __decorate([
        inversify_1.injectable()
    ], MouseListener);
    return MouseListener;
}());
exports.MouseListener = MouseListener;
