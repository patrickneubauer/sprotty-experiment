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
exports.__esModule = true;
var types_1 = require("../types");
exports.defaultViewerOptions = function () { return ({
    baseDiv: 'sprotty',
    baseClass: 'sprotty',
    hiddenDiv: 'sprotty-hidden',
    hiddenClass: 'sprotty-hidden',
    popupDiv: 'sprotty-popup',
    popupClass: 'sprotty-popup',
    popupClosedClass: 'sprotty-popup-closed',
    needsClientLayout: true,
    needsServerLayout: false,
    popupOpenDelay: 1000,
    popupCloseDelay: 300
}); };
/**
 * Utility function to partially set viewer options. Default values (from `defaultViewerOptions`) are used for
 * options that are not specified.
 */
function configureViewerOptions(context, options) {
    var opt = __assign({}, exports.defaultViewerOptions(), options);
    if (context.isBound(types_1.TYPES.ViewerOptions))
        context.rebind(types_1.TYPES.ViewerOptions).toConstantValue(opt);
    else
        context.bind(types_1.TYPES.ViewerOptions).toConstantValue(opt);
}
exports.configureViewerOptions = configureViewerOptions;
/**
 * Utility function to partially override the currently configured viewer options in a DI container.
 */
function overrideViewerOptions(container, options) {
    var opt = container.get(types_1.TYPES.ViewerOptions);
    for (var p in options) {
        if (options.hasOwnProperty(p))
            opt[p] = options[p];
    }
    return opt;
}
exports.overrideViewerOptions = overrideViewerOptions;
