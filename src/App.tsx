import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Confetti from 'react-confetti'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Dices,
  Download,
  Gift,
  Images,
  RotateCcw,
  Share2,
  Star,
} from 'lucide-react'

type Screen = 'home' | 'keycap' | 'squishy' | 'photo'
type PhotoFrame = 'shinchan' | 'guchipachi'
const photoFilter = 'brightness(143%) contrast(110%)'
type Part = { name: string; image: string; color: string }
type Step = { text: string; hint: string; image: string }

const parts: Part[] = [
  { name: '딸기', image: '/assets/craft/part-strawberry.png', color: '#ff8b9c' },
  { name: '별', image: '/assets/craft/part-star.png', color: '#ffe34f' },
  { name: '리본', image: '/assets/craft/part-ribbon.png', color: '#ff9fce' },
  { name: '하트', image: '/assets/craft/part-heart.png', color: '#ff6d7e' },
  { name: '꽃', image: '/assets/craft/part-flower.png', color: '#fff28c' },
  { name: '무지개', image: '/assets/craft/part-rainbow.png', color: '#a9dfef' },
]

const sparkles = [
  { name: '보라', color: '#b78cff', image: '/assets/craft/squishy-purple.png' },
  { name: '파랑', color: '#73c8ff', image: '/assets/craft/squishy-blue.png' },
  { name: '하양', color: '#fffdf0', image: '/assets/craft/squishy-white.png' },
]

const keycapSteps: Step[] = [
  { text: '3구 키캡을 가져왔어요!', hint: '빈 키캡이 책상 위에 짠!', image: '/assets/craft/keycap-base.png' },
  { text: '원하는 파츠 3개를 골라주세요!', hint: '톡톡 눌러서 딱 3개!', image: '/assets/craft/part-star.png' },
  { text: '본드로 붙이는 중...', hint: '꾹 눌러서 튼튼하게!', image: '/assets/craft/glue.png' },
  { text: '나만의 키캡 완성!', hint: '세상에 하나뿐인 작품!', image: '/assets/craft/keycap-finished.png' },
]

const squishySteps: Step[] = [
  { text: '아이슬라임 베이스를 가져와요!', hint: '말랑말랑 준비 완료', image: '/assets/craft/slime-base.png' },
  { text: '액티를 넣어 슬라임을 만들어요!', hint: '쭉쭉 늘어나라!', image: '/assets/craft/activator.png' },
  { text: '스팽글 하나를 골라주세요!', hint: '반짝이는 색은 뭘까?', image: '/assets/craft/sequins-all.png' },
  { text: '투명공을 가져와요!', hint: '동글동글 투명공 등장', image: '/assets/craft/clear-ball.png' },
  { text: '투명공을 벌려 내용물을 넣어요!', hint: '슬라임을 쏙쏙!', image: '/assets/craft/fill-ball.png' },
  { text: '본드로 마개를 닫아요!', hint: '새지 않게 꼼꼼히', image: '/assets/craft/seal-ball.png' },
  { text: '반짝 말랑이 완성!', hint: '꾹 누르면 기분 최고!', image: '/assets/craft/squishy-purple.png' },
]

function rand<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function Doodles() {
  return (
    <>
      <span className="doodle left-[4%] top-[8%] rotate-12">⌒⌒</span>
      <span className="doodle right-[5%] top-[12%] -rotate-12">☆</span>
      <span className="doodle left-[7%] bottom-[12%] -rotate-12">〰️</span>
      <span className="doodle right-[7%] bottom-[8%] rotate-12">)))</span>
      <span className="doodle left-[48%] top-[2%] rotate-6">✎</span>
    </>
  )
}

function CraftImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`object-contain drop-shadow-[4px_5px_0_rgba(7,80,155,0.16)] ${className}`} />
}

const titleLetters = [
  { letter: '짱', color: '#ef292f', rotate: '-7deg', y: '8px' },
  { letter: '구', color: '#62b94c', rotate: '5deg', y: '14px' },
  { letter: '치', color: '#4aa7d8', rotate: '-5deg', y: '6px' },
  { letter: '파', color: '#ef292f', rotate: '6deg', y: '10px' },
  { letter: '치', color: '#ffd62e', rotate: '-5deg', y: '15px' },
]

