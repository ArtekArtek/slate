import isPlainObject from 'is-plain-object'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { Record, Set, List } from 'immutable'

import Annotation from './annotation'
import Data from './data'
import Document from './document'
import Mark from './mark'
import PathUtils from '../utils/path-utils'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  annotations: undefined,
  data: undefined,
  document: undefined,
  selection: undefined,
}

/**
 * Value.
 *
 * @type {Value}
 */

class Value extends Record(DEFAULTS) {
  /**
   * Create a new `Value` with `attrs`.
   *
   * @param {Object|Value} attrs
   * @param {Object} options
   * @return {Value}
   */

  static create(attrs = {}, options = {}) {
    if (Value.isValue(attrs)) {
      return attrs
    }

    if (isPlainObject(attrs)) {
      return Value.fromJSON(attrs, options)
    }

    throw new Error(
      `\`Value.create\` only accepts objects or values, but you passed it: ${attrs}`
    )
  }

  /**
   * Create a dictionary of settable value properties from `attrs`.
   *
   * @param {Object|Value} attrs
   * @return {Object}
   */

  static createProperties(a = {}) {
    if (Value.isValue(a)) {
      return {
        annotations: a.annotations,
        data: a.data,
      }
    }

    if (isPlainObject(a)) {
      const p = {}
      if ('annotations' in a)
        p.annotations = Annotation.createMap(a.annotations)
      if ('data' in a) p.data = Data.create(a.data)
      return p
    }

    throw new Error(
      `\`Value.createProperties\` only accepts objects or values, but you passed it: ${a}`
    )
  }

  /**
   * Create a `Value` from a JSON `object`.
   *
   * @param {Object} object
   * @param {Object} options
   *   @property {Boolean} normalize
   *   @property {Array} plugins
   * @return {Value}
   */

  static fromJSON(object, options = {}) {
    let { data = {}, annotations = {}, document = {}, selection = {} } = object
    data = Data.fromJSON(data)
    document = Document.fromJSON(document)
    selection = document.createSelection(selection)
    annotations = Annotation.createMap(annotations)

    if (selection.isUnset) {
      const first = document.firstText()

      if (first) {
        const [firstText, firstPath] = first
        const start = document.createPoint({
          key: firstText.key,
          path: firstPath,
          offset: 0,
        })

        selection = selection.setPoints([start, start])
      }

      selection = document.createSelection(selection)
    }

    const value = new Value({
      annotations,
      data,
      document,
      selection,
    })

    return value
  }

  /**
   * Return a JSON representation of the value.
   *
   * @param {Object} options
   * @return {Object}
   */

  toJSON(options = {}) {
    const object = {
      object: this.object,
      document: this.document.toJSON(options),
    }

    if (options.preserveData) {
      object.data = this.data.toJSON(options)
    }

    if (options.preserveAnnotations) {
      object.annotations = this.annotations
        .map(a => a.toJSON(options))
        .toObject()
    }

    if (options.preserveSelection) {
      object.selection = this.selection.toJSON(options)
    }

    return object
  }

  /**
   * Deprecated.
   */

