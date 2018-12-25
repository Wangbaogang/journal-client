import React, { Component } from 'react'
import { Modifier, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js'
import { Tooltip, Icon } from 'antd'
import MyIcon from '../common/icon'
import util from '../util'

/* 装饰器自定义组件 */
const _Divider = (props) => {
  console.log(props)
  return <div className="journal-editor-divider">
    <hr />
    <p></p>
  </div>
}
/**
* 寻找符合实体
* @param {*} contentBlock 
* @param {*} callback 
* @param {*} contentState 
*/
const _findDividerEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'HR'
      )
    },
    callback
  )
}
export const getDividerDecoratorDescribe = () => {
  return {
    strategy: _findDividerEntities,
    component: _Divider
  }
}
export const insertSplitLine = (editorState) => {
  const contentState = editorState.getCurrentContent()

  const contentStateWithEntity = contentState.createEntity(
    'HR',
    'IMMUTABLE',
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  /* 使用该方法`insertAtomicBlock`插入块级单位 */
  const _editorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '1')
  return _editorState
}
class SplitLine extends Component {
  handleClick = () => {
    this.props.handleAction()
  }
  render() {
    return <button onClick={this.handleClick} className="tool-btn">
      <Tooltip placement="top" title="分割线">
        <MyIcon type="icon-fengexian" />
      </Tooltip>
    </button>
  }
}
export default SplitLine