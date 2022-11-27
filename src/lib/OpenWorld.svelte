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

  let backdropElement = null;
  let cameraElement = null;

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

  // Components
  let noteComponents = [];
  $: liveNoteComponents = noteComponents;

  /**
   * Zoom in/out via scroll wheel events
   * @param evt : WheelEvent
   */
  const onScroll = (evt) => {
    currentZoom += evt.deltaY > 0 ? -zoomIncrements : zoomIncrements;
    // Clamp values
    currentZoom = Math.min(currentZoom, perspective * 0.90);
    currentZoom = Math.max(currentZoom, -perspective);
  }
  /**
   * Set to move mode if we're holding down middle mouse
   * @param evt : MouseEvent
   */
  const onMouseDown = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
      currentMode = MODES.moveMode;
    }
  }
  /**
   * Revert to view mode if we lift our middle mouse button up
   * @param evt : MouseEvent
   */
  const onMouseUp = (evt) => {
    if (evt.button === MOUSE_BUTTONS.middle) {
        currentMode = MODES.viewMode;
    }
  }

  /**
   * Updates the translation position
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

  /**
   * Create a new note component
   * @param evt : MouseEvent
   */
  const onDoubleClick = (evt) => {
    // Prevent creating notes while trying to edit the notes.
    if (evt.target === cameraElement || evt.target === backdropElement) {
      // Apply local coordinates to our global coordinates, to get the global position
      const adjustedPosition = {
        x: evt.x - position.x,
        y: evt.y - position.y,
      }

      const note = {instance: Note, props: {defaultPosition: adjustedPosition}};
      noteComponents = [...noteComponents, note];
    }
  }

</script>
<div class="backdrop"
     style={objectToStyle(backdropStyle)}
     bind:this={backdropElement}
>
    <div class="info-bar">
        <span>Mode: {currentMode}</span>
        <span>Components: {liveNoteComponents.length}</span>
        <span>Coords: ({position.x}, {position.y}, {currentZoom.toFixed(2)})</span>
    </div>

    <div class="camera" style={objectToStyle(cameraStyle)} bind:this={cameraElement}>
        {#each liveNoteComponents as note}
            <svelte:component this={note.instance} {...note.props}/>
        {/each}
    </div>
</div>
<svelte:window
        on:mousemove={onMouseMove}
        on:mouseup={onMouseUp}
        on:mousedown={onMouseDown}
        on:dblclick={onDoubleClick}
        on:wheel={onScroll}
/>
<style>
    .info-bar {
        display: inline-grid;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
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
        height: 100%;
        width: 100%;
    }
</style>