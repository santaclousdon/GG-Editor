import { isMind, isEdge, getSelectedNodes, getSelectedEdges, getGraphState, executeBatch } from '@/utils';
import { ItemState, GraphState, EditorEvent } from '@/common/constants';
import { Behavior } from '@/common/interfaces';
import behaviorManager from '@/common/behaviorManager';

interface ClickItemBehavior extends Behavior {
  /** 清空选中状态 */
  clearSelectedState(shouldUpdate?: (item: G6.Item) => boolean): void;
  /** 处理点击事件 */
  handleItemClick({ item }: { item: G6.Item }): void;
  /** 处理画布点击 */
  handleCanvasClick(): void;
  /** 处理按键按下 */
  handleKeyDown(e: KeyboardEvent): void;
  /** 处理按键抬起 */
  handleKeyUp(e: KeyboardEvent): void;
}

interface DefaultConfig {
  /** 是否支持多选 */
  multiple: boolean;
  /** 是否按下多选 */
  keydown: boolean;
  /** 多选按键码值 */
  keyCode: number;
}

const clickItemBehavior: ClickItemBehavior & ThisType<ClickItemBehavior & DefaultConfig> = {
  getDefaultCfg(): DefaultConfig {
    return {
      multiple: true,
      keydown: false,
      keyCode: 17,
    };
  },

  getEvents() {
    return {
      'node:click': 'handleItemClick',
      'edge:click': 'handleItemClick',
      'canvas:click': 'handleCanvasClick',
      keydown: 'handleKeyDown',
      keyup: 'handleKeyUp',
    };
  },

  clearSelectedState(shouldUpdate = () => true) {
    const { graph } = this;

    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);

    executeBatch(graph, () => {
      [...selectedNodes, ...selectedEdges].forEach(item => {
        if (shouldUpdate(item)) {
          graph.setItemState(item, ItemState.Selected, false);
        }
      });
    });
  },

  handleItemClick({ item }) {
    const { graph } = this;

    if (isMind(graph) && isEdge(item)) {
      return;
    }

    const isSelected = item.hasState(ItemState.Selected);

    if (this.multiple && this.keydown) {
      graph.setItemState(item, ItemState.Selected, !isSelected);
    } else {
      this.clearSelectedState(selectedItem => {
        return selectedItem !== item;
      });

      if (!isSelected) {
        graph.setItemState(item, ItemState.Selected, true);
      }
    }

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: getGraphState(graph),
    });
  },

  handleCanvasClick() {
    const { graph } = this;

    this.clearSelectedState();

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: GraphState.CanvasSelected,
    });
  },

  handleKeyDown(e) {
    this.keydown = (e.keyCode || e.which) === this.keyCode;
  },

  handleKeyUp() {
    this.keydown = false;
  },
};

behaviorManager.register('click-item', clickItemBehavior);