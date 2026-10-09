import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MapPin, MoveRight, Pause, Play, Repeat2, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import './App.css'

const MetroScene = lazy(() => import('@/components/MetroScene').then((module) => ({ default: module.MetroScene })))
const currentYear = new Date().getFullYear()

const projects = [
  {
    number: '01',
    name: 'Signal Archive',
    type: 'Product experience',
    description: 'A placeholder case study for a product that turns real-time signals into calm, confident decisions.',
    stack: ['React', 'Motion', 'Design system'],
    colour: 'orange',
  },
  {
    number: '02',
    name: 'Night Shift',
    type: 'Brand & interface',
    description: 'A demo project representing a visual identity and conversion-led website for an after-hours creative studio.',
    stack: ['Strategy', 'UI/UX', 'WebGL'],
    colour: 'blue',
  },
  {
    number: '03',
    name: 'Platform Zero',
    type: 'Experimental build',
    description: 'A concept for a tactile, story-first web experience where every stop reveals a different layer of the work.',
    stack: ['Three.js', 'Prototype', 'Interaction'],
    colour: 'violet',
  },
] as const

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function App() {
  const [activeProject, setActiveProject] = useState(0)
  const [openProject, setOpenProject] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioContext = useRef<AudioContext | null>(null)
  const oscillator = useRef<OscillatorNode | null>(null)
  const gain = useRef<GainNode | null>(null)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)

    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  const motionDisabled = reducedMotion || motionPaused

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (motionDisabled) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [motionDisabled])

  useEffect(() => {
    return () => {
      oscillator.current?.stop()
      void audioContext.current?.close()
    }
  }, [])

  const toggleSound = async () => {
    if (soundEnabled) {
      oscillator.current?.stop()
      oscillator.current = null
      gain.current = null
      setSoundEnabled(false)
      return
    }

    const context = audioContext.current ?? new AudioContext()
    audioContext.current = context
    await context.resume()

    const nextOscillator = context.createOscillator()
    const nextGain = context.createGain()
    nextOscillator.type = 'sine'
    nextOscillator.frequency.setValueAtTime(56, context.currentTime)
    nextGain.gain.setValueAtTime(0.012, context.currentTime)
    nextOscillator.connect(nextGain)
    nextGain.connect(context.destination)
    nextOscillator.start()
    oscillator.current = nextOscillator
    gain.current = nextGain
    setSoundEnabled(true)
  }

  const selectedProject = projects[activeProject]

  return (
    <div className={`app-shell ${motionDisabled ? 'is-motion-paused' : ''}`}>
      <header className="site-header">
        <button className="wordmark" onClick={() => scrollToSection('arrival')} type="button">
          <span className="wordmark__mark" aria-hidden="true">MM</span>
          <span>Midnight Metro</span>
        </button>
        <nav aria-label="Primary navigation" className="site-nav">
          <a href="#projects">Projects</a>
          <a href="#route">Route map</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-controls">
          <Tooltip>
            <TooltipTrigger
              aria-label={motionPaused ? 'Resume website motion' : 'Pause website motion'}
              aria-pressed={motionPaused}
              className="sound-toggle sound-toggle--icon"
              onClick={() => setMotionPaused((paused) => !paused)}
            >
              {motionPaused ? <Play size={17} /> : <Pause size={17} />}
            </TooltipTrigger>
            <TooltipContent>{motionPaused ? 'Resume motion' : 'Pause motion'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              aria-label={soundEnabled ? 'Mute rail ambience' : 'Play rail ambience'}
              aria-pressed={soundEnabled}
              className="sound-toggle"
              onClick={() => void toggleSound()}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
              <span>{soundEnabled ? 'Sound on' : 'Sound off'}</span>
            </TooltipTrigger>
            <TooltipContent>{soundEnabled ? 'Mute rail ambience' : 'Play a subtle rail hum'}</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <main>
        <section className="hero-section" id="arrival">
          <div className="metro-scene">
            <Suspense fallback={<div className="metro-scene__fallback" aria-hidden="true" />}>
              <MetroScene activeProject={activeProject} reducedMotion={motionDisabled} />
            </Suspense>
          </div>
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow"><MapPin size={14} aria-hidden="true" />Now arriving / Personal portfolio</p>
            <h1>Your work,<br /><em>in motion.</em></h1>
            <p className="hero-lede">An interactive 3D journey through ideas, interfaces, and the projects that move them forward.</p>
            <div className="hero-actions">
              <Button className="metro-button metro-button--primary" onClick={() => scrollToSection('projects')}>
                Board the train <MoveRight size={16} aria-hidden="true" />
              </Button>
              <Button className="metro-button metro-button--ghost" variant="outline" onClick={() => scrollToSection('route')}>
                Explore the route
              </Button>
            </div>
          </div>
          <div className="arrival-board" aria-label="Current feature">
            <span className="arrival-board__dot" aria-hidden="true" />
            <span>Next stop</span>
            <strong>{selectedProject.name}</strong>
          </div>
          <button className="scroll-cue" onClick={() => scrollToSection('projects')} type="button">
            <span>Scroll to explore</span><ArrowDown size={16} aria-hidden="true" />
          </button>
        </section>

        <section className="ticker" aria-label="Portfolio disciplines">
          <div className="ticker__track">
            <span>Creative development</span><i className="ticker__marker" aria-hidden="true" /><span>Digital experiences</span><i className="ticker__marker" aria-hidden="true" /><span>3D interaction</span><i className="ticker__marker" aria-hidden="true" /><span>Design systems</span><i className="ticker__marker" aria-hidden="true" />
            <span aria-hidden="true">Creative development</span><i className="ticker__marker" aria-hidden="true" /><span aria-hidden="true">Digital experiences</span><i className="ticker__marker" aria-hidden="true" /><span aria-hidden="true">3D interaction</span><i className="ticker__marker" aria-hidden="true" /><span aria-hidden="true">Design systems</span><i className="ticker__marker" aria-hidden="true" />
          </div>
        </section>

        <section className="section projects-section" id="projects">
          <div className="section-intro reveal" data-reveal>
            <p className="eyebrow">Carriage 01—03 / Selected work</p>
            <div>
              <h2>Choose a window.<br />See what’s moving.</h2>
              <p>These are build-ready case-study placeholders. Replace them with your real work, outcomes, screenshots, and links as we develop your portfolio.</p>
            </div>
          </div>
          <div className="project-grid reveal" data-reveal>
            {projects.map((project, index) => (
              <Card className={`project-card project-card--${project.colour} ${activeProject === index ? 'is-active' : ''}`} key={project.name} size="sm">
                <button
                  aria-pressed={activeProject === index}
                  className="project-card__button"
                  onClick={() => setActiveProject(index)}
                  type="button"
                >
                  <CardHeader>
                    <div className="project-card__number">{project.number}</div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="project-card__visual" aria-hidden="true"><span /><span /><span /></div>
                    <span className="project-card__open">Preview journey <ArrowUpRight size={16} aria-hidden="true" /></span>
                  </CardContent>
                </button>
              </Card>
            ))}
          </div>
          <div className="project-spotlight reveal" data-reveal>
            <div>
              <span className="project-spotlight__count">0{activeProject + 1} / 03</span>
              <h3>{selectedProject.name}</h3>
              <p>{selectedProject.description}</p>
              <ul aria-label={`${selectedProject.name} skills`}>
                {selectedProject.stack.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
            <Button className="metro-button metro-button--primary" onClick={() => setOpenProject(activeProject)}>
              Open case study <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </section>

        <section className="section route-section" id="route">
          <div className="section-intro section-intro--compact reveal" data-reveal>
            <p className="eyebrow">Line M / Capabilities</p>
            <div><h2>The route behind<br />the work.</h2></div>
          </div>
          <ol className="route-map reveal" data-reveal>
            <li><span className="route-map__station">01</span><div><h3>Observe</h3><p>Research, audit, and identify the signal worth following.</p></div><span className="route-map__label">Discovery</span></li>
            <li><span className="route-map__station">02</span><div><h3>Shape</h3><p>Turn intent into systems, visual language, and interaction direction.</p></div><span className="route-map__label">Strategy + design</span></li>
            <li><span className="route-map__station">03</span><div><h3>Build</h3><p>Craft expressive, responsive experiences without losing clarity.</p></div><span className="route-map__label">Development</span></li>
            <li><span className="route-map__station">04</span><div><h3>Refine</h3><p>Measure the ride, remove friction, and keep improving the system.</p></div><span className="route-map__label">Iteration</span></li>
          </ol>
        </section>

        <section className="section about-section" id="about">
          <div className="about-copy reveal" data-reveal>
            <p className="eyebrow">The passenger / About you</p>
            <h2>Make the story<br />yours next.</h2>
            <p>This section is reserved for your short story: who you are, the kind of problems you love, and why people should travel with you. Keep it personal, specific, and concise.</p>
            <Button className="metro-button metro-button--ghost" variant="outline" onClick={() => scrollToSection('contact')}>Skip to contact <ArrowDown size={16} aria-hidden="true" /></Button>
          </div>
          <aside className="passenger-card reveal" data-reveal aria-label="Portfolio content checklist">
            <span className="passenger-card__sticker">Your details here</span>
            <div className="passenger-card__monogram" aria-hidden="true">YN</div>
            <div><p>Next, add</p><ul><li>Your name & role</li><li>Professional photo or avatar</li><li>Bio & location</li><li>LinkedIn, GitHub & résumé</li></ul></div>
          </aside>
        </section>

        <section className="contact-section reveal" data-reveal id="contact">
          <p className="eyebrow">Final platform / Contact</p>
          <h2>Let’s build the<br /><em>next thing.</em></h2>
          <a className="contact-link" href="mailto:hello@yourname.com">hello@yourname.com <ArrowUpRight size={24} aria-hidden="true" /></a>
          <p className="contact-note">Replace this placeholder address with your preferred contact email before publishing publicly.</p>
          <Button className="metro-button metro-button--ghost loop-button" variant="outline" onClick={() => scrollToSection('arrival')}>
            Ride the loop again <Repeat2 size={16} aria-hidden="true" />
          </Button>
        </section>
      </main>

      <footer className="site-footer"><span>© {currentYear} Your Name</span><span>Midnight Metro / Built to move</span></footer>

      <Dialog open={openProject !== null} onOpenChange={(open) => { if (!open) setOpenProject(null) }}>
        <DialogContent className="metro-dialog">
          {openProject !== null && <>
            <DialogHeader><p className="eyebrow">Project {projects[openProject].number} / Demo content</p><DialogTitle>{projects[openProject].name}</DialogTitle><DialogDescription>{projects[openProject].description}</DialogDescription></DialogHeader>
            <div className="metro-dialog__route"><span>Brief</span><MoveRight size={16} aria-hidden="true" /><span>Design direction</span><MoveRight size={16} aria-hidden="true" /><span>Build & refine</span></div>
            <p className="metro-dialog__note">This overlay is ready for your real case-study story, imagery, responsibilities, stack, and measurable result.</p>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
