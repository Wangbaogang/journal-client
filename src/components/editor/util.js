/**
 * 以focus位置为标准, 合并选区至指定位置
 * @param {*} selectionState 
 */
const collapseSelectionFromFocus = (selectionState, length = 0) => {
  let focusOffset = selectionState.getFocusOffset()
  const updatedSelection = selectionState.merge({
      anchorOffset: focusOffset - length
  })
  return updatedSelection
}
/**
* 以anchor位置为标准, 合并选区至指定位置
* @param {*} selectionState 
*/
const collapseSelectionFromAnchor = (selectionState, length = 0) => {
  let anchorOffset = selectionState.getAnchorOffset()
  const updatedSelection = selectionState.merge({
      focusOffset: anchorOffset + length
  })
  return updatedSelection
}

export default {
  collapseSelectionFromFocus,
  collapseSelectionFromAnchor
}