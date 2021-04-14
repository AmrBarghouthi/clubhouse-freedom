import smoothCornersWorkletUrl from 'file-loader!smooth-corners'
export default () => {
  const alreadyRegistered = sessionStorage.getItem('alreadyRegistered')
  if (alreadyRegistered === null) {
    CSS.paintWorklet.addModule(smoothCornersWorkletUrl)
    sessionStorage.setItem('alreadyRegistered', 'yes')
  }
}
