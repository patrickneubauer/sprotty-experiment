"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../types");
var smodel_1 = require("../model/smodel");
var vnode_utils_1 = require("./vnode-utils");
var KeyTool = /** @class */ (function () {
    function KeyTool(actionDispatcher, keyListeners) {
        if (keyListeners === void 0) { keyListeners = []; }
        this.actionDispatcher = actionDispatcher;
        this.keyListeners = keyListeners;
    }
    KeyTool.prototype.register = function (keyListener) {
        this.keyListeners.push(keyListener);
    };
    KeyTool.prototype.deregister = function (keyListener) {
        var index = this.keyListeners.indexOf(keyListener);
        if (index >= 0)
            this.keyListeners.splice(index, 1);
    };
    KeyTool.prototype.handleEvent = function (methodName, model, event) {
        var actions = this.keyListeners
            .map(function (listener) { return listener[methodName].apply(listener, [model, event]); })
            .reduce(function (a, b) { return a.concat(b); });
        if (actions.length > 0) {
            event.preventDefault();
            this.actionDispatcher.dispatchAll(actions);
        }
    };
    KeyTool.prototype.keyDown = function (element, event) {
        this.handleEvent('keyDown', element, event);
    };
    KeyTool.prototype.focus = function () { };
    KeyTool.prototype.decorate = function (vnode, element) {
        if (element instanceof smodel_1.SModelRoot) {
            vnode_utils_1.on(vnode, 'focus', this.focus.bind(this), element);
            vnode_utils_1.on(vnode, 'keydown', this.keyDown.bind(this), element);
        }
        return vnode;
    };
    KeyTool.prototype.postUpdate = function () {
    };
    KeyTool = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.multiInject(types_1.TYPES.KeyListener)), __param(1, inversify_1.optional())
    ], KeyTool);
    return KeyTool;
}());
exports.KeyTool = KeyTool;
var KeyListener = /** @class */ (function () {
    function KeyListener() {
    }
    KeyListener.prototype.keyDown = function (element, event) {
        return [];
    };
    KeyListener = __decorate([
        inversify_1.injectable()
    ], KeyListener);
    return KeyListener;
}());
exports.KeyListener = KeyListener;
