import smoothCornersWorkletUrl from 'file-loader!smooth-corners'
export default () => {
  CSS.paintWorklet.addModule(smoothCornersWorkletUrl)
}
