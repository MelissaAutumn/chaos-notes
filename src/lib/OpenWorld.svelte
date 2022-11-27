<script>
  import {objectToStyle} from "../helpers/object.js";
  import Note from "$lib/Note.svelte";
  import {MOUSE_BUTTONS} from "../helpers/mouse.js";

  const perspective = 1024;
  const zoomIncrements = perspective * 0.05;

  const MODES = {
    viewMode: 'view mode',
    moveMode: 'move mode',
  }

  let currentMode = MODES.viewMode;
  let currentZoom = 0.0;
  let position = {
    x: 0,
    y: 0,
  }
  $: cameraStyle = {
    transform: `perspective(${perspective}px) translate3D(${position.x}px, ${position.y}px, ${currentZoom}px)`,
  }
  $: backdropStyle = {
    cursor: currentMode === MODES.moveMode ? 'move' : 'default',
  }

  /**
   *
   * @param evt : WheelEvent
   */
  const onScroll = (evt) => {
    currentZoom += evt.deltaY > 0 ? -zoomIncrements : zoomIncrements;
    // Clamp values
    currentZoom = Math.min(currentZoom, perspective * 0.90);
    currentZoom = Math.max(currentZoom, -perspective);
  }
  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseDown = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
      currentMode = MODES.moveMode;
    }
  }
  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseUp = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
        currentMode = MODES.viewMode;
    }
  }

  /**
   *
   * @param evt : MouseEvent
   */
  const onMouseMove = (evt) => {
    if (currentMode !== MODES.moveMode) {
      return;
    }
    // TODO: Need to be normalized with zoom level
    position = {
      x: position.x + evt.movementX,
      y: position.y + evt.movementY,
    }
  }

</script>
<div class="backdrop" style={objectToStyle(backdropStyle)}>
    <div class="info-bar">
        <span>Mode: {currentMode}</span>
        <span></span>
        <span>Coords: ({position.x}, {position.y}, {currentZoom.toFixed(2)})</span>
    </div>

    <div class="camera" style={objectToStyle(cameraStyle)}>
        <Note/>
    </div>
</div>
<svelte:window
        on:mousemove={onMouseMove}
        on:mouseup={onMouseUp}
        on:mousedown={onMouseDown}
        on:wheel={onScroll}
/>
<style>
    .info-bar {
        display: inline-grid;
        width: 100%;
        grid-template-columns: 1fr 2fr 1fr;
        margin: 0 4px 0 4px;
    }

    .backdrop {
        background-color: floralwhite;
        position: fixed;
        margin: 0;
        width: 100%;
        height: 100%;
    }

    .camera {
        position: fixed;
        transform-style: preserve-3d;
        height: 100%;
        width: 100%;
    }

    .box {
        background-color: white;
        border: black solid 2px;
        height: 128px;
        width: 128px;
    }
</style>