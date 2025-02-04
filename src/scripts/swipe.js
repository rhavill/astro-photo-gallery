let touchstartX = 0
let touchendX = 0

function registerSwipe({onSwipeLeft, onSwipeRight}) {
  onSwipeLeft();
  onSwipeRight();
}

function checkDirection() {
  if (touchendX < touchstartX) alert('swiped left!')
  if (touchendX > touchstartX) alert('swiped right!')
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})
console.log('loaded swipe')