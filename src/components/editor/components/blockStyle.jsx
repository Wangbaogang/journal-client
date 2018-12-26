import React, { Component } from 'react'
import { RichUtils } from 'draft-js'
import { Tooltip, Icon } from 'antd'
import MyIcon from '../common/icon'

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
    iconType: 'icon-biaotizhengwenqiehuan',
    selfIcon: true,
    style: 'header-two',
  },
  {
    title: '无序列表',
    iconType: 'icon-wuxuliebiao',
    selfIcon: true,
    style: 'unordered-list-item',
  },
  {
    title: '有序列表',
    selfIcon: true,
    iconType: 'icon-youxuliebiao',
    style: 'ordered-list-item',
  },
  {
    title: '代码块',
    selfIcon: true,
    iconType: 'icon-code',
    style: 'code-block',
  },
  {
    title: '引用块',
    selfIcon: true,
    iconType: 'icon-yinyong',
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
              {action.selfIcon ? <MyIcon type={action.iconType} /> : <Icon type={action.iconType} />}
            </Tooltip>
          </button>
        })
      }
    </div>
  }
}

export default BlockStyle