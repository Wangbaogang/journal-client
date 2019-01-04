import { observable } from 'mobx'
import {convertToRaw} from 'draft-js'
const appState = observable({
    editorState: null,
    linkState: {
        visible: false,
        entityKey: null,
        text: '',
        href: ''
    },
    get rawContent() {
        if(this.editorState) {
            return convertToRaw(this.editorState.getCurrentContent())
        }
        return null
    }
})

export default appState