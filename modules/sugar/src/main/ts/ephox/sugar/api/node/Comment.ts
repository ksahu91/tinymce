import * as Node from './Node';
import NodeValue from '../../impl/NodeValue';
import Element from './Element';
import { Option } from '@ephox/katamari';
import { Node as DomNode, Comment } from '@ephox/dom-globals';

const api = NodeValue(Node.isComment, 'comment');

const get = function (element: Element<Comment>) {
  return api.get(element);
};

const getOption = function (element: Element<DomNode>): Option<string> {
  return api.getOption(element);
};

const set = function (element: Element<Comment>, value: string) {
  api.set(element, value);
};

export {
  get,
  getOption,
  set,
};