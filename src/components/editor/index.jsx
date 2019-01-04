import React, { Component } from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertFromHTML,
  CompositeDecorator,
} from 'draft-js'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import appState from '../../store/index'
import EditFont, { handleFontChange } from './components/fontStyle'
import EditLink, { handleEditLink, getLinkDecoratorDescribe, toggleLinkToolTip } from './components/link/index';
import EditorDo, { handleDoStack } from './components/doStack'
import EditBlock, { toggleBlockStyle, toggleCode } from './components/blockStyle'
import EditDivider, { insertDivider, getDividerDecoratorDescribe, dividerBackSpaceTrick } from './components/divider'
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
@observer class JEditor extends Component {
  props = {
    content: '',
  }
  state = {
    currentContent: ''
  }
  componentWillMount() {
    appState.editorState = EditorState.createEmpty(decorator)
  }
  componentWillReceiveProps = (props) => {
    if (props.content) {
      let { contentBlocks, entityMap } = convertFromHTML(props.content)
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      )
      const editorState = EditorState.push(appState.editorState, contentState, 'insert-fragment')
      this.onChange(editorState)
    }
    return true

  }

  onChange = (editorState, action) => {
    appState.editorState = editorState
    autorun(() => {
      /* 链接tooltip展示 */
      setTimeout(() => {
        toggleLinkToolTip(editorState)
      }, 0)
    })
  }

  focusEditor = () => {
    if (this.refs.editor) {
      this.refs.editor.focus()
    }
  }
  componentDidMount = () => {
    this.focusEditor()
  }

  /* 快捷键设置 */
  handleKeyCommand = command => {
    console.log(command, 'handleKeyCommand')
    const HANDLED = 'handled'
    const NOT_HANDLED = 'not-handled'
    let state
    state = dividerBackSpaceTrick(command, appState.editorState)

    state = RichUtils.handleKeyCommand(state || appState.editorState, command)
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
    let state = handleFontChange(style, appState.editorState)
    this.onChange(state)
  }
  _handleEditLink = () => {
    let state = handleEditLink(appState.editorState)
    this.onChange(state)
  }
  _handleDoStack = (style) => {
    let state = handleDoStack(style, appState.editorState)
    this.onChange(state)
  }
  _toggleBlockStyle = (style) => {
    let state = style === 'code-block' ? toggleCode(appState.editorState) : toggleBlockStyle(style, appState.editorState)
    this.onChange(state)
  }
  _insertDivider = () => {
    let state = insertDivider(appState.editorState)
    this.onChange(state)
  }
  _handleFocus(evt) {
    console.log('focus')
  }
  render() {
    return (
      <div className="journal-editor">
        <div className="journal-editor-toolbar">
          <EditorDo handleAction={this._handleDoStack} />
          <EditFont handleAction={this._handleFontChange} />
          <EditBlock handleAction={this._toggleBlockStyle} />
          <EditLink handleAction={this._handleEditLink} />
          <EditDivider handleAction={this._insertDivider} />
        </div>
        <div className="journal-editor-wrap" onClick={this.focusEditor}>
          <Editor
            ref="editor"
            editorState={appState.editorState}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="写点什么..."
            customStyleMap={customColorStyleMap}
            onChange={this.onChange}
          // onFocus={this._handleFocus}
          />
        </div>
      </div>
    )
  }
}

export default JEditor
