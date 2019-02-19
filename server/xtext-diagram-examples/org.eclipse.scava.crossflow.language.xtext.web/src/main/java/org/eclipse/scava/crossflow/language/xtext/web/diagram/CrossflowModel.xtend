/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.diagram

import io.typefox.sprotty.api.SEdge
import io.typefox.sprotty.api.SGraph
import io.typefox.sprotty.api.SNode
import org.eclipse.xtend.lib.annotations.Accessors
import org.eclipse.xtend.lib.annotations.ToString

@Accessors
@ToString(skipNulls = true)
class Crossflow extends SGraph {
	String name
}

@Accessors
@ToString(skipNulls = true)
class TaskNode extends SNode {
	String name
	Boolean selected
}

@Accessors
@ToString(skipNulls = true)
class SourceNode extends TaskNode {
}

@Accessors
@ToString(skipNulls = true)
class SinkNode extends TaskNode {
}

@Accessors
@ToString(skipNulls = true)
class Stream extends SEdge {
	transient TaskNode sourceTask
	transient TaskNode targetTask
	String name
}
