import Card from '../../src/js/card/index.js'

const card1 = new Card({
  el: '.js-card'
})

const card2 = new Card({
  el: '.js-card--always',
  shadow: 'always'
})

const card3 = new Card({
  el: '.js-card--hover',
  shadow: 'hover'
})
/* eslint-disable no-alert */
card1.on('click', () => alert('我是card1'), true)
card2.on('click', () => alert('我是card2'), true)
card3.on('click', () => alert('我是card3'), true)

const oDestroyBtn = document.querySelector('.destroy-btn')
oDestroyBtn.addEventListener('click', () => {
  if (!card2.el) {
    alert('卡片2已经销毁！')
    return
  }
  card2.destroy()
  alert('卡片2将被销毁！')
})
