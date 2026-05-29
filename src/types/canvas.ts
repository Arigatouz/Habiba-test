export type DrawingTool =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'text'

export interface CanvasSettings {
  activeTool: DrawingTool
  strokeColor: string
  fillColor: string
  strokeWidth: number
}
