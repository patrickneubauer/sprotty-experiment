/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.diagram

import com.google.common.collect.BiMap
import com.google.common.collect.HashBiMap
import com.google.inject.Singleton
import io.typefox.sprotty.api.LayoutOptions
import io.typefox.sprotty.api.SCompartment
import io.typefox.sprotty.api.SLabel
import io.typefox.sprotty.api.SModelElement
import java.util.ArrayList
import java.util.Set
import org.eclipse.emf.ecore.EObject
import org.eclipse.xtext.util.CancelIndicator

import static io.typefox.sprotty.api.SModelUtil.*

import static extension org.eclipse.xtext.EcoreUtil2.*
import org.eclipse.scava.crossflow.language.xtext.crossflow.Workflow
import org.eclipse.scava.crossflow.language.xtext.crossflow.Task

@Singleton
class CrossflowDiagramGenerator {
	
//	private def createInfoCompartment(TaskAllocation task, int coreIndex, int kernelIndex) {
//		val result = <SModelElement>newArrayList
//		// hack: find better way to determine if task has finished
//		if (task.programCounter.equals('0xFFFF')) {
//			result += create(SLabel, 't_' + coreIndex, 'label:info') [
//				text = 'task: ' + task.task.name 
//			]
//			result += create(SLabel, 'f_' + coreIndex, 'label:info') [
//				text =  'Task Finished' 
//			]
//		} else {
//			val stackBeginAddr = Integer.parseInt(task.task.kernel.stackBeginAddr.substring(2), 16) as int
//			val currentStackPointer = Integer.parseInt(task.stackPointer.substring(2), 16) as int
//			result += create(SLabel, 't_' + coreIndex, 'label:info') [
//				text = 'task: ' + task.task.name
//			]
//			result += create(SLabel, 'f_' + coreIndex, 'label:info') [
//				text = 'file: ' + task.sourceFile
//			]
//			result += create(SLabel, 'pc_' + coreIndex, 'label:info') [
//				text = '$pc: ' + task.programCounter
//			]
//			result += create(SLabel, 'sp_' + coreIndex, 'label:info') [
//				text = '$sp: ' + task.stackPointer
//			]
//			result += create(SLabel, 'st_' + coreIndex, 'label:info') [
//				text = 'stack used: ' + (stackBeginAddr - currentStackPointer) //+ ' (' + percentStackUsedFormatted + '%)' 
//			]
//		}
//		return create(SCompartment, 'comp_' + coreIndex, 'comp') [
////			layout = 'vbox'
//			layout = 'hbox'
//			layoutOptions = new LayoutOptions [
//				HAlign = 'left'
//				resizeContainer = true
//				paddingLeft = 5.0
//				paddingRight = 5.0
//				
//			]
//			children = result
//		]
//	}
	
//	private def createChannel(int rowParam, int columnParam, CoreDirection directionParam) {
//	    val pos = rowParam + '_' + columnParam
//	    create(Channel, 'channel_' + directionParam + '_' + pos, 'channel') [
//	        column = columnParam
//	        row = rowParam
//	        direction = directionParam
//	    ]
//	}
	
//	private def createCrossbar(CoreDirection directionParam) {
//		create(Crossbar, 'cb_' + directionParam, 'crossbar') [
//	    	direction = directionParam
//		]
//	}

	
	
