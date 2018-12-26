import React, { Component } from 'react'
import { Tooltip, Icon } from 'antd'
import { RichUtils } from 'draft-js'

/**
 * 改变行内字体样式
 * @param {EditorState} editorState 
 * @param {string} style 
 */
function handleFontChange(style, editorState) {
    let state = RichUtils.toggleInlineStyle(editorState, style)
    return state
}

export { handleFontChange }

class EditFont extends Component {
    render() {
        return <div className="journal-editor-font tool-btns">
            {
                FontActions.map(action => {
                    return <button
                        key={action.style}
                        className="tool-btn" onClick={() => this.props.handleAction(action.style)}>
                        <Tooltip placement="top" title={action.title}>
                            <Icon type={action.iconType} />
                        </Tooltip>
                    </button>
                })
            }
        </div>
    }
}
const FontActions = [
    {
        title: '粗体',
        iconType: 'bold',
        style: 'BOLD'
    },
    {
        title: '斜体',
        iconType: 'italic',
        style: 'ITALIC'
    },
    {
        title: '下划线',
        iconType: 'underline',
        style: 'UNDERLINE'
    },
    {
        title: '删除线',
        iconType: 'strikethrough',
        style: 'STRIKETHROUGH'
    }
]

export default EditFont