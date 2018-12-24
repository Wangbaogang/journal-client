import React, { Component } from 'react'
import { Modal, Form, Input, Tooltip } from 'antd'
import { Modifier, RichUtils, EditorState, SelectionState } from 'draft-js'
import util from '../util'

/* 装饰器自定义组件 */
const _Link = (props) => {
    const entity = props.contentState.getEntity(props.entityKey)
    const { href } = entity.getData()
    return <a href={href}>
        {props.children}
    </a>
}
/**
 * 寻找符合实体
 * @param {*} contentBlock 
 * @param {*} callback 
 * @param {*} contentState 
 */
const _findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity()
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            )
        },
        callback
    )
}

/**
 * 获取link decorator的信息
 */
const getLinkDecoratorDescribe = () => {
    const data = {
        strategy: _findLinkEntities,
        component: _Link
    }
    return data
}

/**
 * 渲染插入链接
 * @param {*} editorState 
 */
const handleEditLink = (editorState) => {
    const contentState = editorState.getCurrentContent()
    let selectionState = editorState.getSelection();
    /* 对于`insertText`方法，选区必须是合并的 */
    if (!selectionState.isCollapsed()) {
        selectionState = util.collapseSelectionFromFocus(selectionState)
    }
    const editorStateAfterCollapse = EditorState.acceptSelection(editorState, selectionState)

    const text = '百度链接'
    /* 首先插入链接文本 */
    const newContentState = Modifier.insertText(
        contentState,
        selectionState,
        text
    )
    const editorStateAfterInsert = EditorState.push(editorStateAfterCollapse, newContentState, 'insert-fragment')
    /* 新建LINK实体 */
    const contentStateWithEntity = newContentState.createEntity(
        'LINK',
        'MUTABLE',
        {
            href: 'http://www.baidu.com'
        }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    /* 选区合并，覆盖链接文本，方便toggleLink */
    selectionState = util.collapseSelectionFromAnchor(selectionState, text.length)
    const editorStateAfterCollapse2 = EditorState.acceptSelection(editorStateAfterInsert, selectionState);

    const editorStateWidthLink = RichUtils.toggleLink(
        editorStateAfterCollapse2,
        selectionState,
        entityKey
    )
    /* 再次合并选区 */
    selectionState = util.collapseSelectionFromFocus(selectionState, 0)
    const editorStateAfterCollapse3 = EditorState.forceSelection(editorStateWidthLink, selectionState)

    return editorStateAfterCollapse3

}

export { handleEditLink, getLinkDecoratorDescribe }

class EditLink extends Component {
    state = {
        visible: false
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
    onPromptLink = () => {
        this.showModal()
    }
    handleOk = () => {
        this.hideModal()
        this.props.handleAction()
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        return <div className="tool-btns">
            <button onClick={this.onPromptLink}>
                <Tooltip title="插入链接">
                    link
                </Tooltip>
            </button>
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