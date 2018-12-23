import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'

const handleEditLink = (editorState) => {
    console.log(editorState)
    return editorState
}

export { handleEditLink }

class EditLink extends Component {
    state = {
        visible: false
    }
    onPromptLink = () => {
        this.setState({
            visible: true
        })
    }
    handleOk = () => {
        this.setState({
            visible: false
        })
        this.props.handleAction()
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        return <div style={{ display: 'inline-block' }}>
            <button onClick={this.onPromptLink}>link</button>
            <Modal
                visible={this.state.visible}
                title="编辑链接"
                onOk={this.handleOk}
                onCancel={this.handleCancel}

            >
                <Form ref="form">
                    <Form.Item>
                        <Input placeholder="请输入链接文本"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="请输入链接地址"></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}

export default EditLink