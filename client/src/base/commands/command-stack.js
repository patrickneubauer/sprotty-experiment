"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var types_1 = require("../types");
var smodel_factory_1 = require("../model/smodel-factory");
var command_1 = require("./command");
/**
 * The implementation of the ICommandStack. Clients should not use this
 * class directly.
 *
 * The command stack holds the current model as the result of the current
 * promise. When a new command is executed/undone/redone, its execution is
 * chained using <code>Promise#then()</code> to the current Promise. This
 * way we can handle long running commands without blocking the current
 * thread.
 *
 * The command stack also does the special handling for special commands:
 *
 * System commands should be transparent to the user and as such be
 * automatically undone/redone with the next plain command. Additional care
 * must be taken that system commands that are executed after undo don't
 * break the correspondence between the topmost commands on the undo and
 * redo stacks.
 *
 * Hidden commands only tell the viewer to render a hidden model such that
 * its bounds can be extracted from the DOM and forwarded as separate actions.
 * Hidden commands should not leave any trace on the undo/redo/off stacks.
 *
 * Mergeable commands should be merged with their predecessor if possible,
 * such that e.g. multiple subsequent moves of the smae element can be undone
 * in one single step.
 */
var CommandStack = /** @class */ (function () {
    function CommandStack(modelFactory, viewerProvider, logger, syncer, options) {
        this.modelFactory = modelFactory;
        this.viewerProvider = viewerProvider;
        this.logger = logger;
        this.syncer = syncer;
        this.options = options;
        this.undoStack = [];
        this.redoStack = [];
        /**
         * System commands should be transparent to the user in undo/redo
         * operations. When a system command is executed when the redo
         * stack is not empty, it is pushed to offStack instead.
         *
         * On redo, all commands form this stack are undone such that the
         * redo operation gets the exact same model as when it was executed
         * first.
         *
         * On undo, all commands form this stack are undone as well as
         * system ommands should be transparent to the user.
         */
        this.offStack = [];
        this.currentPromise = Promise.resolve({
            root: modelFactory.createRoot(smodel_factory_1.EMPTY_ROOT),
            hiddenRoot: undefined,
            popupRoot: undefined,
            rootChanged: false,
            hiddenRootChanged: false,
            popupChanged: false
        });
    }
    Object.defineProperty(CommandStack.prototype, "currentModel", {
        get: function () {
            return this.currentPromise.then(function (state) { return state.root; });
        },
        enumerable: true,
        configurable: true
    });
    CommandStack.prototype.executeAll = function (commands) {
        var _this = this;
        commands.forEach(function (command) {
            _this.logger.log(_this, 'Executing', command);
            _this.handleCommand(command, command.execute, _this.mergeOrPush);
        });
        return this.thenUpdate();
    };
    CommandStack.prototype.execute = function (command) {
        this.logger.log(this, 'Executing', command);
        this.handleCommand(command, command.execute, this.mergeOrPush);
        return this.thenUpdate();
    };
    CommandStack.prototype.undo = function () {
        var _this = this;
        this.undoOffStackSystemCommands();
        this.undoPreceedingSystemCommands();
        var command = this.undoStack.pop();
        if (command !== undefined) {
            this.logger.log(this, 'Undoing', command);
            this.handleCommand(command, command.undo, function (c, context) {
                _this.redoStack.push(c);
            });
        }
        return this.thenUpdate();
    };
    CommandStack.prototype.redo = function () {
        var _this = this;
        this.undoOffStackSystemCommands();
        var command = this.redoStack.pop();
        if (command !== undefined) {
            this.logger.log(this, 'Redoing', command);
            this.handleCommand(command, command.redo, function (c, context) {
                _this.pushToUndoStack(c);
            });
        }
        this.redoFollowingSystemCommands();
        return this.thenUpdate();
    };
    /**
     * Chains the current promise with another Promise that performs the
     * given operation on the given command.
     *
     * @param beforeResolve a function that is called directly before
     * resolving the Promise to return the new model. Usually puts the
     * command on the appropriate stack.
     */
    CommandStack.prototype.handleCommand = function (command, operation, beforeResolve) {
        var _this = this;
        this.currentPromise = this.currentPromise.then(function (state) {
            return new Promise(function (resolve, reject) {
                var context = _this.createContext(state.root);
                var newResult;
                try {
                    newResult = operation.call(command, context);
                }
                catch (error) {
                    _this.logger.error(_this, "Failed to execute command:", error);
                    newResult = state.root;
                }
                if (command instanceof command_1.HiddenCommand) {
                    resolve(__assign({}, state, {
                        hiddenRoot: newResult,
                        hiddenRootChanged: true
                    }));
                }
                else if (command instanceof command_1.PopupCommand) {
                    resolve(__assign({}, state, {
                        popupRoot: newResult,
                        popupChanged: true
                    }));
                }
                else if (newResult instanceof Promise) {
                    newResult.then(function (newModel) {
                        beforeResolve.call(_this, command, context);
                        resolve(__assign({}, state, {
                            root: newModel,
                            rootChanged: true
                        }));
                    });
                }
                else {
                    beforeResolve.call(_this, command, context);
                    resolve(__assign({}, state, {
                        root: newResult,
                        rootChanged: true
                    }));
                }
            });
        });
    };
    CommandStack.prototype.pushToUndoStack = function (command) {
        this.undoStack.push(command);
        if (this.options.undoHistoryLimit >= 0 && this.undoStack.length > this.options.undoHistoryLimit)
            this.undoStack.splice(0, this.undoStack.length - this.options.undoHistoryLimit);
    };
    /**
     * Notifies the Viewer to render the new model and/or the new hidden model
     * and returns a Promise for the new model.
     */
    CommandStack.prototype.thenUpdate = function () {
        var _this = this;
        this.currentPromise = this.currentPromise.then(function (state) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(state.hiddenRootChanged && state.hiddenRoot !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateHidden(state.hiddenRoot)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!state.rootChanged) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.update(state.root)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(state.popupChanged && state.popupRoot !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.updatePopup(state.popupRoot)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, {
                            root: state.root,
                            hiddenRoot: undefined,
                            popupRoot: undefined,
                            rootChanged: false,
                            hiddenRootChanged: false,
                            popupChanged: false
                        }];
                }
            });
        }); });
        return this.currentModel;
    };
    /**
     * Notify the <code>Viewer</code> that the model has changed.
     */
    CommandStack.prototype.update = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.viewer === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.viewerProvider()];
                    case 1:
                        _a.viewer = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.viewer.update(model);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Notify the <code>Viewer</code> that the hidden model has changed.
     */
    CommandStack.prototype.updateHidden = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.viewer === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.viewerProvider()];
                    case 1:
                        _a.viewer = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.viewer.updateHidden(model);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Notify the <code>Viewer</code> that the model has changed.
     */
    CommandStack.prototype.updatePopup = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.viewer === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.viewerProvider()];
                    case 1:
                        _a.viewer = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.viewer.updatePopup(model);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handling of commands after their execution.
     *
     * Hidden commands are not pushed to any stack.
     *
     * System commands are pushed to the <code>offStack</code> when the redo
     * stack is not empty, allowing to undo the before a redo to keep the chain
     * of commands consistent.
     *
     * Mergable commands are merged if possible.
     */
    CommandStack.prototype.mergeOrPush = function (command, context) {
        var _this = this;
        if (command instanceof command_1.HiddenCommand)
            return;
        if (command instanceof command_1.SystemCommand && this.redoStack.length > 0) {
            this.offStack.push(command);
        }
        else {
            this.offStack.forEach(function (c) { return _this.undoStack.push(c); });
            this.offStack = [];
            this.redoStack = [];
            if (this.undoStack.length > 0) {
                var lastCommand = this.undoStack[this.undoStack.length - 1];
                if (lastCommand instanceof command_1.MergeableCommand && lastCommand.merge(command, context))
                    return;
            }
            this.pushToUndoStack(command);
        }
    };
    /**
     * Reverts all system commands on the offStack.
     */
    CommandStack.prototype.undoOffStackSystemCommands = function () {
        var command = this.offStack.pop();
        while (command !== undefined) {
            this.logger.log(this, 'Undoing off-stack', command);
            this.handleCommand(command, command.undo, function () { });
            command = this.offStack.pop();
        }
    };
    /**
     * System commands should be transparent to the user, so this method
     * is called from <code>undo()</code> to revert all system commands
     * at the top of the undoStack.
     */
    CommandStack.prototype.undoPreceedingSystemCommands = function () {
        var _this = this;
        var command = this.undoStack[this.undoStack.length - 1];
        while (command !== undefined && command instanceof command_1.SystemCommand) {
            this.undoStack.pop();
            this.logger.log(this, 'Undoing', command);
            this.handleCommand(command, command.undo, function (c, context) {
                _this.redoStack.push(c);
            });
            command = this.undoStack[this.undoStack.length - 1];
        }
    };
    /**
     * System commands should be transparent to the user, so this method
     * is called from <code>redo()</code> to re-execute all system commands
     * at the top of the redoStack.
     */
    CommandStack.prototype.redoFollowingSystemCommands = function () {
        var _this = this;
        var command = this.redoStack[this.redoStack.length - 1];
        while (command !== undefined && command instanceof command_1.SystemCommand) {
            this.redoStack.pop();
            this.logger.log(this, 'Redoing ', command);
            this.handleCommand(command, command.redo, function (c, context) {
                _this.pushToUndoStack(c);
            });
            command = this.redoStack[this.redoStack.length - 1];
        }
    };
    /**
     * Assembles the context object that is passed to the commands execution method.
     */
    CommandStack.prototype.createContext = function (currentModel) {
        return {
            root: currentModel,
            modelChanged: this,
            modelFactory: this.modelFactory,
            duration: this.options.defaultDuration,
            logger: this.logger,
            syncer: this.syncer
        };
    };
    CommandStack = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.IModelFactory)),
        __param(1, inversify_1.inject(types_1.TYPES.IViewerProvider)),
        __param(2, inversify_1.inject(types_1.TYPES.ILogger)),
        __param(3, inversify_1.inject(types_1.TYPES.AnimationFrameSyncer)),
        __param(4, inversify_1.inject(types_1.TYPES.CommandStackOptions))
    ], CommandStack);
    return CommandStack;
}());
exports.CommandStack = CommandStack;