	def BiMap<EObject, SModelElement> generateFlowView(Workflow workflow, EObject selection, CancelIndicator cancelIndicator) {
//		val kernels = workflow.declarations.filter(Kernel).toList
		
		val BiMap<EObject, SModelElement> mapping = HashBiMap.create()
		val crossflow = create(Crossflow, 'crossflow', 'crossflow') [
			children = new ArrayList
		]
		mapping.put(workflow, crossflow)
		if (workflow !== null) {
//			val step = selection.getContainerOfType(Step)
//			val allocation = selection.getContainerOfType(TaskAllocation)
//			val assignedFlowIds = newHashSet
			// Transform tasks
			for (task : workflow.tasks) {
//				var kernelIndex = kernels.toList.indexOf(declaration.kernel)
				val tnode = createTask(task)
				mapping.put(task, tnode)
				crossflow.children += tnode
			}
			
			// Transform flows
			for (stream : workflow.streams) {
				for (Task inputTask : stream.inputOf) {
					for (Task outputTask : stream.outputOf) {
						val edge = createFlow(mapping.get(inputTask), mapping.get(outputTask), stream.name)
						crossflow.children += edge
					}
				}
			}
		}
		return mapping
	}
	
	
//	def BiMap<EObject, SModelElement> generateFlowView(Program program, EObject selection, CancelIndicator cancelIndicator) {
//		val kernels = program.declarations.filter(Kernel).toList
//		
//		val BiMap<EObject, SModelElement> mapping = HashBiMap.create()
//		val flow = create(Flow, 'flow', 'flow') [
//			children = new ArrayList
//		]
//		mapping.put(program, flow)
//		if (program !== null) {
//			val step = selection.getContainerOfType(Step)
//			val allocation = selection.getContainerOfType(TaskAllocation)
//			val assignedFlowIds = newHashSet
//			// Transform tasks
//			for (declaration : program.declarations.filter(Task)) {
//				var kernelIndex = kernels.toList.indexOf(declaration.kernel)
//				val tnode = createTask(declaration, step, allocation, kernelIndex)
//				mapping.put(declaration, tnode)
//				flow.children += tnode
//			}
//			// Transform barriers
//			for (declaration : program.declarations.filter(Barrier)) {
//				val bnode = createBarrier(declaration)
//				mapping.put(declaration, bnode)
//				flow.children += bnode
//				for (triggered : declaration.triggered) {
//					var kernelIndex = kernels.toList.indexOf(triggered.kernel)
//					val tnode = createTask(triggered, step, allocation, kernelIndex)
//					mapping.put(triggered, tnode)
//					flow.children += tnode
//				}
//			}
//			// Transform flows
//			for (declaration : program.declarations.filter(Barrier)) {
//				declaration.joined.forEach[ joined, k |
//					val edge = createFlow(mapping.get(joined)?.id, mapping.get(declaration)?.id, assignedFlowIds)
//					edge.targetIndex = k
//					flow.children += edge
//				]
//				val edgeCount = declaration.joined.size + declaration.triggered.size
//				declaration.triggered.forEach[ triggered, k |
//					val edge = createFlow(mapping.get(declaration)?.id, mapping.get(triggered)?.id, assignedFlowIds)
//					edge.sourceIndex = edgeCount - k
//					flow.children += edge
//				]
//			}
//		}
//		return mapping
//	}

	private def createTask(Task task) {
		val tnode = create(TaskNode, 'task_' + task.name, 'task')
		tnode.name = task.name
		return tnode
	}
	
//	private def createTask(Task declaration, Step step, TaskAllocation taskAllocation, int kernelIndex) {
//		val tnode = create(TaskNode, 'task_' + declaration.name, 'task')
//		tnode.name = declaration.name
//		tnode.kernelNr = kernelIndex
//		if (step !== null) {
//			if (step.allocations.filter(TaskRunning).exists[task == declaration])
//				tnode.status = 'running'
//			else if (step.allocations.filter(TaskFinished).exists[task == declaration])
//				tnode.status = 'finished'
//			if (taskAllocation !== null && taskAllocation.task == declaration)
//				tnode.selected = true
//		}
//		return tnode
//	}
	
//	private def createBarrier(Barrier declaration) {
//		create(BarrierNode, 'barrier_' + declaration.name, 'barrier') [
//			name = declaration.name
//		]
//	}
	
	private def createFlow(SModelElement sourceTask, SModelElement targetTask, String name) {
		val edge = create(Stream, name, 'edge')
		edge.sourceTask = sourceTask as TaskNode
		edge.targetTask = targetTask as TaskNode
		return edge
	}
	
}