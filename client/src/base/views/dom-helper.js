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
var DOMHelper = /** @class */ (function () {
    function DOMHelper(viewerOptions) {
        this.viewerOptions = viewerOptions;
    }
    DOMHelper.prototype.getPrefix = function () {
        var prefix = this.viewerOptions !== undefined && this.viewerOptions.baseDiv !== undefined ?
            this.viewerOptions.baseDiv + "_" : "";
        return prefix;
    };
    DOMHelper.prototype.createUniqueDOMElementId = function (element) {
        return this.getPrefix() + element.id;
    };
    DOMHelper.prototype.findSModelIdByDOMElement = function (element) {
        return element.id.replace(this.getPrefix(), '');
    };
    DOMHelper = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ViewerOptions))
    ], DOMHelper);
    return DOMHelper;
}());
exports.DOMHelper = DOMHelper;
