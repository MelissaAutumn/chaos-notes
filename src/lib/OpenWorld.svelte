<script>
  // Percentage
  import {objectToStyle} from "../helpers/object.js";

  const MOUSE_BUTTONS = {
    left: 0,
    middle: 1,
    right: 2,
    // Usually side buttons
    forth: 3,
    fifth: 4,
  }

  let moveMode = false;
  let currentZoom = 0;
  let position = {
    x: 0,
    y: 0,
  }
  $: cameraStyle = {
    transform: `perspective(2048px) translate3D(${position.x}px, ${position.y}px, ${currentZoom}px)`
  }

  /**
   *
   * @param evt : WheelEvent
   */
  const onScroll = (evt) => {
    // We want reverse direction
    currentZoom -= evt.deltaY;
  }
  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseDown = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
      moveMode = true;
    }
  }
  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseUp = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
        moveMode = false;
    }
  }

  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseMove = (evt) => {
    if (!moveMode) {
      return;
    }
    // TODO: Need to be normalized with zoom level
    position = {
      x: position.x + evt.movementX,
      y: position.y + evt.movementY,
    }
  }

</script>
<div class="backdrop" style={objectToStyle(cameraStyle)}>
    <div class="camera">
        <div class="box">Hello {cameraStyle.transform}</div>
    </div>
</div>
<svelte:window
        on:mousemove={onMouseMove}
        on:mouseup={onMouseUp}
        on:mousedown={onMouseDown}
        on:wheel={onScroll}
/>
<style>
    .backdrop {
        background-color: floralwhite;
        position: fixed;
        margin: 0;
        height: 100%;
        width: 100%;
    }

    .camera {
        position: fixed;
        height: 100%;
        width: 100%;
    }

    .box {
        background-color: white;
        border: black solid 1px;
        height: 128px;
        width: 128px;
        transform: scale3d(100%, 100%, 100%);
    }
</style>