/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.diagram

import io.typefox.sprotty.api.Bounds
import io.typefox.sprotty.api.HtmlRoot
import io.typefox.sprotty.api.IDiagramServer
import io.typefox.sprotty.api.IPopupModelFactory
import io.typefox.sprotty.api.PreRenderedElement
import io.typefox.sprotty.api.RequestPopupModelAction
import io.typefox.sprotty.api.SModelElement
//import io.typefox.sprotty.example.multicore.multicoreAllocation.Barrier
//import io.typefox.sprotty.example.multicore.multicoreAllocation.Task
//import io.typefox.sprotty.example.multicore.multicoreAllocation.TaskAllocation
import java.util.List
import org.eclipse.scava.crossflow.language.xtext.crossflow.Task

class CrossflowPopupModelFactory implements IPopupModelFactory {
	
	override createPopupModel(SModelElement element, RequestPopupModelAction request, IDiagramServer server) {
		val source = if (server instanceof CrossflowDiagramServer) server.modelMapping.inverse.get(element)
		var String title
		val body = newArrayList
		if (server.model.type == 'crossflow') {
			switch source {
				Task: {
					title = '''Task «source.name»'''
				
				}
				
			}
		}
		if (title !== null) {
			return createPopupModel(title, body, request.bounds)
		}
	}
	
	protected def createPopupModel(String title, List<String> body, Bounds bounds) {
		new HtmlRoot [
			type = 'html'
			id = 'popup'
			children = #[
				new PreRenderedElement[
					type = 'pre-rendered'
					id = 'popup-title'
					code = '''<div class="sprotty-popup-title">«title»</div>'''
				],
				new PreRenderedElement[
					type = 'pre-rendered'
					id = 'popup-body'
					code = '''
						<div class="sprotty-popup-body">
							«FOR text : body»
								<p>«text»</p>
							«ENDFOR»
						</div>
					'''
				]
			]
			canvasBounds = bounds
		]
	}
	
}