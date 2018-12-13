import React, { Component } from 'react'
import { Editor, EditorState } from 'draft-js'
class JEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
  }
  onChange = editorState => {
    this.setState({
      editorState
    })
    this.props.handleChange && this.props.handleChange(editorState)
  }
  setEditor = editor => {
    this.editor = editor
  }
  focusEditor = () => {
    if (this.editor) {
      this.editor.focus()
    }
  }
  componentDidMount() {
    this.focusEditor()
  }
  render() {
    return (
      <div style={this.props.style} onClick={this.focusEditor}>
        <Editor
          ref={this.setEditor}
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default JEditor
