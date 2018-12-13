import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Login from '../login'
import Register from '../register'
import util from '@/common/util'

import './header.scss'
import api from '@/common/api'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  onLogOut = () => {
    api.logout().then(() => {
      console.log("退出登录")
      window.location.reload()
    })
  }
  render() {
    return (
      <div className="journal-header" style={this.props.style}>
        <span className="site_title">Journal</span>
        <Link className="page_link" to="/">
          首页
        </Link>
        <Link className="page_link" to="/about">
          关于
        </Link>
        {(() => {
          return util.isLoginStatus() ? (
            <div className="journal-header-right">
              <Link className="page_link" to="/user/compose">
                写日志
              </Link>
              <Link className="page_link" to="/user/setting">
                个人设置
              </Link>
              <span onClick={this.onLogOut} className="page_link">退出登录</span>
            </div>
          ) : (
            <div className="journal-header-right">
              <Login style={{ marginLeft: '10px' }} />
              <Register style={{ marginLeft: '10px' }} />
            </div>
          )
        })()}
      </div>
    )
  }
}

export default Header
