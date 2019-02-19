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
var types_1 = require("../../base/types");
var registry_1 = require("../../utils/registry");
var geometry_1 = require("../../utils/geometry");
var model_1 = require("./model");
var vbox_layout_1 = require("./vbox-layout");
var hbox_layout_1 = require("./hbox-layout");
var stack_layout_1 = require("./stack-layout");
var LayoutRegistry = /** @class */ (function (_super) {
    __extends(LayoutRegistry, _super);
    function LayoutRegistry() {
        var _this = _super.call(this) || this;
        _this.register(vbox_layout_1.VBoxLayouter.KIND, new vbox_layout_1.VBoxLayouter());
        _this.register(hbox_layout_1.HBoxLayouter.KIND, new hbox_layout_1.HBoxLayouter());
        _this.register(stack_layout_1.StackLayouter.KIND, new stack_layout_1.StackLayouter());
        return _this;
    }
    return LayoutRegistry;
}(registry_1.InstanceRegistry));
exports.LayoutRegistry = LayoutRegistry;
var Layouter = /** @class */ (function () {
    function Layouter(layoutRegistry, logger) {
        this.layoutRegistry = layoutRegistry;
        this.logger = logger;
    }
    Layouter.prototype.layout = function (element2boundsData) {
        new StatefulLayouter(element2boundsData, this.layoutRegistry, this.logger).layout();
    };
    Layouter = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.LayoutRegistry)),
        __param(1, inversify_1.inject(types_1.TYPES.ILogger))
    ], Layouter);
    return Layouter;
}());
exports.Layouter = Layouter;
var StatefulLayouter = /** @class */ (function () {
    function StatefulLayouter(element2boundsData, layoutRegistry, log) {
        var _this = this;
        this.element2boundsData = element2boundsData;
        this.layoutRegistry = layoutRegistry;
        this.log = log;
        this.toBeLayouted = [];
        element2boundsData.forEach(function (data, element) {
            if (model_1.isLayoutContainer(element))
                _this.toBeLayouted.push(element);
        });
    }
    StatefulLayouter.prototype.getBoundsData = function (element) {
        var boundsData = this.element2boundsData.get(element);
        var bounds = element.bounds;
        if (model_1.isLayoutContainer(element) && this.toBeLayouted.indexOf(element) >= 0) {
            bounds = this.doLayout(element);
        }
        if (!boundsData) {
            boundsData = {
                bounds: bounds,
                boundsChanged: false,
                alignmentChanged: false
            };
            this.element2boundsData.set(element, boundsData);
        }
        return boundsData;
    };
    StatefulLayouter.prototype.layout = function () {
        while (this.toBeLayouted.length > 0) {
            var element = this.toBeLayouted[0];
            this.doLayout(element);
        }
    };
    StatefulLayouter.prototype.doLayout = function (element) {
        var index = this.toBeLayouted.indexOf(element);
        if (index >= 0)
            this.toBeLayouted.splice(index, 1);
        var layout = this.layoutRegistry.get(element.layout);
        if (layout)
            layout.layout(element, this);
        var boundsData = this.element2boundsData.get(element);
        if (boundsData !== undefined && boundsData.bounds !== undefined) {
            return boundsData.bounds;
        }
        else {
            this.log.error(element, 'Layout failed');
            return geometry_1.EMPTY_BOUNDS;
        }
    };
    return StatefulLayouter;
}());
exports.StatefulLayouter = StatefulLayouter;
