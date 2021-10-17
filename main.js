const btnClick1 = document.querySelector('.clickme') 
const btnClick3 = document.querySelector('.clickme3') 


const contentBody = document.querySelector('.content-body')
const root = document.querySelector('#root')
const cakeContainer = document.querySelector('#cake-container')

const choseImg = document.querySelector('.chosen-img')
const giftEnd = document.querySelector('.gift-end')
const imgGiftEnd = document.querySelector('.giftend')

const header1 = document.querySelector('.header1')
const header2 = document.querySelector('.header2')





const music = document.querySelector('#music')


const canvas = document.getElementById('preview')
const fileInput = document.querySelector('input[type="file"')
const asciiImage = document.getElementById('ascii')
const btnConvert = document.getElementById('btn-convert')


music.volume = 0.1
music.style.display ='none'



console.log(btnClick1)
console.log({root})

function renderBanhSinhNhat(){
    cakeContainer.style.display ='block'
    btnClick1.style.display='none'
    music.currentTime = 48
}

function renderImg(){
    choseImg.style.display ='block'
    cakeContainer.style.display ='none'
}
function showGift(){
    giftEnd.style.display='flex'
    imgGiftEnd.style.display='none'
}
function hiddenCake(){
    choseImg.style.display ='none'
    cakeContainer.style.display ='none'
}
function renderGiftEnd(){
    imgGiftEnd.style.display ='block'
    btnClick3.style.display='none'
    asciiImage.style.display='none'
    header1.style.display='none'
    header2.style.display='block'
}

btnClick1.onclick = renderBanhSinhNhat






// 


const context = canvas.getContext('2d')
const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b

const getFontRatio = () => {
  const pre = document.createElement('pre')
  pre.style.display = 'inline'
  pre.textContent = '0'

  document.body.appendChild(pre)
  const { width, height } = pre.getBoundingClientRect()
  document.body.removeChild(pre)
  return height / width
}

const fontRatio = getFontRatio()

const convertToGrayScales = (context, width, height) => {
  const imageData = context.getImageData(0, 0, width, height)
  const grayScales = []

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]

    const grayScale = toGrayScale(r, g, b)
    imageData.data[i] =
      imageData.data[i + 1] =
      imageData.data[i + 2] =
        grayScale

    grayScales.push(grayScale)
  }

  context.putImageData(imageData, 0, 0)
  return grayScales
}


const MAXIMUM_WIDTH = 300
const MAXIMUM_HEIGHT = 300

const clampDimensions = (width, height) => {
  const rectifiedWidth = Math.floor(fontRatio * width)

  if (height > MAXIMUM_HEIGHT) {
    const reducedWidth = Math.floor((rectifiedWidth * MAXIMUM_HEIGHT) / height)
    return [reducedWidth, MAXIMUM_HEIGHT]
  }

  if (width > MAXIMUM_WIDTH) {
    const reducedHeight = Math.floor((height * MAXIMUM_WIDTH) / rectifiedWidth)
    return [MAXIMUM_WIDTH, reducedHeight]
  }

  return [rectifiedWidth, height]
}

const previewImage = (image) => {
  const img = document.createElement('img')
  img.src = image
  document.getElementById('uploaded-image').appendChild(img)
}

fileInput.onchange = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (event) => {
    const image = new Image()
    image.onload = () => {
      const [width, height] = clampDimensions(image.width, image.height)
      canvas.width = width
      canvas.height = height

      context.drawImage(image, 0, 0, width, height)
      const grayScales = convertToGrayScales(context, width, height)
      fileInput.style.display = 'none'
      btnConvert.addEventListener('click', () => {
        drawAscii(grayScales, width)
        hiddenCake()
        showGift()
      })
    }
    previewImage(event.target.result)
    image.src = event.target.result
  }

  reader.readAsDataURL(file)
}

// const grayRamp =
//   '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ' Khong tot
// const grayRamp = '@%#*+=-:. ' khong tot
    // const grayRamp = '@w#$kdtji. ' khong tot
    // const grayRamp = ' .,:;ox%#@'
    const grayRamp ='@#%xo;:,. '
  
const rampLength = grayRamp.length

const getCharacterForGrayScale = (grayScale) =>
  grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)]

const drawAscii = (grayScales, width) => {
  const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
    let nextChars = getCharacterForGrayScale(grayScale)
    if ((index + 1) % width === 0) {
      nextChars += '\n'
    }
    return asciiImage + nextChars
  }, '')

  asciiImage.textContent = ''
  let i = 0
  const interval = setInterval(() => {
    for (let j = 0; j < 160; j++) {
      asciiImage.textContent += ascii[i]
      i++
      if (i >= ascii.length) {
        clearInterval(interval)
        break
      }
    }
  }, 1)
}
