"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var src_1 = require("../../../src");
var di_config_1 = require("./di.config");
function loadFile(path) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', path);
        request.addEventListener('load', function () {
            resolve(request.responseText);
        });
        request.addEventListener('error', function (event) {
            reject(event);
        });
        request.send();
    });
}
function runMulticore() {
    var p1 = loadFile('images/SVG_logo.svg');
    var p2 = loadFile('images/Ghostscript_Tiger.svg');
    Promise.all([p1, p2]).then(function (_a) {
        var svgLogo = _a[0], tiger = _a[1];
        var container = di_config_1["default"]();
        // Initialize model
        var model = {
            type: 'svg',
            id: 'root',
            children: [
                {
                    type: 'pre-rendered',
                    id: 'logo',
                    position: { x: 200, y: 200 },
                    code: svgLogo
                },
                {
                    type: 'pre-rendered',
                    id: 'tiger',
                    position: { x: 400, y: 0 },
                    code: tiger
                }
            ]
        };
        // Run
        var modelSource = container.get(src_1.TYPES.ModelSource);
        modelSource.setModel(model);
    });
}
exports["default"] = runMulticore;
