import React, { Component } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css'

const defaultInlineStyle = [
  { el: <span style={{ fontWeight: 'bold' }}>B</span>, style: 'BOLD' },
  { el: <span style={{ fontStyle: 'italic' }}>I</span>, style: 'ITALIC' },
  {
    el: <span style={{ textDecoration: 'underline' }}>U</span>,
    style: 'UNDERLINE'
  },
  {
    el: (
      <span style={{ backgroundColor: '#e24' }}>
        <span style={{ color: 'transparent' }}>0</span>
      </span>
    ),
    style: 'RED'
  },
  {
    el: (
      <span style={{ backgroundColor: '#39f' }}>
        <span style={{ color: 'transparent' }}>1</span>
      </span>
    ),
    style: 'BLUE'
  },
  {
    el: (
      <span style={{ backgroundColor: '#f93' }}>
        <span style={{ color: 'transparent' }}>2</span>
      </span>
    ),
    style: 'ORANGE'
  },
  {
    el: (
      <span style={{ backgroundColor: '#3a6' }}>
        <span style={{ color: 'transparent' }}>3</span>
      </span>
    ),
    style: 'GREEN'
  }
]
const customColorStyleMap = {
  RED: { color: '#e24' },
  BLUE: { color: '#39f' },
  ORANGE: { color: '#f93' },
  GREEN: { color: '#3a6' }
}
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
  }
  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
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
  render() {
    return (
      <div style={this.props.style}>
        <div className="journl-editor-toolbar">
          {defaultInlineStyle.map(item => (
            <button
              onClick={evt => {
                evt.persist()
                return this.toggleInlineStyle(item.style)
              }}
              key={item.style}
            >
              {item.el}
            </button>
          ))}
        </div>
        <Editor
          ref={this.setEditor}
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          placeholder="写点什么..."
          customStyleMap={customColorStyleMap}
        />
      </div>
    )
  }
}

export default JEditor
