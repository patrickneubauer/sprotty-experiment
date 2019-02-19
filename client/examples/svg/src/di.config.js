"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var src_1 = require("../../../src");
exports["default"] = (function () {
    var svgModule = new inversify_1.ContainerModule(function (bind, unbind, isBound, rebind) {
        rebind(src_1.TYPES.ILogger).to(src_1.ConsoleLogger).inSingletonScope();
        rebind(src_1.TYPES.LogLevel).toConstantValue(src_1.LogLevel.log);
        bind(src_1.TYPES.ModelSource).to(src_1.LocalModelSource).inSingletonScope();
        var context = { bind: bind, unbind: unbind, isBound: isBound, rebind: rebind };
        src_1.configureModelElement(context, 'svg', src_1.ViewportRootElement, src_1.SvgViewportView);
        src_1.configureModelElement(context, 'pre-rendered', src_1.ShapedPreRenderedElement, src_1.PreRenderedView);
    });
    var container = new inversify_1.Container();
    container.load(src_1.defaultModule, src_1.selectModule, src_1.moveModule, src_1.boundsModule, src_1.undoRedoModule, src_1.viewportModule, src_1.hoverModule, src_1.exportModule, svgModule);
    return container;
});
