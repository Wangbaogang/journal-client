import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import JHeader from './modules/header'
import Home from './modules/home'
import About from './modules/about'
import Compose from './modules/compose'
import Setting from './modules/setting'
import 'normalize.css'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

const { Header, Footer, Content } = Layout
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Layout>
            <Header>
              <JHeader style={{ width: '1000px', margin: '0 auto' }} />
            </Header>
            <Content style={{ width: '800px', margin: '0 auto', minHeight: '400px'}}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" component={About} />
                <Route path="/user/compose" component={Compose} />
                <Route path="/user/setting" component={Setting} />
              </Switch>
            </Content>
            <Footer style={{ width: '1000px', margin: '0 auto' }}>
              footer
            </Footer>
          </Layout>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
