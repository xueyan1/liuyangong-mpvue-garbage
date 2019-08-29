export function setHistory (name) {
  let history = mpvue.getStorageSync('history') || []
  history.unshift(name)
  mpvue.setStorageSync('history', history)
}

export default {
  setHistory
}
