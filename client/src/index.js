"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
// ------------------ Base ------------------
__export(require("./base/actions/action"));
__export(require("./base/actions/action-dispatcher"));
__export(require("./base/actions/action-handler"));
__export(require("./base/animations/animation-frame-syncer"));
__export(require("./base/animations/animation"));
__export(require("./base/animations/easing"));
__export(require("./base/commands/command-stack-options"));
__export(require("./base/commands/command-stack"));
__export(require("./base/commands/command"));
__export(require("./base/features/initialize-canvas"));
__export(require("./base/features/set-model"));
__export(require("./base/model/smodel-factory"));
__export(require("./base/model/smodel-storage"));
__export(require("./base/model/smodel-utils"));
__export(require("./base/model/smodel"));
__export(require("./base/views/key-tool"));
__export(require("./base/views/mouse-tool"));
__export(require("./base/views/thunk-view"));
__export(require("./base/views/view"));
__export(require("./base/views/viewer-cache"));
__export(require("./base/views/viewer-options"));
__export(require("./base/views/viewer"));
__export(require("./base/views/vnode-decorators"));
__export(require("./base/views/vnode-utils"));
__export(require("./base/types"));
var di_config_1 = require("./base/di.config");
exports.defaultModule = di_config_1["default"];
// ------------------ Features ------------------
__export(require("./features/bounds/bounds-manipulation"));
__export(require("./features/bounds/layout"));
__export(require("./features/bounds/model"));
__export(require("./features/bounds/vbox-layout"));
__export(require("./features/bounds/hbox-layout"));
__export(require("./features/bounds/stack-layout"));
__export(require("./features/button/button-handler"));
__export(require("./features/button/model"));
__export(require("./features/edit/edit-routing"));
__export(require("./features/edit/model"));
__export(require("./features/expand/expand"));
__export(require("./features/expand/model"));
__export(require("./features/expand/views"));
__export(require("./features/export/export"));
__export(require("./features/export/model"));
__export(require("./features/export/svg-exporter"));
__export(require("./features/fade/fade"));
__export(require("./features/fade/model"));
__export(require("./features/hover/hover"));
__export(require("./features/hover/model"));
__export(require("./features/move/model"));
__export(require("./features/move/move"));
__export(require("./features/open/open"));
__export(require("./features/open/model"));
__export(require("./features/select/model"));
__export(require("./features/select/select"));
__export(require("./features/undo-redo/undo-redo"));
__export(require("./features/update/model-matching"));
__export(require("./features/update/update-model"));
__export(require("./features/viewport/center-fit"));
__export(require("./features/viewport/model"));
__export(require("./features/viewport/scroll"));
__export(require("./features/viewport/viewport-root"));
__export(require("./features/viewport/viewport"));
__export(require("./features/viewport/zoom"));
var di_config_2 = require("./features/move/di.config");
exports.moveModule = di_config_2["default"];
var di_config_3 = require("./features/bounds/di.config");
exports.boundsModule = di_config_3["default"];
var di_config_4 = require("./features/fade/di.config");
exports.fadeModule = di_config_4["default"];
var di_config_5 = require("./features/select/di.config");
exports.selectModule = di_config_5["default"];
var di_config_6 = require("./features/undo-redo/di.config");
exports.undoRedoModule = di_config_6["default"];
var di_config_7 = require("./features/viewport/di.config");
exports.viewportModule = di_config_7["default"];
var di_config_8 = require("./features/hover/di.config");
exports.hoverModule = di_config_8["default"];
var di_config_9 = require("./features/edit/di.config");
exports.edgeEditModule = di_config_9["default"];
var di_config_10 = require("./features/export/di.config");
exports.exportModule = di_config_10["default"];
var di_config_11 = require("./features/expand/di.config");
exports.expandModule = di_config_11["default"];
var di_config_12 = require("./features/open/di.config");
exports.openModule = di_config_12["default"];
var di_config_13 = require("./features/button/di.config");
exports.buttonModule = di_config_13["default"];
// ------------------ Graph ------------------
__export(require("./graph/sgraph-factory"));
__export(require("./graph/sgraph"));
__export(require("./graph/views"));
// ------------------ Library ------------------
__export(require("./lib/generic-views"));
__export(require("./lib/html-views"));
__export(require("./lib/model"));
__export(require("./lib/svg-views"));
// ------------------ Model Source ------------------
__export(require("./model-source/diagram-server"));
__export(require("./model-source/diagram-state"));
__export(require("./model-source/local-model-source"));
__export(require("./model-source/logging"));
__export(require("./model-source/model-source"));
__export(require("./model-source/websocket"));
var di_config_14 = require("./model-source/di.config");
exports.modelSourceModule = di_config_14["default"];
// ------------------ Utilities ------------------
__export(require("./utils/anchors"));
__export(require("./utils/browser"));
__export(require("./utils/color"));
__export(require("./utils/geometry"));
__export(require("./utils/logging"));
__export(require("./utils/registry"));
