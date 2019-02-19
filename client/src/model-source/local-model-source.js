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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var async_1 = require("../utils/async");
var types_1 = require("../base/types");
var smodel_utils_1 = require("../base/model/smodel-utils");
var set_model_1 = require("../base/features/set-model");
var smodel_1 = require("../base/model/smodel");
var bounds_manipulation_1 = require("../features/bounds/bounds-manipulation");
var model_matching_1 = require("../features/update/model-matching");
var update_model_1 = require("../features/update/update-model");
var hover_1 = require("../features/hover/hover");
var model_source_1 = require("./model-source");
var svg_exporter_1 = require("../features/export/svg-exporter");
var file_saver_1 = require("file-saver");
var expand_1 = require("../features/expand/expand");
var diagram_state_1 = require("./diagram-state");
/**
 * A model source that allows to set and modify the model through function calls.
 * This class can be used as a facade over the action-based API of sprotty. It handles
 * actions for bounds calculation and model updates.
 */
var LocalModelSource = /** @class */ (function (_super) {
    __extends(LocalModelSource, _super);
    function LocalModelSource(actionDispatcher, actionHandlerRegistry, viewerOptions, logger, modelProvider, popupModelProvider, layoutEngine) {
        var _this = _super.call(this, actionDispatcher, actionHandlerRegistry, viewerOptions) || this;
        _this.logger = logger;
        _this.modelProvider = modelProvider;
        _this.popupModelProvider = popupModelProvider;
        _this.layoutEngine = layoutEngine;
        _this.currentRoot = {
            type: 'NONE',
            id: 'ROOT'
        };
        _this.diagramState = {
            expansionState: new diagram_state_1.ExpansionState(_this.currentRoot)
        };
        /**
         * When client layout is active, model updates are not applied immediately. Instead the
         * model is rendered on a hidden canvas first to derive actual bounds. The promises listed
         * here are resolved after the new bounds have been applied and the new model state has
         * been actually applied to the visible canvas.
         */
        _this.pendingUpdates = [];
        return _this;
    }
    Object.defineProperty(LocalModelSource.prototype, "model", {
        get: function () {
            return this.currentRoot;
        },
        set: function (root) {
            this.setModel(root);
        },
        enumerable: true,
        configurable: true
    });
    LocalModelSource.prototype.initialize = function (registry) {
        _super.prototype.initialize.call(this, registry);
        // Register model manipulation commands
        registry.registerCommand(update_model_1.UpdateModelCommand);
        // Register this model source
        registry.register(bounds_manipulation_1.ComputedBoundsAction.KIND, this);
        registry.register(hover_1.RequestPopupModelAction.KIND, this);
        registry.register(expand_1.CollapseExpandAction.KIND, this);
        registry.register(expand_1.CollapseExpandAllAction.KIND, this);
    };
    /**
     * Set the model without incremental update.
     */
    LocalModelSource.prototype.setModel = function (newRoot) {
        this.currentRoot = newRoot;
        this.diagramState = {
            expansionState: new diagram_state_1.ExpansionState(newRoot)
        };
        return this.submitModel(newRoot, false);
    };
    /**
     * Apply an incremental update to the model with an animation showing the transition to
     * the new state. If `newRoot` is undefined, the current root is submitted; in that case
     * it is assumed that it has been modified before.
     */
    LocalModelSource.prototype.updateModel = function (newRoot) {
        if (newRoot === undefined) {
            return this.submitModel(this.currentRoot, true);
        }
        else {
            this.currentRoot = newRoot;
            return this.submitModel(newRoot, true);
        }
    };
    /**
     * If client layout is active, run a `RequestBoundsAction` and wait for the resulting
     * `ComputedBoundsAction`, otherwise call `doSubmitModel(…)` directly.
     */
    LocalModelSource.prototype.submitModel = function (newRoot, update) {
        if (this.viewerOptions.needsClientLayout) {
            var deferred = new async_1.Deferred();
            this.pendingUpdates.push(deferred);
            this.actionDispatcher.dispatch(new bounds_manipulation_1.RequestBoundsAction(newRoot));
            return deferred.promise;
        }
        else {
            return this.doSubmitModel(newRoot, update);
        }
    };
    /**
     * Submit the given model with an `UpdateModelAction` or a `SetModelAction` depending on the
     * `update` argument. If available, the model layout engine is invoked first.
     */
    LocalModelSource.prototype.doSubmitModel = function (newRoot, update, index) {
        return __awaiter(this, void 0, void 0, function () {
            var layoutResult, error_1, lastSubmittedModelType, updates, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.layoutEngine !== undefined)) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        layoutResult = this.layoutEngine.layout(newRoot, index);
                        if (!(layoutResult instanceof Promise)) return [3 /*break*/, 3];
                        return [4 /*yield*/, layoutResult];
                    case 2:
                        newRoot = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (layoutResult !== undefined)
                            newRoot = layoutResult;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.logger.error(this, error_1.toString(), error_1.stack);
                        return [3 /*break*/, 6];
                    case 6:
                        lastSubmittedModelType = this.lastSubmittedModelType;
                        this.lastSubmittedModelType = newRoot.type;
                        updates = this.pendingUpdates;
                        this.pendingUpdates = [];
                        if (!(update && newRoot.type === lastSubmittedModelType)) return [3 /*break*/, 8];
                        input = Array.isArray(update) ? update : newRoot;
                        return [4 /*yield*/, this.actionDispatcher.dispatch(new update_model_1.UpdateModelAction(input))];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.actionDispatcher.dispatch(new set_model_1.SetModelAction(newRoot))];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        updates.forEach(function (d) { return d.resolve(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Modify the current model with an array of matches.
     */
    LocalModelSource.prototype.applyMatches = function (matches) {
        var root = this.currentRoot;
        model_matching_1.applyMatches(root, matches);
        return this.submitModel(root, matches);
    };
    /**
     * Modify the current model by adding new elements.
     */
    LocalModelSource.prototype.addElements = function (elements) {
        var matches = [];
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var e = elements_1[_i];
            var anye = e;
            if (anye.element !== undefined && anye.parentId !== undefined) {
                matches.push({
                    right: anye.element,
                    rightParentId: anye.parentId
                });
            }
            else if (anye.id !== undefined) {
                matches.push({
                    right: anye,
                    rightParentId: this.currentRoot.id
                });
            }
        }
        return this.applyMatches(matches);
    };
    /**
     * Modify the current model by removing elements.
     */
    LocalModelSource.prototype.removeElements = function (elements) {
        var matches = [];
        var index = new smodel_1.SModelIndex();
        index.add(this.currentRoot);
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var e = elements_2[_i];
            var anye = e;
            if (anye.elementId !== undefined && anye.parentId !== undefined) {
                var element = index.getById(anye.elementId);
                if (element !== undefined) {
                    matches.push({
                        left: element,
                        leftParentId: anye.parentId
                    });
                }
            }
            else {
                var element = index.getById(anye);
                if (element !== undefined) {
                    matches.push({
                        left: element,
                        leftParentId: this.currentRoot.id
                    });
                }
            }
        }
        return this.applyMatches(matches);
    };
    // ----- Methods for handling incoming actions ----------------------------
    LocalModelSource.prototype.handle = function (action) {
        switch (action.kind) {
            case set_model_1.RequestModelAction.KIND:
                this.handleRequestModel(action);
                break;
            case bounds_manipulation_1.ComputedBoundsAction.KIND:
                this.handleComputedBounds(action);
                break;
            case hover_1.RequestPopupModelAction.KIND:
                this.handleRequestPopupModel(action);
                break;
            case svg_exporter_1.ExportSvgAction.KIND:
                this.handleExportSvgAction(action);
                break;
            case expand_1.CollapseExpandAction.KIND:
                this.handleCollapseExpandAction(action);
                break;
            case expand_1.CollapseExpandAllAction.KIND:
                this.handleCollapseExpandAllAction(action);
                break;
        }
    };
    LocalModelSource.prototype.handleRequestModel = function (action) {
        if (this.modelProvider)
            this.currentRoot = this.modelProvider.getModel(this.diagramState, this.currentRoot);
        this.submitModel(this.currentRoot, false);
    };
    LocalModelSource.prototype.handleComputedBounds = function (action) {
        var root = this.currentRoot;
        var index = new smodel_1.SModelIndex();
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
        this.doSubmitModel(root, true, index);
    };
    LocalModelSource.prototype.applyBounds = function (element, newBounds) {
        var e = element;
        e.position = { x: newBounds.x, y: newBounds.y };
        e.size = { width: newBounds.width, height: newBounds.height };
    };
    LocalModelSource.prototype.applyAlignment = function (element, newAlignment) {
        var e = element;
        e.alignment = { x: newAlignment.x, y: newAlignment.y };
    };
    LocalModelSource.prototype.handleRequestPopupModel = function (action) {
        if (this.popupModelProvider !== undefined) {
            var element = smodel_utils_1.findElement(this.currentRoot, action.elementId);
            var popupRoot = this.popupModelProvider.getPopupModel(action, element);
            if (popupRoot !== undefined) {
                popupRoot.canvasBounds = action.bounds;
                this.actionDispatcher.dispatch(new hover_1.SetPopupModelAction(popupRoot));
            }
        }
    };
    LocalModelSource.prototype.handleExportSvgAction = function (action) {
        var blob = new Blob([action.svg], { type: "text/plain;charset=utf-8" });
        file_saver_1.saveAs(blob, "diagram.svg");
    };
    LocalModelSource.prototype.handleCollapseExpandAction = function (action) {
        if (this.modelProvider !== undefined) {
            this.diagramState.expansionState.apply(action);
            var expandedModel = this.modelProvider.getModel(this.diagramState, this.currentRoot);
            this.updateModel(expandedModel);
        }
    };
    LocalModelSource.prototype.handleCollapseExpandAllAction = function (action) {
        if (this.modelProvider !== undefined) {
            if (action.expand) {
                // Expanding all elements locally is currently not supported
            }
            else {
                this.diagramState.expansionState.collapseAll();
            }
            var expandedModel = this.modelProvider.getModel(this.diagramState, this.currentRoot);
            this.updateModel(expandedModel);
        }
    };
    LocalModelSource = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(1, inversify_1.inject(types_1.TYPES.ActionHandlerRegistry)),
        __param(2, inversify_1.inject(types_1.TYPES.ViewerOptions)),
        __param(3, inversify_1.inject(types_1.TYPES.ILogger)),
        __param(4, inversify_1.inject(types_1.TYPES.StateAwareModelProvider)), __param(4, inversify_1.optional()),
        __param(5, inversify_1.inject(types_1.TYPES.IPopupModelProvider)), __param(5, inversify_1.optional()),
        __param(6, inversify_1.inject(types_1.TYPES.IModelLayoutEngine)), __param(6, inversify_1.optional())
    ], LocalModelSource);
    return LocalModelSource;
}(model_source_1.ModelSource));
exports.LocalModelSource = LocalModelSource;
