<script>
  /**
   * Note Component
   * Functionality:
   *  * Draggable
   *  * Editable
   *  * Resizable (TBD)
   */
  import {objectToStyle} from "../helpers/object.js";
  import {MOUSE_BUTTONS} from "../helpers/mouse.js";

  export let size = {
    width: 128,
    height: 128,
  }
  export let position = {
    x: 0,
    y: 0,
  }
  const MODES = {
    viewMode: 'view mode',
    editMode: 'edit mode',
    moveMode: 'move mode',
  }
  let currentMode = MODES.viewMode;
  let isFocused = false;

  const CURSOR_MAP = {
    'view mode': 'default',
    'edit mode': 'text',
    'move mode': 'grabbing',
  }

  /**
   * Start edit mode
   */
  const onDoubleClick = () => {
    currentMode = MODES.editMode;
  }
  /**
   * Allows us to escape edit mode
   * @param evt : KeyboardEvent
   */
  const onKeyUp = (evt) => {
    if (evt.key === 'Escape') {
      currentMode = MODES.viewMode;
    }
  }
  /**
   * Additional way to escape edit mode
   */
  const onFocusOut = () => {
    isFocused = false;
    currentMode = MODES.viewMode;
  }
  /**
   * If we're in view mode, set our mode to move
   * @param evt : MouseEvent
   */
  const onMouseDown = (evt) => {
    if (currentMode !== MODES.viewMode) {
      return;
    }
    if (evt.button === MOUSE_BUTTONS.left) {
        currentMode = MODES.moveMode;
    }
  }
  /**
   * If we're in move mode, set our mode to view
   * @param evt : MouseEvent
   */
  const onMouseUp = (evt) => {
    if (currentMode !== MODES.moveMode) {
      return;
    }
    if (evt.button === MOUSE_BUTTONS.left) {
      currentMode = MODES.viewMode;
    }
  }

  /**
   * If we're in move mode, update the position with the mouse deltas
   * @param evt : MouseEvent
   */
  const onMouseMove = (evt) => {
    if (currentMode !== MODES.moveMode) {
      return;
    }
    position = {
      x: position.x + evt.movementX,
      y: position.y + evt.movementY,
    }
  }

  $: style = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: CURSOR_MAP[currentMode] ?? 'default',
    'user-select': currentMode === MODES.moveMode ? 'none' : 'initial',
  };

</script>
<div
        on:focusin={() => isFocused = true}
        on:focusout={onFocusOut}
        on:dblclick={onDoubleClick}
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:mousemove={onMouseMove}
        on:keyup={onKeyUp}
        style={objectToStyle(style)}
        class="note"
        contenteditable={currentMode === MODES.editMode}
>
    Double click to edit me! {currentMode}
</div>
<style>
    .note {
        position: absolute;
        background-color: white;
        border: black solid 2px;
        /*resize:both;*/ /* TODO: Figure out a way to make this play nicely with the modes */
        overflow: auto;
    }
</style>