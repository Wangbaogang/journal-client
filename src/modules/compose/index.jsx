import React, {Component} from 'react'
import {Button, message} from 'antd'
import qs from 'query-string'
import Editor from '@/components/editor'
import api from '@/common/api'
class Compose extends Component {
	state = {
		editorState: {},
		journalId: null
	}
	render() {
		return (<div>
			<p>write something</p>
			<Editor style={styles} handleChange={this.handleChange}/>
			<Button type="primary" onClick={this.onSave}>提交</Button>
		</div>)
	}

	handleChange = (editorState) => {
		this.setState({
			editorState
		})
	}

	componentDidMount = () => {
		console.log(this)
		let params = qs.parse(this.props.location.search)
		this.setState({
			journalId: params.id
		})
		api.findJournalById(params.id).then(res => {
			console.log(res)
		})
	}

	updateJournal = ({content}) => {
		api.updateJournal({
			title: 'test',
			content,
			id: this.state.journalId
		}).then(() => {
			message.info("提交成功")
		})
	}

	createJournal = ({content}) => {
		api.createJournal({
			title: 'test',
			content
		}).then(() => {
			message.info("提交成功")
		})
	}

	onSave = () => {
		console.log(this.state.editorState)	
		const content = this.state.editorState.getCurrentContent().getPlainText()

		if(this.state.journalId) {
			this.updateJournal({content})
		} else {
			this.createJournal({content})
		}
	}
}

const styles = {
	border: '1px solid gray',
	minHeight: '6em'
}

export default Compose