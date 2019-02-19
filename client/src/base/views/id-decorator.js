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
var vnode_utils_1 = require("./vnode-utils");
var IdDecorator = /** @class */ (function () {
    function IdDecorator(logger, domHelper) {
        this.logger = logger;
        this.domHelper = domHelper;
    }
    IdDecorator.prototype.decorate = function (vnode, element) {
        var attrs = vnode_utils_1.getAttrs(vnode);
        if (attrs.id !== undefined)
            this.logger.warn(vnode, 'Overriding id of vnode (' + attrs.id + '). Make sure not to set it manually in view.');
        attrs.id = this.domHelper.createUniqueDOMElementId(element);
        if (!vnode.key)
            vnode.key = element.id;
        return vnode;
    };
    IdDecorator.prototype.postUpdate = function () {
    };
    IdDecorator = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ILogger)),
        __param(1, inversify_1.inject(types_1.TYPES.DOMHelper))
    ], IdDecorator);
    return IdDecorator;
}());
exports.IdDecorator = IdDecorator;
