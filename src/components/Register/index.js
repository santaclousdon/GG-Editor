import React from 'react';
import Editor from '@components/Base/Editor';
import { upperFirst } from '@utils';
import withGGEditor from '@common/context/GGEditorContext/withGGEditor';

class Register extends React.Component {
  static create = function (type) {
    return class TypedRegister extends Register {
      constructor(props) {
        super(props, type);
      }
    };
  }

  constructor(props, type) {
    super(props);

    this.type = type;

    this.bindEvent();
  }

  bindEvent() {
    const { type } = this;
    const { onBeforeAddPage } = this.props;

    onBeforeAddPage(({ className }) => {
      let host = Editor[className];
      let keys = ['name', 'config', 'extend'];

      if (type === 'command') {
        host = Editor;
      }

      if (type === 'behaviour') {
        keys = ['name', 'behaviour', 'dependences'];
      }

      const args = keys.map(key => this.props[key]);

      host[`register${upperFirst(type)}`](...args);
    });
  }
}

export const RegisterNode = Register.create('node');
export const RegisterEdge = Register.create('edge');
export const RegisterGroup = Register.create('group');
export const RegisterGuide = Register.create('guide');
export const RegisterCommand = Register.create('command');
export const RegisterBehaviour = Register.create('behaviour');

export default withGGEditor(Register);
