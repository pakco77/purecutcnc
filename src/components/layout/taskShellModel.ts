/**
 * Copyright 2026 Franja (Frank) Povazanj
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getStockBounds, type Project } from '../../types/project'

export const TASK_IDS = [
  'workpiece',
  'workflow',
  'import',
  'stock',
  'geometry',
  'operations',
  'fixtures',
  'tabs',
  'origin',
] as const

export type TaskId = (typeof TASK_IDS)[number] | 'machine'

export type WorkflowStepId =
  | 'file'
  | 'material'
  | 'shape'
  | 'strategy'
  | 'operations'
  | 'machine'
  | 'carve'

export interface WorkflowStepState {
  id: WorkflowStepId
  complete: boolean
  unavailable: boolean
}

export interface TaskShellFacts {
  enabledOperationCount: number
  generatedOperationCount: number
  machineConfigured: boolean
  machineName: string | null
  workflow: WorkflowStepState[]
}

/**
 * Derive shell progress from saved project facts only. Machine readiness and
 * carving deliberately remain unavailable because PureCut has no controller
 * connection or live machine evidence.
 */
export function deriveTaskShellFacts(
  project: Project,
  generatedOperationIds: ReadonlySet<string>,
): TaskShellFacts {
  const enabledOperations = project.operations.filter((operation) => operation.enabled)
  const generatedOperationCount = enabledOperations.filter((operation) => generatedOperationIds.has(operation.id)).length
  const machine = project.meta.machineDefinitions.find(
    (definition) => definition.id === project.meta.selectedMachineId,
  ) ?? null

  const stockBounds = getStockBounds(project.stock)
  const hasFileContent = project.features.length > 0
  const hasValidStock = stockBounds.maxX > stockBounds.minX
    && stockBounds.maxY > stockBounds.minY
    && project.stock.thickness > 0
    && project.stock.material.trim().length > 0
  const hasOperations = enabledOperations.length > 0
  const hasGeneratedAllOperations = hasOperations && generatedOperationCount === enabledOperations.length

  return {
    enabledOperationCount: enabledOperations.length,
    generatedOperationCount,
    machineConfigured: machine !== null,
    machineName: machine?.name ?? null,
    workflow: [
      { id: 'file', complete: hasFileContent, unavailable: false },
      { id: 'material', complete: hasValidStock, unavailable: false },
      { id: 'shape', complete: hasFileContent, unavailable: false },
      { id: 'strategy', complete: hasOperations, unavailable: false },
      { id: 'operations', complete: hasGeneratedAllOperations, unavailable: false },
      { id: 'machine', complete: false, unavailable: true },
      { id: 'carve', complete: false, unavailable: true },
    ],
  }
}
