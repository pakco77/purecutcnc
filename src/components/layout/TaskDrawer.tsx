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

import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../../i18n/i18nContext'
import type { MessageKey } from '../../i18n/locales/en'
import { useProjectStore } from '../../store/projectStore'
import { getStockBounds } from '../../types/project'
import { formatLength } from '../../utils/units'
import type { TaskId, TaskShellFacts, WorkflowStepId } from './taskShellModel'

const TASK_TITLE_KEYS: Record<TaskId, MessageKey> = {
  workpiece: 'appShell.task.workpiece',
  workflow: 'appShell.task.workflow',
  import: 'appShell.task.import',
  stock: 'appShell.task.stock',
  geometry: 'appShell.task.geometry',
  operations: 'appShell.task.operations',
  fixtures: 'appShell.task.fixtures',
  tabs: 'appShell.task.tabs',
  origin: 'appShell.task.origin',
  machine: 'appShell.task.machineSetup',
}

const WORKFLOW_STEP_KEYS: Record<WorkflowStepId, MessageKey> = {
  file: 'appShell.workflow.file',
  material: 'appShell.workflow.material',
  shape: 'appShell.workflow.shape',
  strategy: 'appShell.workflow.strategy',
  operations: 'appShell.workflow.operations',
  machine: 'appShell.workflow.machineSetup',
  carve: 'appShell.workflow.carve',
}

interface TaskDrawerProps {
  task: TaskId
  facts: TaskShellFacts
  featureTree: ReactNode
  operationsPanel: ReactNode
  toolsPanel: ReactNode
  onClose: () => void
  onImport: () => void
  onOpenTask: (task: TaskId) => void
  onExportGcode: () => void
}

