"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../../base/types");
var export_1 = require("./export");
var svg_exporter_1 = require("./svg-exporter");
var exportSvgModule = new inversify_1.ContainerModule(function (bind) {
    bind(types_1.TYPES.KeyListener).to(export_1.ExportSvgKeyListener).inSingletonScope();
    bind(types_1.TYPES.HiddenVNodeDecorator).to(export_1.ExportSvgDecorator).inSingletonScope();
    bind(types_1.TYPES.ICommand).toConstructor(export_1.ExportSvgCommand);
    bind(types_1.TYPES.SvgExporter).to(svg_exporter_1.SvgExporter).inSingletonScope();
});
exports["default"] = exportSvgModule;