function TitleLogo() {
  return (
    <h1 className="title-logo" aria-label="짱구치파치">
      {titleLetters.map(({ letter, color, rotate, y }, index) => (
        <motion.span
          key={`${letter}-${index}`}
          initial={{ opacity: 0, y: -40, rotate: 0 }}
          animate={{ opacity: 1, y, rotate }}
          transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 13 }}
          style={{ color }}
          className="title-letter"
          aria-hidden="true"
        >
          {letter}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 7 }}
        transition={{ delay: 0.48, type: 'spring', stiffness: 300 }}
        className="title-bang"
        aria-hidden="true"
      >
        !
      </motion.span>
    </h1>
  )
}

function ComicButton({
  children,
  color = 'bg-sunshine',
  onClick,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode
  color?: string
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.04, rotate: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.95, x: disabled ? 0 : 3, y: disabled ? 0 : 4 }}
      onClick={onClick}
      disabled={disabled}
      className={`comic-border rounded-[1.8rem] px-5 py-3 text-xl font-bold shadow-comic-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${color} ${className}`}
    >
      {children}
    </motion.button>
  )
}

function GiftGame() {
  const [opened, setOpened] = useState(false)
  const [showGift, setShowGift] = useState(false)

  const start = () => {
    if (showGift) return
    setShowGift(true)
    window.setTimeout(() => setOpened(true), 1500)
  }

  return (
    <div className="relative flex min-h-[290px] items-center justify-center">
      {opened && <Confetti recycle={false} numberOfPieces={260} gravity={0.22} />}
      <AnimatePresence>
        {!showGift && (
          <motion.button
            key="character"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, -3, 3, 0] }}
            exit={{ opacity: 0, y: -60, scale: 0.7 }}
            transition={{ duration: 0.5 }}
            onClick={start}
            className="group relative flex items-end justify-center"
            aria-label="짱구를 눌러 선물상자 열기"
          >
            <motion.img
              initial={{ opacity: 0, x: 40, scale: 0.6 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: [0, -7, 0] }}
              transition={{ opacity: { delay: 0.25 }, x: { delay: 0.25 }, scale: { delay: 0.25 }, y: { repeat: Infinity, duration: 1.8 } }}
              src="/assets/guchipachi-sticker.png"
              alt="구치파치"
              className="-mr-12 mb-3 h-32 w-32 object-contain drop-shadow-[5px_6px_0_rgba(42,42,56,0.18)] sm:-mr-14 sm:h-40 sm:w-40"
            />
            <motion.img
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              src="/assets/shinchan.png"
              alt="춤추는 짱구"
              className="relative z-10 h-64 w-64 object-contain drop-shadow-[7px_8px_0_rgba(42,42,56,0.2)]"
            />
          </motion.button>
        )}
        {showGift && (
          <motion.div
            key="gift"
            initial={{ opacity: 0, scale: 0, y: 80 }}
            animate={
              opened
                ? { opacity: 1, scale: 1.1, y: 20, rotate: 0 }
                : { opacity: 1, scale: 1, y: [40, 0, 28, 0], rotate: [0, -8, 8, 0] }
            }
            transition={{ duration: opened ? 0.5 : 1.3, ease: 'easeOut' }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              animate={opened ? { y: -82, rotate: -16, x: -25 } : {}}
              transition={{ type: 'spring', stiffness: 150 }}
              className="z-10 h-12 w-48 rounded-xl border-4 border-ink bg-sunshine"
            >
              <div className="mx-auto h-full w-10 bg-tomato" />
            </motion.div>
            <div className="relative -mt-1 flex h-36 w-44 items-center justify-center rounded-b-3xl border-4 border-ink bg-tomato shadow-comic">
              <Gift size={68} strokeWidth={2.5} className="text-sunshine" />
            </div>
            {opened && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: -8 }}
                className="speech comic-border absolute -top-28 whitespace-nowrap rounded-[2rem] bg-paper px-6 py-3 text-2xl font-bold text-tomato shadow-comic-sm sm:text-3xl"
              >
                행운의 거북이 당첨!!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {opened && (
        <button
          onClick={() => {
            setOpened(false)
            setShowGift(false)
          }}
          className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 text-lg font-bold"
        >
          <RotateCcw size={18} /> 다시 열기
        </button>
      )}
    </div>
  )
}

function HomeScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 pb-8">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-[20px] text-center"
      >
        <div className="mb-2 inline-flex -rotate-2 items-center gap-2 rounded-full bg-leaf px-4 py-1 text-xl font-bold">
          <Star size={20} fill="currentColor" /> 오늘의 만들기 놀이터
        </div>
        <TitleLogo />
        <p className="mt-7 text-2xl font-bold sm:text-3xl">키캡, 말랑이 만들고 사진도 찍자!</p>
      </motion.div>

      <GiftGame />

      <div className="mt-4 grid w-full max-w-5xl gap-5 sm:grid-cols-3">
        <motion.button
          whileHover={{ y: -7, rotate: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('keycap')}
          className="comic-border group relative overflow-hidden rounded-[2.5rem] bg-sunshine p-6 text-left shadow-comic"
        >
          <CraftImage src="/assets/craft/keycap-finished.png" alt="" className="h-20 w-28" />
          <h2 className="mt-3 text-4xl font-bold">키캡 만들기</h2>
          <p className="text-xl font-bold">귀여운 파츠 3개를 콕콕!</p>
          <ArrowRight className="absolute bottom-6 right-6 transition group-hover:translate-x-2" size={36} strokeWidth={3} />
        </motion.button>
        <motion.button
          whileHover={{ y: -7, rotate: 1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('squishy')}
          className="comic-border group relative overflow-hidden rounded-[2.5rem] bg-leaf p-6 text-left shadow-comic"
        >
          <CraftImage src="/assets/craft/squishy-purple.png" alt="" className="h-20 w-24" />
          <h2 className="mt-3 text-4xl font-bold">말랑이 만들기</h2>
          <p className="text-xl font-bold">반짝 슬라임을 쏙쏙!</p>
          <ArrowRight className="absolute bottom-6 right-6 transition group-hover:translate-x-2" size={36} strokeWidth={3} />
        </motion.button>
        <motion.button
          whileHover={{ y: -7, rotate: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('photo')}
          className="comic-border group relative overflow-hidden rounded-[2.5rem] bg-tomato p-6 text-left text-white shadow-comic"
        >
          <div className="flex h-20 items-center gap-1">
            <CraftImage src="/assets/shinchan.png" alt="" className="h-20 w-20" />
            <CraftImage src="/assets/guchipachi-sticker.png" alt="" className="h-16 w-16" />
          </div>
          <h2 className="mt-3 text-4xl font-bold">포토부스</h2>
          <p className="text-xl font-bold">프레임 골라서 찰칵!</p>
          <ArrowRight className="absolute bottom-6 right-6 transition group-hover:translate-x-2" size={36} strokeWidth={3} />
        </motion.button>
      </div>
    </main>
  )
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function drawPhotoFrame(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: PhotoFrame,
  character: HTMLImageElement,
) {
  const isShinchan = frame === 'shinchan'
  const main = isShinchan ? '#f04444' : '#a8d400'
  const accent = isShinchan ? '#ffe34f' : '#8bd7ff'
  const ink = '#07509b'

  context.lineWidth = Math.max(18, width * 0.025)
  context.strokeStyle = ink
  context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, width - context.lineWidth, height - context.lineWidth)
  context.lineWidth = Math.max(12, width * 0.016)
  context.strokeStyle = main
  context.strokeRect(context.lineWidth * 2, context.lineWidth * 2, width - context.lineWidth * 4, height - context.lineWidth * 4)

  context.fillStyle = accent
  context.fillRect(0, 0, width, height * 0.105)
  context.fillRect(0, height * 0.88, width, height * 0.12)

  context.fillStyle = ink
  context.textAlign = 'center'
  context.font = `700 ${Math.round(width * 0.055)}px Gaegu, cursive`
  context.fillText(isShinchan ? '짱구랑 찰칵!' : '구치파치랑 찰칵!', width / 2, height * 0.075)
  context.font = `700 ${Math.round(width * 0.035)}px Gaegu, cursive`
  context.fillText('짱구치파치 PHOTO BOOTH', width / 2, height * 0.955)

  const characterWidth = width * (isShinchan ? 0.32 : 0.27)
  const characterHeight = characterWidth * (character.height / character.width)
  const characterX = isShinchan ? width - characterWidth * 0.95 : width * 0.015
  const characterY = height - characterHeight - height * 0.09
  context.drawImage(character, characterX, characterY, characterWidth, characterHeight)

  context.fillStyle = main
  context.font = `700 ${Math.round(width * 0.06)}px Gaegu, cursive`
  context.fillText('☆', width * 0.1, height * 0.18)
  context.fillText('☆', width * 0.88, height * 0.27)
  context.fillText('♡', width * 0.12, height * 0.78)
}

function PhotoBooth({ goHome }: { goHome: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [frame, setFrame] = useState<PhotoFrame>('shinchan')
  const [cameraReady, setCameraReady] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState('')

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraReady(false)
  }

  useEffect(() => () => stopCamera(), [])

  const startCamera = async () => {
    setError('')
    setPhoto(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraReady(true)
    } catch {
      setError('카메라를 켤 수 없어요. 카메라 권한을 허용해주세요!')
    }
  }

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return
    for (const number of [3, 2, 1]) {
      setCountdown(number)
      await new Promise((resolve) => window.setTimeout(resolve, 700))
    }
    setCountdown(0)

    const video = videoRef.current
    const canvas = canvasRef.current
    const width = 900
    const height = 1200
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return

    const videoRatio = video.videoWidth / video.videoHeight
    const targetRatio = width / height
    let sourceWidth = video.videoWidth
    let sourceHeight = video.videoHeight
    let sourceX = 0
    let sourceY = 0
    if (videoRatio > targetRatio) {
      sourceWidth = video.videoHeight * targetRatio
      sourceX = (video.videoWidth - sourceWidth) / 2
    } else {
      sourceHeight = video.videoWidth / targetRatio
      sourceY = (video.videoHeight - sourceHeight) / 2
    }

    context.save()
    context.translate(width, 0)
    context.scale(-1, 1)
    context.filter = photoFilter
    context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height)
    context.restore()
    context.filter = 'none'
    const character = await loadImage(frame === 'shinchan' ? '/assets/shinchan.png' : '/assets/guchipachi-sticker.png')
    drawPhotoFrame(context, width, height, frame, character)
    setPhoto(canvas.toDataURL('image/png'))
    setCountdown(null)
    stopCamera()
  }

  const download = () => {
    if (!photo) return
    const link = document.createElement('a')
    link.download = `zzangguchipachi-${frame}-${Date.now()}.png`
    link.href = photo
    link.click()
  }

  const share = async () => {
    if (!photo) return
    const response = await fetch(photo)
    const blob = await response.blob()
    const file = new File([blob], `zzangguchipachi-${frame}.png`, { type: 'image/png' })

    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({
          title: '짱구치파치 포토부스',
          text: '짱구치파치에서 찍은 사진이에요!',
          files: [file],
        })
        return
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === 'AbortError') return
      }
    }

    download()
    setError('이 기기는 공유창을 지원하지 않아 사진으로 저장했어요!')
  }

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={goHome} className="comic-border rounded-full bg-paper p-2 shadow-comic-sm" aria-label="처음으로">
          <ArrowLeft size={28} strokeWidth={3} />
        </button>
        <div>
          <p className="text-lg font-bold text-tomato">찰칵찰칵 추억 남기기</p>
          <h1 className="text-4xl font-bold sm:text-5xl">짱구치파치 포토부스</h1>
        </div>
      </div>

      <div className="grid flex-1 gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="comic-border relative flex min-h-[470px] items-center justify-center overflow-hidden rounded-[2.5rem] bg-ink p-4 shadow-comic">
          <div className="relative aspect-[3/4] h-auto max-h-[72vh] w-full max-w-[54vh] overflow-hidden rounded-[1.8rem] bg-ink">
            {!photo && (
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ filter: photoFilter }}
                className={`h-full w-full object-cover [transform:scaleX(-1)] ${cameraReady ? 'block' : 'hidden'}`}
              />
            )}
            {photo && <img src={photo} alt="촬영 결과" className="h-full w-full object-contain" />}
            {!cameraReady && !photo && (
              <div className="flex h-full flex-col items-center justify-center px-5 text-center text-white">
                <Images size={88} strokeWidth={2.5} className="text-sunshine" />
                <p className="mt-4 text-3xl font-bold">프레임을 고르고 카메라를 켜주세요!</p>
                <p className="text-xl font-bold text-skycrayon">사진은 기기에만 저장돼요.</p>
              </div>
            )}
            {cameraReady && !photo && (
              <div className={`pointer-events-none absolute inset-0 rounded-[1.8rem] ${frame === 'shinchan' ? 'photo-frame-shinchan' : 'photo-frame-guchipachi'}`}>
                <img
                  src={frame === 'shinchan' ? '/assets/shinchan.png' : '/assets/guchipachi-sticker.png'}
                  alt=""
                  className={`absolute bottom-5 h-32 w-32 object-contain sm:h-44 sm:w-44 ${frame === 'shinchan' ? 'right-2' : 'left-2'}`}
                />
                <div className="absolute inset-x-0 top-0 py-2 text-center text-2xl font-bold text-ink">
                  {frame === 'shinchan' ? '짱구랑 찰칵!' : '구치파치랑 찰칵!'}
                </div>
              </div>
            )}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-ink/20 text-[10rem] font-bold text-white drop-shadow-[7px_8px_0_#f04444]"
                >
                  {countdown === 0 ? '찰칵!' : countdown}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </section>

        <aside className="comic-border flex flex-col rounded-[2.5rem] bg-paper/95 p-5 shadow-comic">
          <h2 className="text-3xl font-bold">어떤 친구랑 찍을까요?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {([
              { id: 'shinchan', name: '짱구 프레임', image: '/assets/shinchan.png', color: 'bg-tomato' },
              { id: 'guchipachi', name: '구치파치 프레임', image: '/assets/guchipachi-sticker.png', color: 'bg-leaf' },
            ] as const).map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setFrame(item.id)
                  setPhoto(null)
                }}
                className={`comic-border rounded-3xl p-3 shadow-comic-sm ${item.color} ${frame === item.id ? 'ring-4 ring-sunshine' : ''}`}
              >
                <CraftImage src={item.image} alt="" className="mx-auto h-28 w-28" />
                <span className={`whitespace-nowrap text-lg font-bold sm:text-xl ${item.id === 'shinchan' ? 'text-white' : ''}`}>{item.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="speech comic-border mt-6 rounded-3xl bg-skycrayon px-4 py-3 text-center text-2xl font-bold shadow-comic-sm">
            {photo ? '사진 완성! 저장하거나 다시 찍어요!' : cameraReady ? '준비됐으면 찰칵 버튼!' : '카메라 앞에서 멋진 포즈!'}
          </div>
          {error && <p className="mt-5 rounded-2xl bg-tomato p-3 text-center text-xl font-bold text-white">{error}</p>}

          <div className="mt-auto grid gap-3 pt-7">
            {!cameraReady && !photo && (
              <ComicButton onClick={startCamera} color="bg-sunshine" className="w-full">
                <span className="flex items-center justify-center gap-2"><Camera /> 카메라 켜기</span>
              </ComicButton>
            )}
            {cameraReady && !photo && (
              <ComicButton onClick={capture} color="bg-tomato text-white" className="w-full">
                <span className="flex items-center justify-center gap-2"><Camera /> 3초 후 찰칵!</span>
              </ComicButton>
            )}
            {photo && (
              <>
                <ComicButton onClick={startCamera} color="bg-skycrayon" className="w-full">
                  <span className="flex items-center justify-center gap-2"><RotateCcw /> 다시 찍기</span>
                </ComicButton>
                <ComicButton onClick={download} color="bg-leaf" className="w-full">
                  <span className="flex items-center justify-center gap-2"><Download /> 사진 저장하기</span>
                </ComicButton>
                <ComicButton onClick={share} color="bg-tomato text-white" className="w-full">
                  <span className="flex items-center justify-center gap-2"><Share2 /> 사진 공유하기</span>
                </ComicButton>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

function KeycapVisual({ selected, step }: { selected: Part[]; step: number }) {
  return (
    <div className="relative flex h-56 items-center justify-center sm:h-72">
      {step === 0 && (
        <motion.div initial={{ x: -250, rotate: -20 }} animate={{ x: 0, rotate: 0 }}>
          <CraftImage src="/assets/craft/keycap-base.png" alt="3구 키캡" className="h-52 w-80 sm:h-64 sm:w-[26rem]" />
        </motion.div>
      )}
      {step >= 1 && (
        <motion.div
          layout
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: step === 3 ? [1, 1.08, 1] : 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-48 w-[22rem] sm:h-64 sm:w-[30rem]"
        >
          <CraftImage src="/assets/craft/keycap-base.png" alt="3구 키캡" className="absolute inset-0 h-full w-full" />
          {[0, 1, 2].map((slot) => (
            <motion.div
              key={slot}
              animate={step === 2 ? { y: [0, 4, 0] } : {}}
              transition={{ repeat: step === 2 ? Infinity : 0, delay: slot * 0.2 }}
              className={`absolute top-[24%] flex h-16 w-16 items-center justify-center sm:h-24 sm:w-24 ${
                slot === 0 ? 'left-[13%]' : slot === 1 ? 'left-[39%]' : 'left-[65%]'
              }`}
            >
              <AnimatePresence mode="wait">
                {selected[slot] ? (
                  <motion.img
                    key={selected[slot].name}
                    initial={{ scale: 0, y: -80 }}
                    animate={{ scale: 1, y: 0 }}
                    src={selected[slot].image}
                    alt={selected[slot].name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <motion.span key="empty" className="text-4xl font-bold text-ink/20">?</motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {step === 2 && (
            <motion.img
              animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
              transition={{ repeat: Infinity }}
              src="/assets/craft/glue.png"
              alt="본드"
              className="absolute -right-10 -top-12 h-32 w-32 object-contain"
            />
          )}
        </motion.div>
      )}
      {step === 3 && <Confetti recycle={false} numberOfPieces={160} />}
    </div>
  )
}

function SquishyVisual({ sparkle, step }: { sparkle: (typeof sparkles)[number] | null; step: number }) {
  const images = squishySteps.map((item) => item.image)
  images[6] = sparkle?.image ?? '/assets/craft/squishy-purple.png'
  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden sm:h-72">
      {images.slice(0, step + 1).map((image, index) => (
          <motion.img
            key={`${image}-${index}`}
            initial={{ opacity: 0, x: index % 2 ? 180 : -180, y: -80 }}
            animate={{
              opacity: index === step ? 1 : 0.18,
              x: index === step ? 0 : (index - step / 2) * 38,
              y: index === step ? 0 : 70,
              rotate: index % 2 ? 8 : -8,
              scale: index === step ? 1 : 0.55,
            }}
            src={image}
            alt=""
            className="absolute h-44 w-44 object-contain sm:h-60 sm:w-60"
          />
        ))}
      {step === 6 && <Confetti recycle={false} numberOfPieces={180} />}
    </div>
  )
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto px-1 py-2">
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          animate={{ scale: index === current ? 1.18 : 1 }}
          className={`flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-ink text-lg font-bold ${
            index < current ? 'bg-leaf' : index === current ? 'bg-sunshine' : 'bg-paper/70'
          }`}
        >
          {index < current ? <Check size={18} strokeWidth={4} /> : index + 1}
        </motion.div>
      ))}
    </div>
  )
}

function CompletionStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 2.8, rotate: -18, y: -180 }}
      animate={{
        opacity: [0, 1, 1],
        scale: [2.8, 0.82, 1.08, 1],
        rotate: [-18, 7, -3, 0],
        y: [-180, 12, -4, 0],
      }}
      transition={{ duration: 0.72, times: [0, 0.52, 0.78, 1], ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [0, -2, 2, 0] }}
        transition={{ delay: 0.72, duration: 0.28 }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.35, 0], scale: [0.4, 1.35, 1.8] }}
          transition={{ delay: 0.38, duration: 0.55 }}
          className="absolute inset-2 rounded-full border-[10px] border-[#b72038]"
        />
        <img
          src="/assets/well-done-stamp-sticker.png"
          alt="참 잘했어요 도장"
          className="h-52 w-52 -rotate-6 object-contain drop-shadow-[7px_9px_0_rgba(183,32,56,0.18)] sm:h-64 sm:w-64"
        />
        <motion.span
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: [0, 1.35, 1], rotate: [-20, 6, 0] }}
          transition={{ delay: 0.42, duration: 0.42 }}
          className="comic-border absolute -right-6 -top-5 rounded-full bg-sunshine px-4 py-1 text-3xl font-bold text-tomato shadow-comic-sm"
        >
          쾅!
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

