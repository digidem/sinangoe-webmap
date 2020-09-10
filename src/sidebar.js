const css = require('sheetify')
const marked = require('marked')
const html = require('nanohtml')
const raw = require('nanohtml/raw')
const onIntersectOrig = require('on-intersect')
var document = require('global/document')
var content = require('../_data/data.json')

var ZoomableImage = require('./image')
var ZoomableVideo = require('./video')

// TODO: programmatically set default language based on settings
const DEFAULT_LANGUAGE = 'es'

function onIntersect () {
  if (typeof window === 'undefined') return
  onIntersectOrig.apply(null, arguments)
}

var map

var mapTransition = require('./map_transition')

const IMAGE_URL = 'https://stupefied-meitner-092e19.netlify.com'

function mapView (id, el, onenter, onexit) {
  var mobile = isMobile()
  // Don't consider title in map view until more than 40% from bottom
  // of the viewport
  var rootMarginWithMap = '0px 0px -40% 0px'
  var rootMarginMobile = '-100% 0px 0px 0px'
  onIntersect(el, {
    root: document.getElementById('#scroll-container'),
    rootMargin: mobile ? rootMarginMobile : rootMarginWithMap
  }, function () {
    onenter(id)
  }, function () {
    onexit()
  })
  return el
}

function video (url, opts) {
  return ZoomableVideo().render({
    placeholder: IMAGE_URL + opts.placeholderImg,
    url: url,
    background: opts.background
  })
}

function image (path) {
  return ZoomableImage().render(IMAGE_URL + path)
}

var style = css`
  :host {
    width: 100%;
    position: fixed;
    z-index: 2;
    height: 100%;
    overflow: hidden;
    transform: translateZ(0);
    .mobile-background {
      display: none;
    }
    #scroll-container {
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%
    }
    #sidebar {
      z-index: 999;
      color: white;
      section {
        min-height: 100vh;
        padding-bottom: 20vh;
        padding-top: 4em;
        box-sizing: border-box;
      }
      section:last-child {
        padding-bottom: 10vh;
      }
      section:first-child {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 0;
      }
      .caption {
        text-align: left;
        margin-top: 10px;
        color: #ccc;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      h1 {
        line-height: 1.3;
        font-size: 3rem;
      }
      h2 {
        font-size: 2.4rem;
      }
      h3 {
        font-size: 2rem;
      }
      p {
        line-height: 1.75;
        margin-bottom: 2em;
        margin-top: 2em;
        font-size: 1.1rem;
        a {
          color: #fff;
        }
      }
      p.big {
        font-weight: bold;
        font-size: 1.3em;
      }
      p.footnote {
        font-size: .8em;
        padding-top: 20px;
        color: #ccc;
      }
    }
  }
  .button-action {
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: #fa4e0e;
    border-radius: 10%;
    text-shadow: none;
    color: white;
    transition: all 0.75s ease-out 0s;
    cursor: pointer;
    outline: 0;
    border: 0;
    padding: 20px;
    margin: auto;
    font-family: FuturaPassata, Helvetica, sans-serif;
    text-decoration: none;
    font-size: 1rem;
    &:hover {
      background: #fff;
      color: #fa4e0e;
      text-decoration: none;
      transition: all 0.75s ease 0s;
      text-shadow: none;
    }
  }
  @media only screen and (max-width: 600px) {
    :host {
      background-color: black;
      .mobile-background {
        display: block;
        transition: opacity 500ms linear;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      #scroll-container {
        padding: 10px;
        box-sizing: border-box;
      }
      #sidebar {
        section {
          p:last-child {
            margin-bottom: 0;
          }
          padding-bottom: 75vh;
          padding-top: 0;
        }
        section > h1:first-child, section > h2:first-child, section > h3:first-child  {
          padding-top: 50vh;
        }
        section:first-child > h1:first-child {
          padding-top: 0;
        }
      }
      #scroll-container {
        padding: 10px;
        box-sizing: border-box;
      }
    }
    :host:before {
      content: attr(data-content);
      padding-bottom: 20vh;
      font-size: 40px;
      font-weight: bold;
      text-transform: uppercase;
      color: white;
    }
  }
  @media only screen and (min-width: 601px) {
    :host {
      background: linear-gradient(to right, rgba(22,22,22, .6), rgba(22,22,22, .4) 40%, rgba(22,22,22, .2) 60%, transparent 70%);
      #sidebar {
        padding-left: 20px;
        width: 45%;
        box-sizing: border-box;
        max-width: 600px;
      }
    }
  }
  @media only screen and (min-width: 1333px) {
    :host {
      background: linear-gradient(to right, rgba(22,22,22, .6), rgba(22,22,22, .4) 533px, rgba(22,22,22, .2) 666px, transparent 933px);
    }
  }
`

module.exports = function (lang, _map) {
  map = _map
  var i = 0
  var mobileBackground = html`<div class='mobile-background' />`
  var entered = true

  function message (key) {
    var msg = key[lang]
    return !msg ? key[DEFAULT_LANGUAGE] : msg
  }

  function onenter (id) {
    entered = true
    var mobile = isMobile()
    var sidebarWidth = document.getElementById('sidebar').clientWidth || 500
    if (map) {
      mapTransition(id, map, {
        padding: {top: 0, left: sidebarWidth, right: 0, bottom: 0}
      })
    }
    if (!mobile) return
    var img = new Image()
    var imageUrl = '/screenshots/' + id + '.jpg'
    img.onload = function () {
      if (mobileBackground.style.backgroundImage.indexOf(imageUrl) > -1) {
        mobileBackground.style.opacity = 1
        return
      }
      mobileBackground.addEventListener('transitionend', switchImage)
      mobileBackground.style.opacity = 0
    }
    function switchImage () {
      mobileBackground.removeEventListener('transitionend', switchImage)
      mobileBackground.style.backgroundImage = 'url(' + imageUrl + ')'
      // don't change opacity if we have exited whilst loading
      if (!entered) mobileBackground.style.opacity = 0.3
      else mobileBackground.style.opacity = 1
    }
    img.src = imageUrl
  }

  function onexit () {
    entered = false
    var mobile = isMobile()
    if (!mobile) return
    mobileBackground.style.opacity = 0.3
  }

  function sidebar () {
    var allSections = content.sections.map((section) => {
      var autoScroll = mapView(section.id, html`<h1>${message({
        // this is a hack b/c
        // netlify doesnt allow titles to be objects
        es: section.title,
        en: section.title_en
      })}</h1>`, onenter, onexit)
      if (!section.content) return ''
      var contents = section.content.map((item) => {
        switch (item.type) {
          case 'video':
            return video(item.url, {
              background: item.background,
              placeholderImg: item.placeholderImg
            })
          case 'text':
            return html`${raw(marked(message(item)))}`
          case 'image':
            return image(item.image)
          default:
            return raw(message(item))
        }
      })
      contents.unshift(autoScroll)
      return contents
    })

    return allSections
  }

  return html`<div id="sidebar-wrapper" class=${style}>
  ${mobileBackground}
  <div id="scroll-container">
    <div id="sidebar">
      ${sidebar()}
    </div>
  </div>
  </div>`
}

function isMobile () {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 601
}