  get startBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.startBlock` property is depreacted. Use `document.closestBlock()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getClosestBlock(this.selection.start.path)
    )
  }

  get endBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.endBlock` property is depreacted. Use `document.closestBlock()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getClosestBlock(this.selection.end.path)
    )
  }

  get anchorBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.anchorBlock` property is depreacted. Use `document.closestBlock()` instead.'
    )

    return (
      this.selection.anchor.path &&
      this.document.getClosestBlock(this.selection.anchor.path)
    )
  }

  get focusBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.focusBlock` property is depreacted. Use `document.closestBlock()` instead.'
    )

    return (
      this.selection.focus.path &&
      this.document.getClosestBlock(this.selection.focus.path)
    )
  }

  get startInline() {
    warning(
      false,
      'As of slate@0.48, the `value.startInline` property is depreacted. Use `document.closestInline()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getClosestInline(this.selection.start.path)
    )
  }

  get endInline() {
    warning(
      false,
      'As of slate@0.48, the `value.endInline` property is depreacted. Use `document.closestInline()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getClosestInline(this.selection.end.path)
    )
  }

  get anchorInline() {
    warning(
      false,
      'As of slate@0.48, the `value.anchorInline` property is depreacted. Use `document.closestInline()` instead.'
    )

    return (
      this.selection.anchor.path &&
      this.document.getClosestInline(this.selection.anchor.path)
    )
  }

  get focusInline() {
    warning(
      false,
      'As of slate@0.48, the `value.focusInline` property is depreacted. Use `document.closestInline()` instead.'
    )

    return (
      this.selection.focus.path &&
      this.document.getClosestInline(this.selection.focus.path)
    )
  }

  get startText() {
    warning(
      false,
      'As of slate@0.48, the `value.startText` property is depreacted. Use `document.getNode()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getDescendant(this.selection.start.path)
    )
  }

  get endText() {
    warning(
      false,
      'As of slate@0.48, the `value.endText` property is depreacted. Use `document.getNode()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getDescendant(this.selection.end.path)
    )
  }

  get anchorText() {
    warning(
      false,
      'As of slate@0.48, the `value.anchorText` property is depreacted. Use `document.getNode()` instead.'
    )

    return (
      this.selection.anchor.path &&
      this.document.getDescendant(this.selection.anchor.path)
    )
  }

  get focusText() {
    warning(
      false,
      'As of slate@0.48, the `value.focusText` property is depreacted. Use `document.getNode()` instead.'
    )

    return (
      this.selection.focus.path &&
      this.document.getDescendant(this.selection.focus.path)
    )
  }

  get nextBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.nextBlock` property is depreacted. Use `document.nextBlock()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getNextBlock(this.selection.end.path)
    )
  }

  get previousBlock() {
    warning(
      false,
      'As of slate@0.48, the `value.previousBlock` property is depreacted. Use `document.previousBlock()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getPreviousBlock(this.selection.start.path)
    )
  }

  get nextInline() {
    warning(
      false,
      'As of slate@0.48, the `value.nextInline` property is depreacted. Use `document.nextInline()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getNextInline(this.selection.end.path)
    )
  }

  get previousInline() {
    warning(
      false,
      'As of slate@0.48, the `value.previousInline` property is depreacted. Use `document.previousInline()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getPreviousInline(this.selection.start.path)
    )
  }

  get nextText() {
    warning(
      false,
      'As of slate@0.48, the `value.nextText` property is depreacted. Use `document.nextText()` instead.'
    )

    return (
      this.selection.end.path &&
      this.document.getNextText(this.selection.end.path)
    )
  }

  get previousText() {
    warning(
      false,
      'As of slate@0.48, the `value.previousText` property is depreacted. Use `document.previousText()` instead.'
    )

    return (
      this.selection.start.path &&
      this.document.getPreviousText(this.selection.start.path)
    )
  }

  get marks() {
    warning(
      false,
      'As of slate@0.48, the `value.marks` property is depreacted. Use `document.marks()` instead.'
    )

    return this.selection.isUnset
      ? new Set()
      : this.selection.marks || this.document.getMarksAtRange(this.selection)
  }

  get activeMarks() {
    warning(
      false,
      'As of slate@0.48, the `value.activeMarks` property is depreacted. Use `document.getActiveMarksAtRange()` instead.'
    )

    return this.selection.isUnset
      ? new Set()
      : this.selection.marks ||
          this.document.getActiveMarksAtRange(this.selection)
  }

  get blocks() {
    warning(
      false,
      'As of slate@0.48, the `value.blocks` property is depreacted. Use `document.blocks()` instead.'
    )

    return this.selection.isUnset
      ? new List()
      : this.document.getLeafBlocksAtRange(this.selection)
  }

  get fragment() {
    warning(
      false,
      'As of slate@0.48, the `value.fragment` property is depreacted. Use `document.getFragmentAtRange()` instead.'
    )

    return this.selection.isUnset
      ? Document.create()
      : this.document.getFragmentAtRange(this.selection)
  }

  get inlines() {
    warning(
      false,
      'As of slate@0.48, the `value.inline` property is depreacted. Use `document.inline()` instead.'
    )

    return this.selection.isUnset
      ? new List()
      : this.document.getLeafInlinesAtRange(this.selection)
  }

  get texts() {
    warning(
      false,
      'As of slate@0.48, the `value.texts` property is depreacted. Use `document.texts()` instead.'
    )

    return this.selection.isUnset
      ? new List()
      : this.document.getTextsAtRange(this.selection)
  }

  mapRanges(iterator) {
    warning(
      false,
      'As of slate@0.47 the `value.mapRanges` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    const { document, selection, annotations } = value

    let sel = selection.isSet ? iterator(selection) : selection
    if (!sel) sel = selection.unset()
    if (sel !== selection) sel = document.createSelection(sel)
    value = value.set('selection', sel)

    let anns = annotations.map(annotation => {
      let n = annotation.isSet ? iterator(annotation) : annotation
      if (n && n !== annotation) n = document.createAnnotation(n)
      return n
    })

    anns = anns.filter(annotation => !!annotation)
    value = value.set('annotations', anns)
    return value
  }

  mapPoints(iterator) {
    warning(
      false,
      'As of slate@0.47 the `value.mapPoints` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    return this.mapRanges(range => range.updatePoints(iterator))
  }

  mergeNode(path) {
    warning(
      false,
      'As of slate@0.47 the `value.mergeNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    const { document } = value
    const newDocument = document.mergeNode(path)
    path = document.resolvePath(path)
    const withPath = PathUtils.decrement(path)
    const one = document.getNode(withPath)
    const two = document.getNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      if (two.object === 'text') {
        const max = one.text.length

        if (range.anchor.key === two.key) {
          range = range.moveAnchorTo(one.key, max + range.anchor.offset)
        }

        if (range.focus.key === two.key) {
          range = range.moveFocusTo(one.key, max + range.focus.offset)
        }
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  splitNode(path, position, properties) {
    warning(
      false,
      'As of slate@0.47 the `value.splitNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    const { document } = value
    const newDocument = document.splitNode(path, position, properties)
    const node = document.assertNode(path)
    value = value.set('document', newDocument)

    value = value.mapRanges(range => {
      const next = newDocument.getNextText(node.key)
      const { start, end } = range

      // If the start was after the split, move it to the next node.
      if (node.key === start.key && position <= start.offset) {
        range = range.moveStartTo(next.key, start.offset - position)
      }

      // If the end was after the split, move it to the next node.
      if (node.key === end.key && position <= end.offset) {
        range = range.moveEndTo(next.key, end.offset - position)
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  removeNode(path) {
    warning(
      false,
      'As of slate@0.47 the `value.removeNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    const node = document.assertNode(path)
    const first = node.object === 'text' ? node : node.getFirstText() || node
    const last = node.object === 'text' ? node : node.getLastText() || node
    const prev = document.getPreviousText(first.key)
    const next = document.getNextText(last.key)

    document = document.removeNode(path)
    value = value.set('document', document)

    value = value.mapRanges(range => {
      const { anchor, focus } = range

      if (node.hasNode(anchor.key)) {
        range = prev
          ? range.moveAnchorTo(prev.key, prev.text.length)
          : next ? range.moveAnchorTo(next.key, 0) : range.unset()
      }

      if (node.hasNode(focus.key)) {
        range = prev
          ? range.moveFocusTo(prev.key, prev.text.length)
          : next ? range.moveFocusTo(next.key, 0) : range.unset()
      }

      range = range.updatePoints(point => point.setPath(null))

      return range
    })

    return value
  }

  moveNode(path, newPath, newIndex = 0) {
    warning(
      false,
      'As of slate@0.47 the `value.moveNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value

    if (PathUtils.isEqual(path, newPath)) {
      return value
    }

    document = document.moveNode(path, newPath, newIndex)
    value = value.set('document', document)
    value = value.mapPoints(point => point.setPath(null))
    return value
  }

  removeText(path, offset, text) {
    warning(
      false,
      'As of slate@0.47 the `value.removeText` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    const node = document.assertNode(path)
    document = document.removeText(path, offset, text)
    value = value.set('document', document)

    const { length } = text
    const start = offset
    const end = offset + length

    value = value.mapPoints(point => {
      if (point.key !== node.key) {
        return point
      }

      if (point.offset >= end) {
        return point.setOffset(point.offset - length)
      }

      if (point.offset > start) {
        return point.setOffset(start)
      }

      return point
    })

    return value
  }

  setNode(path, properties) {
    warning(
      false,
      'As of slate@0.47 the `value.setNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    document = document.setNode(path, properties)
    value = value.set('document', document)
    return value
  }

  setAnnotation(properties, newProperties) {
    warning(
      false,
      'As of slate@0.47 the `value.setAnnotation` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    newProperties = Annotation.createProperties(newProperties)
    const annotation = Annotation.create(properties)
    const next = annotation.merge(newProperties)
    let value = this
    let { annotations } = value
    const { key } = annotation
    annotations = annotations.set(key, next)
    value = value.set('annotations', annotations)
    return value
  }

  setMark(path, mark, properties) {
    warning(
      false,
      'As of slate@0.47 the `value.setMark` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    document = document.setMark(path, mark, properties)
    value = value.set('document', document)
    return value
  }

  setProperties(properties) {
    warning(
      false,
      'As of slate@0.47 the `value.setProperties` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    const { document } = value
    const { data, annotations } = properties
    const props = {}

    if (data) {
      props.data = data
    }

    if (annotations) {
      props.annotations = annotations.map(a => {
        return a.isSet ? a : document.resolveAnnotation(a)
      })
    }

    value = value.merge(props)
    return value
  }

  setSelection(properties) {
    warning(
      false,
      'As of slate@0.47 the `value.setSelection` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document, selection } = value
    const next = selection.setProperties(properties)
    selection = document.resolveSelection(next)
    value = value.set('selection', selection)
    return value
  }

  removeAnnotation(annotation) {
    warning(
      false,
      'As of slate@0.47 the `value.removeAnnotation` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    annotation = Annotation.create(annotation)
    let value = this
    let { annotations } = value
    const { key } = annotation
    annotations = annotations.delete(key)
    value = value.set('annotations', annotations)
    return value
  }

  removeMark(path, mark) {
    warning(
      false,
      'As of slate@0.47 the `value.removeMark` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    mark = Mark.create(mark)
    let value = this
    let { document } = value
    document = document.removeMark(path, mark)
    value = value.set('document', document)
    return value
  }

  addAnnotation(annotation) {
    warning(
      false,
      'As of slate@0.47 the `value.addAnnotation` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    annotation = Annotation.create(annotation)
    let value = this
    let { annotations, document } = value
    const { key } = annotation
    annotation = annotation.updatePoints(point => point.normalize(document))
    annotations = annotations.set(key, annotation)
    value = value.set('annotations', annotations)
    return value
  }

  addMark(path, mark) {
    warning(
      false,
      'As of slate@0.47 the `value.addMark` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    mark = Mark.create(mark)
    let value = this
    let { document } = value
    document = document.addMark(path, mark)
    value = value.set('document', document)
    return value
  }

  insertNode(path, node) {
    warning(
      false,
      'As of slate@0.47 the `value.insertNode` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    document = document.insertNode(path, node)
    value = value.set('document', document)

    value = value.mapRanges(range =>
      range.updatePoints(point => point.setPath(null))
    )

    return value
  }

  insertText(path, offset, text) {
    warning(
      false,
      'As of slate@0.47 the `value.insertText` method is deprecated. Use `Operations.apply` for low-level use cases instead.'
    )

    let value = this
    let { document } = value
    document = document.insertText(path, offset, text)
    value = value.set('document', document)

    value = value.mapPoints(point => {
      if (point.path.equals(path) && point.offset >= offset) {
        return point.setOffset(point.offset + text.length)
      } else {
        return point
      }
    })

    return value
  }

  get history() {
    invariant(
      false,
      'As of Slate 0.42.0, the `value.history` model no longer exists, and the history is stored in `value.data` instead using plugins.'
    )
  }

  change() {
    invariant(
      false,
      'As of Slate 0.42.0, value object are no longer schema-aware, and the `value.change()` method is no longer available. Use the `editor.change()` method on the new `Editor` controller instead.'
    )
  }
}

/**
 * Export.
 */

export default Value
