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
var types_1 = require("../base/types");
var smodel_1 = require("../base/model/smodel");
var set_model_1 = require("../base/features/set-model");
var update_model_1 = require("../features/update/update-model");
var bounds_manipulation_1 = require("../features/bounds/bounds-manipulation");
var hover_1 = require("../features/hover/hover");
var model_source_1 = require("./model-source");
var svg_exporter_1 = require("../features/export/svg-exporter");
var file_saver_1 = require("file-saver");
var expand_1 = require("../features/expand/expand");
var open_1 = require("../features/open/open");
function isActionMessage(object) {
    return object !== undefined && object.hasOwnProperty('clientId') && object.hasOwnProperty('action');
}
exports.isActionMessage = isActionMessage;
/**
 * Sent by the external server when to signal a state change.
 */
var ServerStatusAction = /** @class */ (function () {
    function ServerStatusAction() {
        this.kind = ServerStatusAction.KIND;
    }
    ServerStatusAction.KIND = 'serverStatus';
    return ServerStatusAction;
}());
exports.ServerStatusAction = ServerStatusAction;
var receivedFromServerProperty = '__receivedFromServer';
/**
 * A ModelSource that communicates with an external model provider, e.g.
 * a model editor.
 *
 * This class defines which actions are sent to and received from the
 * external model source.
 */
var DiagramServer = /** @class */ (function (_super) {
    __extends(DiagramServer, _super);
    function DiagramServer(actionDispatcher, actionHandlerRegistry, viewerOptions, storage, logger) {
        var _this = _super.call(this, actionDispatcher, actionHandlerRegistry, viewerOptions) || this;
        _this.storage = storage;
        _this.logger = logger;
        _this.currentRoot = {
            type: 'NONE',
            id: 'ROOT'
        };
        _this.clientId = _this.viewerOptions.baseDiv;
        return _this;
    }
    DiagramServer.prototype.initialize = function (registry) {
        _super.prototype.initialize.call(this, registry);
        // Register model manipulation commands
        registry.registerCommand(update_model_1.UpdateModelCommand);
        // Register this model source
        registry.register(bounds_manipulation_1.ComputedBoundsAction.KIND, this);
        registry.register(bounds_manipulation_1.RequestBoundsCommand.KIND, this);
        registry.register(hover_1.RequestPopupModelAction.KIND, this);
        registry.register(expand_1.CollapseExpandAction.KIND, this);
        registry.register(expand_1.CollapseExpandAllAction.KIND, this);
        registry.register(open_1.OpenAction.KIND, this);
        registry.register(ServerStatusAction.KIND, this);
    };
    DiagramServer.prototype.handle = function (action) {
        var forwardToServer = this.handleLocally(action);
        if (forwardToServer) {
            var message = {
                clientId: this.clientId,
                action: action
            };
            this.logger.log(this, 'sending', message);
            this.sendMessage(message);
        }
    };
    DiagramServer.prototype.messageReceived = function (data) {
        var _this = this;
        var object = typeof (data) === 'string' ? JSON.parse(data) : data;
        if (isActionMessage(object) && object.action) {
            if (!object.clientId || object.clientId === this.clientId) {
                object.action[receivedFromServerProperty] = true;
                this.logger.log(this, 'receiving', object);
                this.actionDispatcher.dispatch(object.action).then(function () {
                    _this.storeNewModel(object.action);
                });
            }
        }
        else {
            this.logger.error(this, 'received data is not an action message', object);
        }
    };
    /**
     * Check whether the given action should be handled locally. Returns true if the action should
     * still be sent to the server, and false if it's only handled locally.
     */
    DiagramServer.prototype.handleLocally = function (action) {
        this.storeNewModel(action);
        switch (action.kind) {
            case bounds_manipulation_1.ComputedBoundsAction.KIND:
                return this.handleComputedBounds(action);
            case bounds_manipulation_1.RequestBoundsCommand.KIND:
                return false;
            case svg_exporter_1.ExportSvgAction.KIND:
                return this.handleExportSvgAction(action);
            case ServerStatusAction.KIND:
                return this.handleServerStateAction(action);
        }
        return !action[receivedFromServerProperty];
    };
    /**
     * Put the new model contained in the given action into the model storage, if there is any.
     */
    DiagramServer.prototype.storeNewModel = function (action) {
        if (action.kind === set_model_1.SetModelCommand.KIND
            || action.kind === update_model_1.UpdateModelCommand.KIND
            || action.kind === bounds_manipulation_1.RequestBoundsCommand.KIND) {
            var newRoot = action.newRoot;
            if (newRoot) {
                this.currentRoot = newRoot;
                if (action.kind === set_model_1.SetModelCommand.KIND || action.kind === update_model_1.UpdateModelCommand.KIND) {
                    this.lastSubmittedModelType = newRoot.type;
                }
                this.storage.store(this.currentRoot);
            }
        }
    };
    /**
     * If the server requires to compute a layout, the computed bounds are forwarded. Otherwise they
     * are applied to the current model locally and a model update is triggered.
     */
    DiagramServer.prototype.handleComputedBounds = function (action) {
        if (this.viewerOptions.needsServerLayout) {
            return true;
        }
        else {
            var index = new smodel_1.SModelIndex();
            var root = this.currentRoot;
            index.add(root);
            for (var _i = 0, _a = action.bounds; _i < _a.length; _i++) {
                var b = _a[_i];
                var element = index.getById(b.elementId);
                if (element !== undefined)
                    this.applyBounds(element, b.newBounds);
            }
            if (action.alignments !== undefined) {
                for (var _b = 0, _c = action.alignments; _b < _c.length; _b++) {
                    var a = _c[_b];
                    var element = index.getById(a.elementId);
                    if (element !== undefined)
                        this.applyAlignment(element, a.newAlignment);
                }
            }
            if (root.type === this.lastSubmittedModelType) {
                this.actionDispatcher.dispatch(new update_model_1.UpdateModelAction(root));
            }
            else {
                this.actionDispatcher.dispatch(new set_model_1.SetModelAction(root));
            }
            this.lastSubmittedModelType = root.type;
            return false;
        }
    };
    DiagramServer.prototype.applyBounds = function (element, newBounds) {
        var e = element;
        e.position = { x: newBounds.x, y: newBounds.y };
        e.size = { width: newBounds.width, height: newBounds.height };
    };
    DiagramServer.prototype.applyAlignment = function (element, newAlignment) {
        var e = element;
        e.alignment = { x: newAlignment.x, y: newAlignment.y };
    };
    DiagramServer.prototype.handleExportSvgAction = function (action) {
        var blob = new Blob([action.svg], { type: "text/plain;charset=utf-8" });
        file_saver_1.saveAs(blob, "diagram.svg");
        return false;
    };
    DiagramServer.prototype.handleServerStateAction = function (action) {
        return false;
    };
    DiagramServer = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.ActionHandlerRegistry)),
        __param(2, inversify_1.inject(types_1.TYPES.ViewerOptions)),
        __param(3, inversify_1.inject(types_1.TYPES.SModelStorage)),
        __param(4, inversify_1.inject(types_1.TYPES.ILogger))
    ], DiagramServer);
    return DiagramServer;
}(model_source_1.ModelSource));
exports.DiagramServer = DiagramServer;
