import React, { Component } from 'react'
import { Button, Input, message } from 'antd'
import qs from 'query-string'
import Editor from '@/components/editor'
import api from '@/common/api'
import './compose.scss'
import appState from '../../store/index'

class Compose extends Component {
  state = {
    journalId: null,
    title: ''
  }
  render() {
    return (
      <div className="journal-compose">
        <div className="journal-compose-title">
          <Input.TextArea
            className="Input"
            rows="1"
            placeholder="请输入标题，最多50字"
            size="large"
            value={this.state.title}
          />
        </div>

        <Editor
          handleChange={this.handleChange}
          title={this.state.title} />
        <Button type="primary" onClick={this.onSave}>
          提交
        </Button>
      </div>
    )
  }

  handleChange = content => {
    this.setState({
      content
    })
  }

  componentDidMount = () => {
    let params = qs.parse(this.props.location.search)

    api.findJournalById(params.id).then(res => {
      this.setState({
        journalId: params.id,
        content: res.data.content,
        title: res.data.title
      })
    })
  }

  updateJournal = ({ content }) => {
    api
      .updateJournal({
        title: 'test',
        content,
        id: this.state.journalId
      })
      .then(() => {
        message.info('提交成功')
      })
  }

  createJournal = ({ content }) => {
    api
      .createJournal({
        title: 'test',
        content
      })
      .then(() => {
        message.info('提交成功')
      })
  }

  onSave = () => {
    let { editorHtml } = this.state

    console.log(appState.rawContent)
    if (this.state.journalId) {
      this.updateJournal({ editorHtml })
    } else {
      this.createJournal({ editorHtml })
    }
  }
}

export default Compose
