import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import {Tooltip, Icon} from 'antd'
export const handleDoStack = (style, editorState) => {
  let state = EditorState[style === 'undo' ? 'undo' : 'redo'](editorState)
  return state
}

const FontActions = [
  {
    title: '撤销',
    iconType: 'undo',
    style: 'undo'
  },
  {
    title: '重做',
    iconType: 'redo',
    style: 'redo'
  }
]

class DoStack extends Component {
  render() {
    return <div className="journal-editor-do_stack tool-btns">
      {
        FontActions.map(action => {
          return <button
            key={action.style}
            className="tool-btn" onClick={() => this.props.handleAction(action.style)}>
            <Tooltip placement="top" title={action.title}>
              <Icon type={action.iconType} />
            </Tooltip>
          </button>
        })
      }
    </div>
  }
}

export default DoStack