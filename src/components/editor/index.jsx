import React, { Component } from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  Modifier,
  convertFromHTML,
  DefaultDraftBlockRenderMap
} from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { Icon, Tooltip } from 'antd'
import Immutable from 'immutable'
import Hr from './hr'
import 'draft-js/dist/Draft.css'
import './editor.scss'

function myBlockRender(contentBlock) {
  const type = contentBlock.getType()
  if(type === 'hr') {
    return {
      component: Hr,
      editable: false,
      props: {

      }
    }
  }
}
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
const styleAction = [
  {
    el: (
      <Tooltip placement="top" title="粗体">
        <Icon type="bold" />
      </Tooltip>
    ),
    style: 'BOLD'
  },
  {
    el: (
      <Tooltip placement="top" title="斜体">
        <Icon type="italic" />
      </Tooltip>
    ),
    style: 'ITALIC'
  },
  {
    el: (
      <Tooltip placement="top" title="下划线">
        <Icon type="underline" />
      </Tooltip>
    ),
    style: 'UNDERLINE'
  },
  {
    el: (
      <Tooltip placement="top" title="删除线">
        <Icon type="strikethrough" />
      </Tooltip>
    ),
    style: 'STRIKETHROUGH'
  },
  {
    el: (
      <Tooltip placement="top" title="标题">
        H
      </Tooltip>
    ),
    style: 'header-two',
    type: 'block'
  },
  {
    el: (
      <Tooltip placement="top" title="无序列表">
        <Icon type="bars" />
      </Tooltip>
    ),
    style: 'unordered-list-item',
    type: 'block'
  },
  {
    el: (
      <Tooltip placement="top" title="有序列表">
        <Icon type="ordered-list" />
      </Tooltip>
    ),
    style: 'ordered-list-item',
    type: 'block'
  },
  {
    el: (
      <Tooltip placement="top" title="代码块">
        <Icon type="code" />
      </Tooltip>
    ),
    style: 'code-block',
    type: 'block'
  },
  {
    el: (
      <Tooltip placement="top" title="引用块">
        “
      </Tooltip>
    ),
    style: 'blockquote',
    type: 'block'
  },
  {
    el: (
      <Tooltip placement="top" title="分割线">
        —
      </Tooltip>
    ),
    style: 'hr',
    type: 'block'
  }
]
const customColorStyleMap = {}

class JEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
  }
  onChange = editorState => {
    this.setState({
      editorState
    })
    let html = stateToHTML(editorState.getCurrentContent())
    this.props.handleChange && this.props.handleChange(html)
  }
  setEditor = editor => {
    this.editor = editor
  }
  focusEditor = () => {
    if (this.editor) {
      this.editor.focus()
    }
  }
  componentDidMount = () => {
    this.focusEditor()
    console.log(this.editor)
  }
  /* 快捷键设置 */
  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  toggleInlineStyle = style => {
    let state = RichUtils.toggleInlineStyle(this.state.editorState, style)
    this.onChange(state)
  }

  toggleBlockType = style => {
    let state = RichUtils.toggleBlockType(this.state.editorState, style)
    this.onChange(state)
  }

  toggleCode = () => {
    let state = RichUtils.toggleCode(this.state.editorState)
    this.onChange(state)
  }

  undo = () => {
    let state = EditorState.undo(this.state.editorState)
    this.onChange(state)
  }

  redo = () => {
    let state = EditorState.redo(this.state.editorState)
    this.onChange(state)
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
    this.setState({
      editorState: newEditorState
    })
  }

  render() {
    return (
      <div className="journal-editor">
        <div className="journal-editor-toolbar">
          {doAction.map(item => (
            <button
              className="tool-btn"
              onClick={evt => {
                evt.persist()
                let { action } = item
                if (action === 'undo') {
                  this.undo()
                } else {
                  this.redo()
                }
              }}
              key={item.action}
            >
              {item.el}
            </button>
          ))}
          {styleAction.map(item => (
            <button
              className="tool-btn"
              onClick={evt => {
                evt.persist()
                console.log(item)
                if (item.style === 'code-block') return this.toggleCode()
                if (item.type !== 'block')
                  return this.toggleInlineStyle(item.style)
                this.toggleBlockType(item.style)
              }}
              key={item.style}
            >
              {item.el}
            </button>
          ))}
        </div>
        <div className="journal-editor-wrap">
          <Editor
            ref={this.setEditor}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="写点什么..."
            customStyleMap={customColorStyleMap}
            blockRendererFn={myBlockRender}
            onChange={this.onChange}
            onBlur={() => {}}
            onFocus={() => {}}
          />
        </div>
      </div>
    )
  }
}

export default JEditor
