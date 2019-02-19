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
var ProviderRegistry = /** @class */ (function () {
    function ProviderRegistry() {
        this.elements = new Map;
    }
    ProviderRegistry.prototype.register = function (key, cstr) {
        if (key === undefined)
            throw new Error('Key is undefined');
        if (this.hasKey(key))
            throw new Error('Key is already registered: ' + key);
        this.elements.set(key, cstr);
    };
    ProviderRegistry.prototype.deregister = function (key) {
        if (key === undefined)
            throw new Error('Key is undefined');
        this.elements["delete"](key);
    };
    ProviderRegistry.prototype.hasKey = function (key) {
        return this.elements.has(key);
    };
    ProviderRegistry.prototype.get = function (key, arg) {
        var existingCstr = this.elements.get(key);
        if (existingCstr)
            return new existingCstr(arg);
        else
            return this.missing(key, arg);
    };
    ProviderRegistry.prototype.missing = function (key, arg) {
        throw new Error('Unknown registry key: ' + key);
    };
    ProviderRegistry = __decorate([
        inversify_1.injectable()
    ], ProviderRegistry);
    return ProviderRegistry;
}());
exports.ProviderRegistry = ProviderRegistry;
var InstanceRegistry = /** @class */ (function () {
    function InstanceRegistry() {
        this.elements = new Map;
    }
    InstanceRegistry.prototype.register = function (key, instance) {
        if (key === undefined)
            throw new Error('Key is undefined');
        if (this.hasKey(key))
            throw new Error('Key is already registered: ' + key);
        this.elements.set(key, instance);
    };
    InstanceRegistry.prototype.deregister = function (key) {
        if (key === undefined)
            throw new Error('Key is undefined');
        this.elements["delete"](key);
    };
    InstanceRegistry.prototype.hasKey = function (key) {
        return this.elements.has(key);
    };
    InstanceRegistry.prototype.get = function (key) {
        var existingInstance = this.elements.get(key);
        if (existingInstance)
            return existingInstance;
        else
            return this.missing(key);
    };
    InstanceRegistry.prototype.missing = function (key) {
        throw new Error('Unknown registry key: ' + key);
    };
    InstanceRegistry = __decorate([
        inversify_1.injectable()
    ], InstanceRegistry);
    return InstanceRegistry;
}());
exports.InstanceRegistry = InstanceRegistry;
var MultiInstanceRegistry = /** @class */ (function () {
    function MultiInstanceRegistry() {
        this.elements = new Map;
    }
    MultiInstanceRegistry.prototype.register = function (key, instance) {
        if (key === undefined)
            throw new Error('Key is undefined');
        var instances = this.elements.get(key);
        if (instances !== undefined)
            instances.push(instance);
        else
            this.elements.set(key, [instance]);
    };
    MultiInstanceRegistry.prototype.deregisterAll = function (key) {
        if (key === undefined)
            throw new Error('Key is undefined');
        this.elements["delete"](key);
    };
    MultiInstanceRegistry.prototype.get = function (key) {
        var existingInstances = this.elements.get(key);
        if (existingInstances !== undefined)
            return existingInstances;
        else
            return [];
    };
    MultiInstanceRegistry = __decorate([
        inversify_1.injectable()
    ], MultiInstanceRegistry);
    return MultiInstanceRegistry;
}());
exports.MultiInstanceRegistry = MultiInstanceRegistry;
