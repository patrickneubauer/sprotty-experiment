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
var logging_1 = require("../utils/logging");
var types_1 = require("../base/types");
var LoggingAction = /** @class */ (function () {
    function LoggingAction(severity, time, caller, message, params) {
        this.severity = severity;
        this.time = time;
        this.caller = caller;
        this.message = message;
        this.params = params;
        this.kind = LoggingAction.KIND;
    }
    LoggingAction.KIND = 'logging';
    return LoggingAction;
}());
exports.LoggingAction = LoggingAction;
/**
 * A logger that forwards messages of type 'error', 'warn', and 'info' to the model source.
 */
var ForwardingLogger = /** @class */ (function () {
    function ForwardingLogger(modelSourceProvider, logLevel) {
        this.modelSourceProvider = modelSourceProvider;
        this.logLevel = logLevel;
    }
    ForwardingLogger.prototype.error = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= logging_1.LogLevel.error)
            this.forward(thisArg, message, logging_1.LogLevel.error, params);
    };
    ForwardingLogger.prototype.warn = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= logging_1.LogLevel.warn)
            this.forward(thisArg, message, logging_1.LogLevel.warn, params);
    };
    ForwardingLogger.prototype.info = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= logging_1.LogLevel.info)
            this.forward(thisArg, message, logging_1.LogLevel.info, params);
    };
    ForwardingLogger.prototype.log = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= logging_1.LogLevel.log) {
            // We cannot forward 'log' level messages since that would lead to endless loops
            try {
                var caller = typeof thisArg === 'object' ? thisArg.constructor.name : String(thisArg);
                console.log.apply(thisArg, [caller + ': ' + message].concat(params));
            }
            catch (error) { }
        }
    };
    ForwardingLogger.prototype.forward = function (thisArg, message, logLevel, params) {
        var date = new Date();
        var action = new LoggingAction(logging_1.LogLevel[logLevel], date.toLocaleTimeString(), typeof thisArg === 'object' ? thisArg.constructor.name : String(thisArg), message, params.map(function (p) { return JSON.stringify(p); }));
        this.modelSourceProvider().then(function (modelSource) {
            try {
                modelSource.handle(action);
            }
            catch (error) {
                try {
                    console.log.apply(thisArg, [message, action, error]);
                }
                catch (error) { }
            }
        });
    };
    ForwardingLogger = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ModelSourceProvider)),
        __param(1, inversify_1.inject(types_1.TYPES.LogLevel))
    ], ForwardingLogger);
    return ForwardingLogger;
}());
exports.ForwardingLogger = ForwardingLogger;
