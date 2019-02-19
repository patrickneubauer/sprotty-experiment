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
var types_1 = require("../../base/types");
var PopupPositionUpdater = /** @class */ (function () {
    function PopupPositionUpdater(options) {
        this.options = options;
    }
    PopupPositionUpdater.prototype.decorate = function (vnode, element) {
        return vnode;
    };
    PopupPositionUpdater.prototype.postUpdate = function () {
        var popupDiv = document.getElementById(this.options.popupDiv);
        if (popupDiv !== null && typeof window !== 'undefined') {
            var boundingClientRect = popupDiv.getBoundingClientRect();
            if (window.innerHeight < boundingClientRect.height + boundingClientRect.top) {
                popupDiv.style.top = (window.scrollY + window.innerHeight - boundingClientRect.height - 5) + 'px';
            }
            if (window.innerWidth < boundingClientRect.left + boundingClientRect.width) {
                popupDiv.style.left = (window.scrollX + window.innerWidth - boundingClientRect.width - 5) + 'px';
            }
            if (boundingClientRect.left < 0) {
                popupDiv.style.left = '0px';
            }
            if (boundingClientRect.top < 0) {
                popupDiv.style.top = '0px';
            }
        }
    };
    PopupPositionUpdater = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ViewerOptions))
    ], PopupPositionUpdater);
    return PopupPositionUpdater;
}());
exports.PopupPositionUpdater = PopupPositionUpdater;
