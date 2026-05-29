import * as fabric from 'fabric'

export interface ShapeStyle {
  stroke: string
  strokeWidth: number
}

/** Rectangle drawn from a start corner; width/height get updated live while dragging. */
export function createRectangle(x: number, y: number, style: ShapeStyle): fabric.Rect {
  return new fabric.Rect({
    left: x,
    top: y,
    width: 0,
    height: 0,
    fill: 'transparent',
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeUniform: true,
  })
}

export function createEllipse(x: number, y: number, style: ShapeStyle): fabric.Ellipse {
  return new fabric.Ellipse({
    left: x,
    top: y,
    rx: 0,
    ry: 0,
    fill: 'transparent',
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeUniform: true,
  })
}

export function createLine(x: number, y: number, style: ShapeStyle): fabric.Line {
  return new fabric.Line([x, y, x, y], {
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeUniform: true,
  })
}

export function createText(x: number, y: number, style: ShapeStyle): fabric.IText {
  return new fabric.IText('', {
    left: x,
    top: y,
    fill: style.stroke,
    fontSize: Math.max(16, style.strokeWidth * 6),
    fontFamily: 'Inter, system-ui, sans-serif',
  })
}

/**
 * Update a shape in-place as the pointer moves. Handles the origin flip when the
 * user drags up/left so shapes can be drawn in any direction.
 */
export function resizeShape(
  obj: fabric.Object,
  startX: number,
  startY: number,
  pointerX: number,
  pointerY: number,
) {
  const left = Math.min(startX, pointerX)
  const top = Math.min(startY, pointerY)
  const width = Math.abs(pointerX - startX)
  const height = Math.abs(pointerY - startY)

  if (obj instanceof fabric.Ellipse) {
    obj.set({ left, top, rx: width / 2, ry: height / 2 })
  } else if (obj instanceof fabric.Line) {
    obj.set({ x2: pointerX, y2: pointerY })
  } else {
    obj.set({ left, top, width, height })
  }
  obj.setCoords()
}

/**
 * Build an arrow as a group: a line plus a triangular head at the end point.
 * Returns null if the drag distance is negligible.
 */
export function createArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: ShapeStyle,
): fabric.Group | null {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)
  if (length < 3) return null

  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  const headSize = Math.max(10, style.strokeWidth * 4)

  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeUniform: true,
  })

  const head = new fabric.Triangle({
    left: x2,
    top: y2,
    originX: 'center',
    originY: 'center',
    width: headSize,
    height: headSize,
    fill: style.stroke,
    angle: angleDeg + 90,
  })

  return new fabric.Group([line, head])
}
