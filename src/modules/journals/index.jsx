import React, { Component } from 'react'
import { List, Button } from 'antd'
import api from '@/common/api'

const count = 5;
class Journals extends Component {
	state = {
		list: [],
		data: [],
		pageNumber: 0,
		loading: true
	}

	render() {
		const { list, loading } = this.state
		const loadMore = !loading ? (
			<div style={{ textAlign: 'center' }}>
				<Button onClick={this.onLoadingMore}>loading more</Button>
			</div>
		) : null
		return <List
			dataSource={list}
			loadMore={loadMore}
			renderItem={
				item => (
					<List.Item actions={[<a href={"/user/compose?id=" + item._id}>edit</a>]}>
						<List.Item.Meta
							title={item.title}
							description={item.content}>
						</List.Item.Meta>
					</List.Item>
				)
			} />
	}
	onLoadingMore = () => {
		this.setState({
			pageNumber: this.state.pageNumber + 1
		}, () => {
			this.setState({
				loading: true,
				list: this.state.data.concat([Array.from({ length: count })].map(() => ({
					loading: true
				})))
			})
			this.getData().then(res => {
				const data = this.state.data.concat(res.data)
				this.setState({
					data,
					list: data,
					loading: false
				})
			})
		})
	}
	getData = () => {
		return api.findJournals({
			pageSize: count,
			pageNumber: this.state.pageNumber
		})
	}

	componentDidMount = () => {
		this.getData().then(res => {
			this.setState({
				list: res.data,
				data: res.data,
				loading: false
			})
		})
	}
}

export default Journals
