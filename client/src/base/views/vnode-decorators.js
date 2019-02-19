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
exports.__esModule = true;
var inversify_1 = require("inversify");
var vnode_utils_1 = require("./vnode-utils");
var FocusFixDecorator = /** @class */ (function () {
    function FocusFixDecorator() {
    }
    FocusFixDecorator_1 = FocusFixDecorator;
    FocusFixDecorator.prototype.decorate = function (vnode, element) {
        if (vnode.sel && vnode.sel.startsWith('svg'))
            // allows to set focus in Firefox
            vnode_utils_1.setAttr(vnode, 'tabindex', ++FocusFixDecorator_1.tabIndex);
        return vnode;
    };
    FocusFixDecorator.prototype.postUpdate = function () {
    };
    var FocusFixDecorator_1;
    FocusFixDecorator.tabIndex = 1000;
    FocusFixDecorator = FocusFixDecorator_1 = __decorate([
        inversify_1.injectable()
    ], FocusFixDecorator);
    return FocusFixDecorator;
}());
exports.FocusFixDecorator = FocusFixDecorator;
