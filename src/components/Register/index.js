import Editor from '@antv/g6-editor';
import { upperFirst } from '@utils';
import { EVENT_BEFORE_ADD_PAGE } from '@common/constants';
import BaseComponent from '../Base';

class Register extends BaseComponent {
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
  }

  componentWillMount() {
    const { editor } = this.context;
    const { type } = this;

    editor.on(EVENT_BEFORE_ADD_PAGE, ({ className }) => {
      let args = [];

      switch (type) {
        case 'behaviour': {
          const { name, behaviour, dependences } = this.props;
          args = [name, behaviour, dependences];
          break;
        }

        default: {
          const { name, config, extend } = this.props;
          args = [name, config, extend];
          break;
        }
      }

      Editor[className][`register${upperFirst(type)}`](...args);
    });
  }
}

export const RegisterNode = Register.create('node');
export const RegisterEdge = Register.create('edge');
export const RegisterGroup = Register.create('group');
export const RegisterGuide = Register.create('guide');
export const RegisterCommand = Register.create('command');
export const RegisterBehaviour = Register.create('behaviour');

export default Register;
