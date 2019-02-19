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
var smodel_factory_1 = require("../model/smodel-factory");
var set_model_1 = require("../features/set-model");
var undo_redo_1 = require("../../features/undo-redo/undo-redo");
var action_1 = require("./action");
/**
 * Collects actions, converts them to commands and dispatches them.
 * Also acts as the proxy to model sources such as diagram servers.
 */
var ActionDispatcher = /** @class */ (function () {
    function ActionDispatcher(actionHandlerRegistry, commandStack, logger, syncer) {
        this.actionHandlerRegistry = actionHandlerRegistry;
        this.commandStack = commandStack;
        this.logger = logger;
        this.syncer = syncer;
        this.postponedActions = [];
        this.postponedActions = [];
        var initialCommand = new set_model_1.SetModelCommand(new set_model_1.SetModelAction(smodel_factory_1.EMPTY_ROOT));
        this.blockUntil = initialCommand.blockUntil;
        this.commandStack.execute(initialCommand);
    }
    ActionDispatcher.prototype.dispatchAll = function (actions) {
        var _this = this;
        return Promise.all(actions.map(function (action) { return _this.dispatch(action); }));
    };
    ActionDispatcher.prototype.dispatch = function (action) {
        if (this.blockUntil !== undefined) {
            return this.handleBlocked(action, this.blockUntil);
        }
        else if (action.kind === undo_redo_1.UndoAction.KIND) {
            return this.commandStack.undo().then(function () { });
        }
        else if (action.kind === undo_redo_1.RedoAction.KIND) {
            return this.commandStack.redo().then(function () { });
        }
        else {
            return this.handleAction(action);
        }
    };
    ActionDispatcher.prototype.handleAction = function (action) {
        this.logger.log(this, 'handle', action);
        var handlers = this.actionHandlerRegistry.get(action.kind);
        if (handlers.length > 0) {
            var promises = [];
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var handler = handlers_1[_i];
                var result = handler.handle(action);
                if (action_1.isAction(result)) {
                    promises.push(this.dispatch(result));
                }
                else if (result !== undefined) {
                    promises.push(this.commandStack.execute(result));
                    this.blockUntil = result.blockUntil;
                }
            }
            return Promise.all(promises);
        }
        else {
            this.logger.warn(this, 'Missing handler for action', action);
            return Promise.reject("Missing handler for action '" + action.kind + "'");
        }
    };
    ActionDispatcher.prototype.handleBlocked = function (action, predicate) {
        var _this = this;
        if (predicate(action)) {
            this.blockUntil = undefined;
            var result = this.handleAction(action);
            var actions = this.postponedActions;
            this.postponedActions = [];
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var a = actions_1[_i];
                this.dispatch(a.action).then(a.resolve, a.reject);
            }
            return result;
        }
        else {
            this.logger.log(this, 'Action is postponed due to block condition', action);
            return new Promise(function (resolve, reject) {
                _this.postponedActions.push({ action: action, resolve: resolve, reject: reject });
            });
        }
    };
    ActionDispatcher = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ActionHandlerRegistry)),
        __param(1, inversify_1.inject(types_1.TYPES.ICommandStack)),
        __param(2, inversify_1.inject(types_1.TYPES.ILogger)),
        __param(3, inversify_1.inject(types_1.TYPES.AnimationFrameSyncer))
    ], ActionDispatcher);
    return ActionDispatcher;
}());
exports.ActionDispatcher = ActionDispatcher;
