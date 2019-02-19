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
exports.__esModule = true;
var inversify_1 = require("inversify");
var smodel_factory_1 = require("../base/model/smodel-factory");
var smodel_1 = require("../base/model/smodel");
var smodel_utils_1 = require("../base/model/smodel-utils");
var sgraph_1 = require("./sgraph");
var model_1 = require("../features/button/model");
var SGraphFactory = /** @class */ (function (_super) {
    __extends(SGraphFactory, _super);
    function SGraphFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SGraphFactory.prototype.createElement = function (schema, parent) {
        var child;
        if (this.registry.hasKey(schema.type)) {
            var regElement = this.registry.get(schema.type, undefined);
            if (!(regElement instanceof smodel_1.SChildElement))
                throw new Error("Element with type " + schema.type + " was expected to be an SChildElement.");
            child = regElement;
        }
        else if (this.isNodeSchema(schema)) {
            child = new sgraph_1.SNode();
        }
        else if (this.isPortSchema(schema)) {
            child = new sgraph_1.SPort();
        }
        else if (this.isEdgeSchema(schema)) {
            child = new sgraph_1.SEdge();
        }
        else if (this.isLabelSchema(schema)) {
            child = new sgraph_1.SLabel();
        }
        else if (this.isCompartmentSchema(schema)) {
            child = new sgraph_1.SCompartment();
        }
        else if (this.isButtonSchema(schema)) {
            child = new model_1.SButton();
        }
        else {
            child = new smodel_1.SChildElement();
        }
        return this.initializeChild(child, schema, parent);
    };
    SGraphFactory.prototype.createRoot = function (schema) {
        var root;
        if (this.registry.hasKey(schema.type)) {
            var regElement = this.registry.get(schema.type, undefined);
            if (!(regElement instanceof smodel_1.SModelRoot))
                throw new Error("Element with type " + schema.type + " was expected to be an SModelRoot.");
            root = regElement;
        }
        else if (this.isGraphSchema(schema)) {
            root = new sgraph_1.SGraph();
        }
        else {
            root = new smodel_1.SModelRoot();
        }
        return this.initializeRoot(root, schema);
    };
    SGraphFactory.prototype.isGraphSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'graph';
    };
    SGraphFactory.prototype.isNodeSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'node';
    };
    SGraphFactory.prototype.isPortSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'port';
    };
    SGraphFactory.prototype.isEdgeSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'edge';
    };
    SGraphFactory.prototype.isLabelSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'label';
    };
    SGraphFactory.prototype.isCompartmentSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'comp';
    };
    SGraphFactory.prototype.isButtonSchema = function (schema) {
        return smodel_utils_1.getBasicType(schema) === 'button';
    };
    SGraphFactory = __decorate([
        inversify_1.injectable()
    ], SGraphFactory);
    return SGraphFactory;
}(smodel_factory_1.SModelFactory));
exports.SGraphFactory = SGraphFactory;
