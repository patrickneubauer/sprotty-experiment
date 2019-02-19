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
var registry_1 = require("../../utils/registry");
var smodel_1 = require("./smodel");
/**
 * The default model factory creates SModelRoot for the root element and SChildElement for all other
 * model elements.
 */
var SModelFactory = /** @class */ (function () {
    function SModelFactory(registry) {
        this.registry = registry;
    }
    SModelFactory.prototype.createElement = function (schema, parent) {
        var child;
        if (this.registry.hasKey(schema.type)) {
            var regElement = this.registry.get(schema.type, undefined);
            if (!(regElement instanceof smodel_1.SChildElement))
                throw new Error("Element with type " + schema.type + " was expected to be an SChildElement.");
            child = regElement;
        }
        else {
            child = new smodel_1.SChildElement();
        }
        return this.initializeChild(child, schema, parent);
    };
    SModelFactory.prototype.createRoot = function (schema) {
        var root;
        if (this.registry.hasKey(schema.type)) {
            var regElement = this.registry.get(schema.type, undefined);
            if (!(regElement instanceof smodel_1.SModelRoot))
                throw new Error("Element with type " + schema.type + " was expected to be an SModelRoot.");
            root = regElement;
        }
        else {
            root = new smodel_1.SModelRoot();
        }
        return this.initializeRoot(root, schema);
    };
    SModelFactory.prototype.createSchema = function (element) {
        var _this = this;
        var schema = {};
        for (var key in element) {
            if (!this.isReserved(element, key)) {
                var value = element[key];
                if (typeof value !== 'function')
                    schema[key] = value;
            }
        }
        if (element instanceof smodel_1.SParentElement)
            schema['children'] = element.children.map(function (child) { return _this.createSchema(child); });
        return schema;
    };
    SModelFactory.prototype.initializeElement = function (element, schema) {
        for (var key in schema) {
            if (!this.isReserved(element, key)) {
                var value = schema[key];
                if (typeof value !== 'function')
                    element[key] = value;
            }
        }
        return element;
    };
    SModelFactory.prototype.isReserved = function (element, propertyName) {
        if (['children', 'parent', 'index'].indexOf(propertyName) >= 0)
            return true;
        var obj = element;
        do {
            var descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
            if (descriptor !== undefined)
                return descriptor.get !== undefined;
            obj = Object.getPrototypeOf(obj);
        } while (obj);
        return false;
    };
    SModelFactory.prototype.initializeParent = function (parent, schema) {
        var _this = this;
        this.initializeElement(parent, schema);
        if (smodel_1.isParent(schema)) {
            parent.children = schema.children.map(function (childSchema) { return _this.createElement(childSchema, parent); });
        }
        return parent;
    };
    SModelFactory.prototype.initializeChild = function (child, schema, parent) {
        this.initializeParent(child, schema);
        if (parent !== undefined) {
            child.parent = parent;
        }
        return child;
    };
    SModelFactory.prototype.initializeRoot = function (root, schema) {
        this.initializeParent(root, schema);
        root.index.add(root);
        return root;
    };
    SModelFactory = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.SModelRegistry))
    ], SModelFactory);
    return SModelFactory;
}());
exports.SModelFactory = SModelFactory;
exports.EMPTY_ROOT = Object.freeze({
    type: 'NONE',
    id: 'EMPTY'
});
/**
 * Model element classes registered here are considered automatically when constructring a model from its schema.
 */
var SModelRegistry = /** @class */ (function (_super) {
    __extends(SModelRegistry, _super);
    function SModelRegistry(registrations) {
        var _this = _super.call(this) || this;
        registrations.forEach(function (registration) { return _this.register(registration.type, registration.constr); });
        return _this;
    }
    SModelRegistry = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.multiInject(types_1.TYPES.SModelElementRegistration)), __param(0, inversify_1.optional())
    ], SModelRegistry);
    return SModelRegistry;
}(registry_1.ProviderRegistry));
exports.SModelRegistry = SModelRegistry;
