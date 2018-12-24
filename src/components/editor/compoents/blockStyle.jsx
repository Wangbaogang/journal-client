import React, { Component } from 'react'
import { RichUtils } from 'draft-js'
import {Tooltip, Icon} from 'antd'

export const toggleBlockStyle = (style, editorState) => {
  let state = RichUtils.toggleBlockType(editorState, style)
  return state
}
export const toggleCode = (editorState) => {
  let state = RichUtils.toggleCode(editorState)
  return state
}

const styleActions = [
  {
    title: '标题',
    iconType: 'bars',
    style: 'header-two',
  },
  {
    title: '无序列表',
    iconType: 'bars',
    style: 'unordered-list-item',
  },
  {
    title: '有序列表',
    iconType: 'ordered-list',
    style: 'ordered-list-item',
  },
  {
    title: '代码块',
    iconType: 'code',
    style: 'code-block',
  },
  {
    title: '引用块',
    iconType: 'code',
    style: 'blockquote',
  }
]

class BlockStyle extends Component {
  render() {
    return <div className="journal-editor-block tool-btns">
      {
        styleActions.map(action => {
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

export default BlockStyle