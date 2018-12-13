import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import Form from './form'

class Login extends Component {
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
  
  loginSuccess = () => {
    this.hideModal()
    window.location.reload()
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal} style={this.props.style}>
          登录
        </Button>
        <Modal title="登录" visible={this.state.visible} onCancel={this.handleCancel} footer={null}>
					<Form successCallback={this.loginSuccess}/>
        </Modal>
      </div>
    )
  }
}

export default Login
