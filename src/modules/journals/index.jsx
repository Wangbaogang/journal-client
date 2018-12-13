import React, { Component } from 'react'
import { List } from 'antd'
import api from '@/common/api'
class Journals extends Component {
  state = {
		list: [],
		total: 0
  }

  render() {
    const { list } = this.state
		return <List 
		dataSource={list}
		renderItem={
			item => (
				<List.Item actions={[<a href={"/user/compose?id=" + item._id}>edit</a>, <a>more</a>]}>
					<List.Item.Meta
						title={item.title}
						description={item.content}>
					</List.Item.Meta>
				</List.Item>
			)
		} />
	}
	
	componentDidMount = () => {
		api.findJournals().then(res => {
			this.setState({
				list: res.data,
			})
		})
	}
}

export default Journals
