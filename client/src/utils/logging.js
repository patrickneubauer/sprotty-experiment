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
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["none"] = 0] = "none";
    LogLevel[LogLevel["error"] = 1] = "error";
    LogLevel[LogLevel["warn"] = 2] = "warn";
    LogLevel[LogLevel["info"] = 3] = "info";
    LogLevel[LogLevel["log"] = 4] = "log";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var NullLogger = /** @class */ (function () {
    function NullLogger() {
        this.logLevel = LogLevel.none;
    }
    NullLogger.prototype.error = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
    };
    NullLogger.prototype.warn = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
    };
    NullLogger.prototype.info = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
    };
    NullLogger.prototype.log = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
    };
    NullLogger = __decorate([
        inversify_1.injectable()
    ], NullLogger);
    return NullLogger;
}());
exports.NullLogger = NullLogger;
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger(logLevel, viewOptions) {
        if (logLevel === void 0) { logLevel = LogLevel.log; }
        if (viewOptions === void 0) { viewOptions = { baseDiv: '' }; }
        this.logLevel = logLevel;
        this.viewOptions = viewOptions;
    }
    ConsoleLogger.prototype.error = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= LogLevel.error)
            try {
                console.error.apply(thisArg, this.consoleArguments(thisArg, message, params));
            }
            catch (error) { }
    };
    ConsoleLogger.prototype.warn = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= LogLevel.warn)
            try {
                console.warn.apply(thisArg, this.consoleArguments(thisArg, message, params));
            }
            catch (error) { }
    };
    ConsoleLogger.prototype.info = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= LogLevel.info)
            try {
                console.info.apply(thisArg, this.consoleArguments(thisArg, message, params));
            }
            catch (error) { }
    };
    ConsoleLogger.prototype.log = function (thisArg, message) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (this.logLevel >= LogLevel.log)
            try {
                console.log.apply(thisArg, this.consoleArguments(thisArg, message, params));
            }
            catch (error) { }
    };
    ConsoleLogger.prototype.consoleArguments = function (thisArg, message, params) {
        var caller;
        if (typeof thisArg === 'object')
            caller = thisArg.constructor.name;
        else
            caller = thisArg;
        var date = new Date();
        return [date.toLocaleTimeString() + ' ' + this.viewOptions.baseDiv + ' ' + caller + ': ' + message].concat(params);
    };
    ConsoleLogger = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.LogLevel)),
        __param(1, inversify_1.inject(types_1.TYPES.ViewerOptions))
    ], ConsoleLogger);
    return ConsoleLogger;
}());
exports.ConsoleLogger = ConsoleLogger;
