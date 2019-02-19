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
var types_1 = require("../base/types");
var set_model_1 = require("../base/features/set-model");
var svg_exporter_1 = require("../features/export/svg-exporter");
/**
 * A model source is serving the model to the event cycle. It represents
 * the entry point to the client for external sources, such as model
 * editors.
 *
 * As an IActionHandler it listens to actions in and reacts to them with
 * commands or actions if necessary. This way, you can implement action
 * protocols between the client and the outside world.
 *
 * There are two default implementations for a ModelSource:
 * <ul>
 * <li>the LocalModelSource handles the actions to calculate bounds and
 * set/update the model</li>
 * <li>the DiagramServer connects via websocket to a remote source. It
 * can be used to connect to a model editor that provides the model,
 * layouts diagrams, transfers selection and answers model queries from
 * the client.</li>
 */
var ModelSource = /** @class */ (function () {
    function ModelSource(actionDispatcher, actionHandlerRegistry, viewerOptions) {
        this.actionDispatcher = actionDispatcher;
        this.viewerOptions = viewerOptions;
        this.initialize(actionHandlerRegistry);
    }
    ModelSource.prototype.initialize = function (registry) {
        // Register model manipulation commands
        registry.registerCommand(set_model_1.SetModelCommand);
        // Register this model source
        registry.register(set_model_1.RequestModelAction.KIND, this);
        registry.register(svg_exporter_1.ExportSvgAction.KIND, this);
    };
    ModelSource = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.ActionHandlerRegistry)),
        __param(2, inversify_1.inject(types_1.TYPES.ViewerOptions))
    ], ModelSource);
    return ModelSource;
}());
exports.ModelSource = ModelSource;
