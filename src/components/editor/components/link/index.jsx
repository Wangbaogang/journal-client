import React, { Component } from 'react'
import { observable } from 'mobx'
import appState from '../../../../store/index'
import { Modal, Form, Input, Tooltip, Icon } from 'antd'
import { Modifier, RichUtils, EditorState, getVisibleSelectionRect } from 'draft-js'
import util from '../../util'
import MyTooltip from '../../common/tooltip'
import MyIcon from '../../common/icon'
import { observer } from 'mobx-react';

const _getEntityDataWhileSelectionInLink = (editorState) => {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const blockKey = selectionState.getAnchorKey()
    let block = contentState.getBlockForKey(blockKey)
    let isLink = false,
        href = '', key = null, text = '';
    block.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        if (entityKey !== null) {
            const entity = contentState.getEntity(entityKey)
            if (entity.getType() === 'LINK') {
                let entityData = entity.getData()
                href = entityData.href
                key = entityKey
                return true
            }
            return false;
        }
    }, (...range) => {
        if (range.length === 2) {
            let { anchorOffset, focusOffset } = selectionState
            let [start, end] = range
            /* 当光标所处位置在range中时，才判定为是链接实体所在位置 */
            if ((end >= anchorOffset && anchorOffset >= start) && (end >= focusOffset && focusOffset >= start)) {
                isLink = true
                const plainText = block.getText()
                console.log(plainText)
                text = String.prototype.slice.apply(plainText, range)
            }
        }
    })
    if (isLink) return { key, href, text }
    return null
}
export const toggleLinkToolTip = (editorState) => {
    let data = _getEntityDataWhileSelectionInLink(editorState)
    console.log(data);
    if (!data) return MyTooltip.hide();
    let rect = getVisibleSelectionRect(window)
    if (!rect) return MyTooltip.hide();
    if (!editorState.getSelection().hasFocus) return;
    console.log(rect)
    let div = document.createElement('div');
    document.body.appendChild(div);
    appState.linkState.text = data.text
    appState.linkState.href = data.href
    appState.linkState.entityKey = data.key
    MyTooltip.show({
        style: {
            position: 'absolute',
            left: rect.left + 20 + 'px',
            top: rect.top + 30 + 'px',
            backgroundColor: '#ccc'
        },
        onClick: () => {
            const { editorState } = appState
            appState.editorState = EditorState.forceSelection(editorState, editorState.getSelection())
        },
        children: <span>
            {data.href}
            <Icon style={{ cursor: 'pointer' }}
                onClick={(evt) => {
                }}
                type="edit" />
        </span>
    }, div);
}
/* 装饰器自定义组件 */
const _Link = (props) => {
    const { entityKey, children } = props;
    const entity = props.contentState.getEntity(entityKey)
    const { href } = entity.getData()
    return <a href={href}>
        {children}
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
const handleEditLink = (editorState, data = {
    text: "百度连接", href: "http://www.baidu.com"
}) => {
    let entity = _getEntityDataWhileSelectionInLink(editorState)

    const contentState = editorState.getCurrentContent()
    let selectionState = editorState.getSelection();
    console.log(entity)
    if (entity) {
        let sta = Modifier.replaceText(
            contentState,
            selectionState,
            '哈哈',
            null,
            entity.key
        )
        console.log(sta)
        return sta
    }

    let { text, href } = data

    /* 对于`insertText`方法，选区必须是合并的 */
    if (!selectionState.isCollapsed()) {
        selectionState = util.collapseSelectionFromFocus(selectionState)
    }
    const editorStateAfterCollapse = EditorState.acceptSelection(editorState, selectionState)

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
            href
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

@observer class EditLink extends Component {
    showModal = () => {
        appState.linkState.visible = true
    }
    hideModal = () => {
        appState.linkState.visible = false
    }
    onPromptLink = () => {
        this.showModal()
    }
    handleOk = () => {
        this.hideModal()
        this.props.handleAction()
    }
    handleCancel = () => {
        this.hideModal()
    }
    render() {
        return <div className="tool-btns">
            <button onClick={this.onPromptLink} className="tool-btn">
                <Tooltip title="插入链接">
                    <MyIcon type="icon-lianjie" />
                </Tooltip>
            </button>
            <Modal
                visible={appState.linkState.visible}
                title="编辑链接"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form ref="form">
                    <Form.Item>
                        <Input placeholder="请输入链接文本" defaultValue={appState.linkState.text}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="请输入链接地址" defaultValue={appState.linkState.href}></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    }
}

export default EditLink