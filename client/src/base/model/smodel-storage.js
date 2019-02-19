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
var types_1 = require("../types");
var smodel_factory_1 = require("./smodel-factory");
var SModelStorage = /** @class */ (function () {
    function SModelStorage() {
        this.localCache = new Map;
    }
    SModelStorage.prototype.store = function (root) {
        if (this.isLocalStorageAvailable())
            localStorage.setItem(this.key, JSON.stringify(root));
        else
            this.localCache.set(this.key, JSON.stringify(root));
    };
    SModelStorage.prototype.load = function () {
        var schema = (this.isLocalStorageAvailable())
            ? localStorage.getItem(this.key)
            : this.localCache.get(this.key);
        if (schema)
            return JSON.parse(schema);
        else
            return smodel_factory_1.EMPTY_ROOT;
    };
    SModelStorage.prototype.isLocalStorageAvailable = function () {
        try {
            return typeof localStorage === 'object' && localStorage !== null;
        }
        catch (e) {
            return false;
        }
    };
    Object.defineProperty(SModelStorage.prototype, "key", {
        get: function () {
            return this.viewerOptions.baseDiv;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        inversify_1.inject(types_1.TYPES.ViewerOptions)
    ], SModelStorage.prototype, "viewerOptions");
    SModelStorage = __decorate([
        inversify_1.injectable()
    ], SModelStorage);
    return SModelStorage;
}());
exports.SModelStorage = SModelStorage;
