import React, { Component } from 'react'
import { Form as AntForm, Input, Icon, Button, message } from 'antd'
import api from '@/common/api'
class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    console.log(this.props.form)
    const { getFieldDecorator } = this.props.form
    return (
      <AntForm>
        <AntForm.Item label="你的名字">
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              prefix={<Icon type="user" />}
              placeholder="真实姓名或常用昵称"
            />
          )}
        </AntForm.Item>
        <AntForm.Item label="Email">
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: '请输入邮箱'
              },
              {
                type: 'email',
                message: '邮箱格式有误',
              }
            ]
          })(<Input prefix={<Icon type="user" />} placeholder="Email地址" />)}
        </AntForm.Item>

        <AntForm.Item label="密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="不少于6位的密码"
            />
          )}
        </AntForm.Item>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={this.onRegister}
        >
          注册
        </Button>
      </AntForm>
    )
  }

  onRegister = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        api.register(values).then(res => {
          message.success('注册成功')
          this.props.successCallback && this.props.successCallback(values)
        })
      }
    })
  }
}

const WrappedFrom = AntForm.create({})(Form)
console.log(WrappedFrom)

export default WrappedFrom
