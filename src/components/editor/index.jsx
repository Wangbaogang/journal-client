import { Editor, EditorStateGenerator, ToolBar } from 'bb-editor'
import 'bb-editor/dist/bb-editor.css'
import React, { Component } from 'react'
console.log(Editor, EditorStateGenerator, ToolBar)
class JEditor extends Component {
  state = {
    editorState: null
  }
  afterChange = (editorState) => {
    this.setState({
      editorState
    })
  }
  render() {
    const value = EditorStateGenerator()
    console.log(ToolBar)
    return <div className="journal-editor">
      <Editor value={value} afterChange={this.afterChange} >
        <ToolBar>
          <ToolBar.Action.Blockquote />
          <ToolBar.Action.Bold />
          <ToolBar.Action.CodeBlock />
        </ToolBar>
      </Editor>
    </div>
  }
}

export default JEditor