export function TaskDrawer({
  task,
  facts,
  featureTree,
  operationsPanel,
  toolsPanel,
  onClose,
  onImport,
  onOpenTask,
  onExportGcode,
}: TaskDrawerProps) {
  const { t } = useI18n()
  const [showTools, setShowTools] = useState(false)
  const {
    project,
    selectProject,
    selectStock,
    selectClamp,
    selectTab,
    selectOrigin,
  } = useProjectStore()
  const bounds = getStockBounds(project.stock)
  const stockWidth = bounds.maxX - bounds.minX
  const stockHeight = bounds.maxY - bounds.minY
  const currentStep = facts.workflow.find((step) => !step.complete)?.id ?? 'carve'

  function renderSummaryRow(label: string, value: string) {
    return (
      <div className="task-summary-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    )
  }

  function renderTaskContent() {
    if (task === 'workflow') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.workflow.description')}</p>
          <ol className="workflow-progress" aria-label={t('appShell.workflow.progress')}>
            {facts.workflow.map((step, index) => (
              <li
                key={step.id}
                className={[
                  'workflow-step',
                  step.complete ? 'workflow-step--complete' : '',
                  step.id === currentStep ? 'workflow-step--current' : '',
                  step.unavailable ? 'workflow-step--unavailable' : '',
                ].filter(Boolean).join(' ')}
              >
                <span className="workflow-step__index">{step.complete ? '✓' : index + 1}</span>
                <span className="workflow-step__label">{t(WORKFLOW_STEP_KEYS[step.id])}</span>
                <span className="workflow-step__status">
                  {step.unavailable
                    ? t('appShell.workflow.unavailable')
                    : step.complete
                      ? t('appShell.workflow.complete')
                      : step.id === currentStep
                        ? t('appShell.workflow.current')
                        : t('appShell.workflow.pending')}
                </span>
              </li>
            ))}
          </ol>
          <button
            className="task-primary-action"
            type="button"
            onClick={() => onOpenTask(
              currentStep === 'file' ? 'import'
                : currentStep === 'material' ? 'stock'
                  : currentStep === 'shape' ? 'geometry'
                    : currentStep === 'strategy' || currentStep === 'operations' ? 'operations'
                      : 'machine',
            )}
          >
            {t('appShell.workflow.continue')}
          </button>
        </div>
      )
    }

    if (task === 'workpiece') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.workpiece.description')}</p>
          {renderSummaryRow(t('appShell.summary.geometry'), String(project.features.length))}
          {renderSummaryRow(t('appShell.summary.operations'), String(project.operations.length))}
          {renderSummaryRow(t('appShell.summary.fixtures'), String(project.clamps.length))}
          {renderSummaryRow(t('appShell.summary.tabs'), String(project.tabs.length))}
          <div className="task-action-grid">
            <button type="button" onClick={() => { selectProject(); onOpenTask('workpiece') }}>{t('appShell.workpiece.projectSettings')}</button>
            <button type="button" onClick={() => onOpenTask('stock')}>{t('appShell.task.stock')}</button>
            <button type="button" onClick={() => onOpenTask('geometry')}>{t('appShell.task.geometry')}</button>
          </div>
        </div>
      )
    }

    if (task === 'import') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.import.description')}</p>
          {renderSummaryRow(t('appShell.summary.geometry'), String(project.features.length))}
          <button className="task-primary-action" type="button" onClick={onImport}>
            {t('appShell.import.chooseFile')}
          </button>
          <p className="task-drawer-note">{t('appShell.import.gcodeUnavailable')}</p>
        </div>
      )
    }

    if (task === 'stock') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.stock.description')}</p>
          {renderSummaryRow(t('appShell.stock.material'), project.stock.material)}
          {renderSummaryRow(t('appShell.stock.size'), `${formatLength(stockWidth, project.meta.units)} × ${formatLength(stockHeight, project.meta.units)} × ${formatLength(project.stock.thickness, project.meta.units)} ${project.meta.units}`)}
          <button className="task-primary-action" type="button" onClick={selectStock}>
            {t('appShell.stock.editInspector')}
          </button>
        </div>
      )
    }

    if (task === 'geometry') {
      return <div className="task-drawer-tree">{featureTree}</div>
    }

    if (task === 'operations') {
      return (
        <div className="task-drawer-stack task-drawer-stack--fill">
          <div className="task-operations-summary">
            {renderSummaryRow(t('appShell.operations.enabled'), String(facts.enabledOperationCount))}
            {renderSummaryRow(t('appShell.operations.generated'), `${facts.generatedOperationCount}/${facts.enabledOperationCount}`)}
          </div>
          <div className="task-operations-panel">{operationsPanel}</div>
          <button type="button" onClick={() => setShowTools(true)}>{t('appShell.operations.manageTools')}</button>
          <button type="button" onClick={onExportGcode}>{t('appShell.operations.exportGcode')}</button>
        </div>
      )
    }

    if (task === 'fixtures') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.fixtures.description')}</p>
          {project.clamps.length === 0 ? <p className="task-drawer-note">{t('appShell.fixtures.empty')}</p> : null}
          {project.clamps.map((clamp) => (
            <button className="task-object-row" key={clamp.id} type="button" onClick={() => selectClamp(clamp.id)}>
              <span>{clamp.name}</span>
              <span>{clamp.visible ? t('appShell.object.enabled') : t('appShell.object.hidden')}</span>
            </button>
          ))}
        </div>
      )
    }

    if (task === 'tabs') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.tabs.description')}</p>
          {project.tabs.length === 0 ? <p className="task-drawer-note">{t('appShell.tabs.empty')}</p> : null}
          {project.tabs.map((tab) => (
            <button className="task-object-row" key={tab.id} type="button" onClick={() => selectTab(tab.id)}>
              <span>{tab.name}</span>
              <span>{formatLength(tab.w, project.meta.units)} × {formatLength(tab.h, project.meta.units)}</span>
            </button>
          ))}
        </div>
      )
    }

    if (task === 'origin') {
      return (
        <div className="task-drawer-stack">
          <p className="task-drawer-copy">{t('appShell.origin.description')}</p>
          {renderSummaryRow('X', formatLength(project.origin.x, project.meta.units))}
          {renderSummaryRow('Y', formatLength(project.origin.y, project.meta.units))}
          <button className="task-primary-action" type="button" onClick={selectOrigin}>{t('appShell.origin.editInspector')}</button>
        </div>
      )
    }

    return (
      <div className="task-drawer-stack">
        <div className="machine-safety-boundary">
          <strong>{t('appShell.machine.noLiveControl')}</strong>
          <p>{t('appShell.machine.noLiveControlDescription')}</p>
        </div>
        <ol className="machine-setup-list">
          {[
            'appShell.machine.connect',
            'appShell.machine.secureStock',
            'appShell.machine.installBit',
            'appShell.machine.setZZero',
            'appShell.machine.jogXY',
          ].map((key, index) => (
            <li key={key}>
              <span>{index + 1}</span>
              <span>{t(key as MessageKey)}</span>
              <small>{t('appShell.workflow.unavailable')}</small>
            </li>
          ))}
        </ol>
        <button className="task-primary-action" type="button" onClick={selectProject}>
          {facts.machineConfigured ? t('appShell.machine.changeMachine') : t('appShell.machine.chooseMachine')}
        </button>
      </div>
    )
  }

  return (
    <section className="task-drawer" aria-label={t(TASK_TITLE_KEYS[task])}>
      <header className="task-drawer__header">
        <div>
          <span className="task-drawer__eyebrow">{t('appShell.task.current')}</span>
          <h2>{t(TASK_TITLE_KEYS[task])}</h2>
        </div>
        <button type="button" aria-label={t('appShell.task.close')} onClick={onClose}>×</button>
      </header>
      <div className="task-drawer__content">
        {renderTaskContent()}
      </div>
      {showTools ? createPortal(
        <div className="dialog-backdrop" onClick={() => setShowTools(false)}>
          <div
            className="dialog task-tool-manager"
            role="dialog"
            aria-modal="true"
            aria-label={t('appShell.operations.manageTools')}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-header">
              <h2 className="dialog-title">{t('appShell.operations.manageTools')}</h2>
              <button className="dialog-close" type="button" aria-label={t('appShell.task.close')} onClick={() => setShowTools(false)}>×</button>
            </div>
            <div className="task-tool-manager__body">{toolsPanel}</div>
          </div>
        </div>,
        document.body,
      ) : null}
    </section>
  )
}
