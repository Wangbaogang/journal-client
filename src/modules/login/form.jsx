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
      <AntForm >
        <AntForm.Item>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: '请输入邮箱' },
              {
                type: 'email',
                message: '邮箱格式有误'
              }
            ]
          })(<Input prefix={<Icon type="user" />} placeholder="Email地址" />)}
        </AntForm.Item>
        <AntForm.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </AntForm.Item>
        <Button type="primary" style={{ width: '100%' }} onClick={this.onLogin}>
          登录
        </Button>
      </AntForm>
    )
  }

  onLogin = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
				console.log('登录中', values)
				api.login(values).then(() => {
					message.success("登陆成功")
					this.props.successCallback && this.props.successCallback(values)
				})
      }
    })
  }
}

const WrappedFrom = AntForm.create({})(Form)
console.log(WrappedFrom)

export default WrappedFrom
