import React, { Component } from 'react'
import { Modal, Button, message } from 'antd'
import Form from './form'
import api from '@/common/api'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  handleCancel = () => {
    this.hideModal()
  }

  loginSuccess = ({ email }) =>{
    this.hideModal()
    api.sendActiveMail({ email }).then(() => {
      message.info('已经向您的邮箱发送邮件, 请点击邮件中的链接激活您的账号')
      window.location.reload()
    })
  }

  render() {
    return (
      <div>
        <Button onClick={this.showModal} style={this.props.style}>注册</Button>
        <Modal
          title="注册"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form successCallback={this.loginSuccess} />
        </Modal>
      </div>
    )
  }
}

export default Register
