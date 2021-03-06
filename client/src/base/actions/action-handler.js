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
var command_1 = require("../commands/command");
/**
 * The action handler registry maps actions to their handlers using the Action.kind property.
 */
var ActionHandlerRegistry = /** @class */ (function (_super) {
    __extends(ActionHandlerRegistry, _super);
    function ActionHandlerRegistry(initializers) {
        var _this = _super.call(this) || this;
        initializers.forEach(function (initializer) { return _this.initializeActionHandler(initializer); });
        return _this;
    }
    ActionHandlerRegistry.prototype.registerCommand = function (commandType) {
        this.register(commandType.KIND, new command_1.CommandActionHandler(commandType));
    };
    ActionHandlerRegistry.prototype.initializeActionHandler = function (initializer) {
        initializer.initialize(this);
    };
    ActionHandlerRegistry = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.multiInject(types_1.TYPES.IActionHandlerInitializer)), __param(0, inversify_1.optional())
    ], ActionHandlerRegistry);
    return ActionHandlerRegistry;
}(registry_1.MultiInstanceRegistry));
exports.ActionHandlerRegistry = ActionHandlerRegistry;
