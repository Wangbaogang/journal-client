import React, { Component } from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertFromHTML,
  CompositeDecorator,
  AtomicBlockUtils
} from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { Icon, Tooltip } from 'antd'
import Immutable from 'immutable'
import EditFont, { handleFontChange } from './components/fontStyle'
import EditLink, { handleEditLink, getLinkDecoratorDescribe } from './components/link';
import EditorDo, { handleDoStack } from './components/doStack'
import EditBlock, { toggleBlockStyle, toggleCode } from './components/blockStyle'
import EditSplitLine, { insertSplitLine, getDividerDecoratorDescribe, spliteLineBackSpaceTrick } from './components/splitLine'
import 'draft-js/dist/Draft.css'
import './editor.scss'

const customColorStyleMap = {}
//装饰器
const decorator = new CompositeDecorator([
  //装饰链接
  getLinkDecoratorDescribe(),
  //装饰分割线
  getDividerDecoratorDescribe()
])
class JEditor extends Component {
  props = {
    content: '',
  }
  state = {
    editorState: EditorState.createEmpty(decorator),
    currentContent: ''
  }
  componentWillReceiveProps = (props) => {
    if (props.content) {
      let { contentBlocks, entityMap } = convertFromHTML(props.content)
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      )
      const editorState = EditorState.push(this.state.editorState, contentState, 'insert-fragment')
      this.onChange(editorState, true)
    }
    return true

  }
  onChange = (editorState, silent) => {
    this.setState({
      editorState
    }, () => {
      this.focusEditor()
    })
  }
  focusEditor = () => {
    if (this.editor) {
      this.editor.focus()
    }
  }
  componentDidMount = () => {
    this.focusEditor()
  }

  /* 快捷键设置 */
  handleKeyCommand = command => {
    const HANDLED = 'handled'
    const NOT_HANDLED = 'not-handled'
    let state
    state = spliteLineBackSpaceTrick(command, this.state.editorState)

    state = RichUtils.handleKeyCommand(state || this.state.editorState, command)
    if (state) {
      this.onChange(state)
      return HANDLED
    }
    return NOT_HANDLED
  }

  insertHTML = text => {
    let { editorState } = this.state

    const newBlockMap = convertFromHTML(text)
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const key = selectionState.getAnchorKey()
    const blockMap = contentState.getBlockMap()
    const blocksAfter = blockMap
      .skipUntil((_, k) => {
        return k === key
      })
      .skip(1)
      .toArray()
    const blokcsBefore = blockMap
      .takeUntil((_, k) => {
        return k === key
      })
      .toArray()
    console.log(newBlockMap.contentBlocks)
    newBlockMap.contentBlocks = blokcsBefore
      .concat([contentState.getBlockForKey(key)])
      .concat(newBlockMap.contentBlocks || [])
      .concat(blocksAfter)

    const newContentState = ContentState.createFromBlockArray(
      newBlockMap.contentBlocks,
      newBlockMap.entityMap
    )

    const newEditorState = EditorState.createWithContent(newContentState)
    return newEditorState
  }

  /**
   * 字体变化的类型名称 i.e:粗体/BOLD
   * @param {string} style 
   */
  _handleFontChange = (style) => {
    let state = handleFontChange(style, this.state.editorState)
    this.onChange(state)
  }
  _handleEditLink = () => {
    let state = handleEditLink(this.state.editorState)
    this.onChange(state)
  }
  _handleDoStack = (style) => {
    let state = handleDoStack(style, this.state.editorState)
    this.onChange(state)
  }
  _toggleBlockStyle = (style) => {
    let state = style === 'code-block' ? toggleCode(this.state.editorState) : toggleBlockStyle(style, this.state.editorState)
    this.onChange(state)
  }
  _insertSplitLine = () => {
    let state = insertSplitLine(this.state.editorState)
    this.onChange(state)

  }
  render() {
    const doAction = [
      {
        el: (
          <Tooltip placement="top" title="撤销">
            <Icon type="undo" />
          </Tooltip>
        ),
        action: 'undo'
      },
      {
        el: (
          <Tooltip placement="top" title="重做">
            <Icon type="redo" />
          </Tooltip>
        ),
        action: 'redo'
      }
    ]
    return (
      <div className="journal-editor">
        <div className="journal-editor-toolbar">
          <EditorDo handleAction={this._handleDoStack} />
          <EditFont handleAction={this._handleFontChange} />
          <EditBlock handleAction={this._toggleBlockStyle} />
          <EditLink handleAction={this._handleEditLink} />
          <EditSplitLine handleAction={this._insertSplitLine} />
        </div>
        <div className="journal-editor-wrap">
          <Editor
            ref="editor"
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="写点什么..."
            customStyleMap={customColorStyleMap}
            onChange={this.onChange}
            onBlur={() => { }}
            onFocus={() => { }}
          />
        </div>
      </div>
    )
  }
}

export default JEditor
