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
var WebSocket = require("reconnecting-websocket");
function getXtextServices() {
    return window.xtextServices;
}
var SelectionHandler = /** @class */ (function () {
    function SelectionHandler() {
    }
    SelectionHandler.prototype.handle = function (action) {
        var xtextService = getXtextServices();
        if (xtextService !== undefined) {
            var selectedElement = action.selectedElementsIDs.length > 0 ? action.selectedElementsIDs[0] : 'flow';
            xtextService.select({
                elementId: selectedElement,
                modelType: 'flow'
            });
        }
    };
    return SelectionHandler;
}());
function setupFlow(websocket) {
    var container = di_config_1["default"](true);
    // Set up selection handling
    var actionHandlerRegistry = container.get(src_1.TYPES.ActionHandlerRegistry);
    actionHandlerRegistry.register(src_1.SelectCommand.KIND, new SelectionHandler());
    // Connect to the diagram server
    var diagramServer = container.get(src_1.TYPES.ModelSource);
    diagramServer.listen(websocket);
    websocket.addEventListener('open', function (event) {
        // Run
        function run() {
            var xtextServices = getXtextServices();
            if (xtextServices !== undefined) {
                var resourceId = xtextServices.options.resourceId;
                diagramServer.clientId = resourceId + '_flow';
                diagramServer.handle(new src_1.RequestModelAction({
                    resourceId: resourceId,
                    needsClientLayout: 'false'
                }));
            }
            else {
                setTimeout(run, 50);
            }
        }
        run();
    });
}
exports.setupFlow = setupFlow;
function runFlowServer() {
    var websocket = new WebSocket('ws://' + window.location.host + '/diagram');
    setupFlow(websocket);
}
exports["default"] = runFlowServer;