function Workshop({ kind, goHome }: { kind: 'keycap' | 'squishy'; goHome: () => void }) {
  const isKeycap = kind === 'keycap'
  const steps = isKeycap ? keycapSteps : squishySteps
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Part[]>([])
  const [sparkle, setSparkle] = useState<(typeof sparkles)[number] | null>(null)
  const selectionStep = isKeycap ? step === 1 : step === 2
  const canNext = isKeycap ? step !== 1 || selected.length === 3 : step !== 2 || sparkle !== null

  const togglePart = (part: Part) => {
    setSelected((current) => {
      if (current.some((item) => item.name === part.name)) return current.filter((item) => item.name !== part.name)
      return current.length < 3 ? [...current, part] : current
    })
  }

  const randomParts = () => setSelected([...parts].sort(() => Math.random() - 0.5).slice(0, 3))
  const randomSparkle = () => setSparkle(rand(sparkles))

  useEffect(() => {
    if (isKeycap && step === 2) {
      const timer = window.setTimeout(() => setStep(3), 1900)
      return () => window.clearTimeout(timer)
    }
  }, [isKeycap, step])

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={goHome} className="comic-border rounded-full bg-paper p-2 shadow-comic-sm" aria-label="처음으로">
          <ArrowLeft size={28} strokeWidth={3} />
        </button>
        <div>
          <p className="text-lg font-bold text-tomato">{isKeycap ? '콕콕 키캡 공방' : '말랑말랑 연구소'}</p>
          <h1 className="text-4xl font-bold sm:text-5xl">{isKeycap ? '키캡 만들기' : '말랑이 만들기'}</h1>
        </div>
      </div>

      <StepDots total={steps.length} current={step} />

      <div className="mt-3 grid flex-1 gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="comic-border relative min-h-[350px] overflow-hidden rounded-[2.5rem] bg-paper/95 p-4 shadow-comic sm:p-6">
          <img src="/assets/kindergarten-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          {step === steps.length - 1 && <CompletionStamp />}
          <div className="relative z-10">
            <motion.div
              key={steps[step].text}
              initial={{ opacity: 0, y: -20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              className="speech comic-border mx-auto max-w-lg rounded-[2rem] bg-white px-5 py-3 text-center shadow-comic-sm"
            >
              <p className="text-2xl font-bold sm:text-3xl">{steps[step].text}</p>
              <p className="text-lg font-bold text-tomato">{steps[step].hint}</p>
            </motion.div>
            <div className="mt-7">
              {isKeycap ? <KeycapVisual selected={selected} step={step} /> : <SquishyVisual sparkle={sparkle} step={step} />}
            </div>
          </div>
        </section>

        <aside className="comic-border flex min-h-[250px] flex-col rounded-[2.5rem] bg-skycrayon/95 p-5 shadow-comic">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{selectionStep ? '재료를 골라요!' : '지금 필요한 재료'}</h2>
            <motion.img
              key={step}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              src={!isKeycap && step === steps.length - 1 && sparkle ? sparkle.image : steps[step].image}
              alt=""
              className="h-20 w-20 object-contain"
            />
          </div>

          {isKeycap && step === 1 && (
            <>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {parts.map((part) => {
                  const active = selected.some((item) => item.name === part.name)
                  return (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      key={part.name}
                      onClick={() => togglePart(part)}
                      style={{ backgroundColor: active ? part.color : '#fffdf0' }}
                      className={`comic-border rounded-2xl p-2 text-center shadow-comic-sm ${active ? '-translate-y-1' : ''}`}
                    >
                      <CraftImage src={part.image} alt="" className="mx-auto h-16 w-16" />
                      <span className="text-lg font-bold">{part.name}</span>
                    </motion.button>
                  )
                })}
              </div>
              <ComicButton onClick={randomParts} color="bg-tomato text-white" className="mt-5 w-full">
                <span className="flex items-center justify-center gap-2"><Dices /> 랜덤 파츠 3개 뽑기</span>
              </ComicButton>
              <p className="mt-3 text-center text-xl font-bold">선택 완료 {selected.length} / 3</p>
            </>
          )}

          {!isKeycap && step === 2 && (
            <>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {sparkles.map((item) => (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    key={item.name}
                    onClick={() => setSparkle(item)}
                    style={{ backgroundColor: item.color }}
                    className={`comic-border rounded-2xl p-3 shadow-comic-sm ${sparkle?.name === item.name ? '-translate-y-2 ring-4 ring-tomato' : ''}`}
                  >
                    <CraftImage src={item.image} alt="" className="mx-auto h-20 w-20" />
                    <span className="text-xl font-bold">{item.name}</span>
                  </motion.button>
                ))}
              </div>
              <ComicButton onClick={randomSparkle} color="bg-tomato text-white" className="mt-5 w-full">
                <span className="flex items-center justify-center gap-2"><Dices /> 랜덤 스팽글 뽑기</span>
              </ComicButton>
              {sparkle && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="speech comic-border mt-5 rounded-2xl bg-paper p-3 text-center text-2xl font-bold shadow-comic-sm">
                  오늘은 {sparkle.name} 반짝이!
                </motion.div>
              )}
            </>
          )}

          {!selectionStep && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <motion.img
                key={step}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: [0, 6, -6, 0] }}
                src={!isKeycap && step === steps.length - 1 && sparkle ? sparkle.image : steps[step].image}
                alt=""
                className="h-40 w-40 object-contain sm:h-52 sm:w-52"
              />
              <p className="mt-4 text-2xl font-bold">{step === steps.length - 1 ? '참 잘했어요! 도장 쾅!' : '화면에서 재료가 합쳐지는 걸 봐요!'}</p>
            </div>
          )}

          <div className="mt-auto flex gap-3 pt-5">
            <ComicButton onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} color="bg-paper" className="flex-1">
              이전
            </ComicButton>
            {step < steps.length - 1 ? (
              <ComicButton
                onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                disabled={!canNext || (isKeycap && step === 2)}
                color="bg-sunshine"
                className="flex-1"
              >
                다음
              </ComicButton>
            ) : (
              <ComicButton onClick={goHome} color="bg-leaf" className="flex-1">
                완성!
              </ComicButton>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const goHome = () => setScreen('home')

  return (
    <div className="crayon-bg relative flex min-h-screen flex-col overflow-hidden">
      <Doodles />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28vh] opacity-20">
        <img src="/assets/friends-bg.png" alt="" className="h-full w-full object-cover object-top" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1"
        >
          {screen === 'home' && <HomeScreen setScreen={setScreen} />}
          {(screen === 'keycap' || screen === 'squishy') && <Workshop kind={screen} goHome={goHome} />}
          {screen === 'photo' && <PhotoBooth goHome={goHome} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
