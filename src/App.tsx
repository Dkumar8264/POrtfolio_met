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
    name: 'FoodWise',
    type: 'AI food intelligence',
    description: 'An AI-based demand prediction and waste-reduction platform that helps college canteens forecast meals, learn from student preferences, and coordinate surplus rescue.',
    stack: ['JavaScript', 'Machine learning', 'Multi-tenant SaaS'],
    colour: 'orange',
    github: 'https://github.com/Dkumar8264/FoodWise',
    live: 'https://foodwise-iota.vercel.app',
    status: 'Active build',
  },
  {
    number: '02',
    name: 'InduIntel',
    type: 'AI product enrichment',
    description: 'A five-stage industrial catalog enrichment pipeline using schema-enforced AI outputs, ground-truth validation, and calibrated confidence scoring.',
    stack: ['TypeScript', 'Gemini', 'Supabase'],
    colour: 'blue',
    github: 'https://github.com/Dkumar8264/induintel',
    live: null,
    status: 'Prototype',
  },
  {
    number: '03',
    name: 'TeamFlow',
    type: 'Team project management',
    description: 'A MERN collaboration workspace for projects, tasks, assignments, comments, status tracking, and secure token-based authentication.',
    stack: ['React', 'Express', 'MongoDB'],
    colour: 'violet',
    github: 'https://github.com/Dkumar8264/Teamflow',
    live: 'https://teamflow-dusky.vercel.app',
    status: 'Live project',
  },
  {
    number: '04',
    name: 'Recampus',
    type: 'Campus community platform',
    description: 'A secure MERN and PWA experience for college students to post lost-and-found items and peer-to-peer marketplace listings.',
    stack: ['React', 'Node.js', 'MongoDB'],
    colour: 'orange',
    github: 'https://github.com/Dkumar8264/Recampus',
    live: null,
    status: 'In development',
  },
  {
    number: '05',
    name: 'SpendX',
    type: 'Personal finance',
    description: 'A focused financial tracking and budgeting application designed to make expenses and budget decisions easier to understand.',
    stack: ['JavaScript', 'React', 'Vercel'],
    colour: 'blue',
    github: 'https://github.com/Dkumar8264/SpendX',
    live: 'https://spendx-xi.vercel.app',
    status: 'Live project',
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
          <span>Deepak / Metro</span>
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
            <p className="eyebrow"><MapPin size={14} aria-hidden="true" />Now arriving / Deepak Kumar</p>
            <h1>Ideas built<br /><em>in motion.</em></h1>
            <p className="hero-lede">AI &amp; ML student and full-stack developer building useful products with React, Python, and the MERN stack.</p>
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
            <p className="eyebrow">Carriage 01—05 / GitHub projects</p>
            <div>
              <h2>Choose a window.<br />See what’s moving.</h2>
              <p>Real projects from my GitHub—from AI forecasting and product intelligence to campus communities, teamwork, and personal finance.</p>
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
              <span className="project-spotlight__count">0{activeProject + 1} / 05 · {selectedProject.status}</span>
              <h3>{selectedProject.name}</h3>
              <p>{selectedProject.description}</p>
              <ul aria-label={`${selectedProject.name} skills`}>
                {selectedProject.stack.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
            <Button className="metro-button metro-button--primary" onClick={() => setOpenProject(activeProject)}>
              View project <ArrowUpRight size={16} aria-hidden="true" />
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
            <p className="eyebrow">The passenger / About me</p>
            <h2>Learning deeply.<br />Building publicly.</h2>
            <p>I’m Deepak Kumar, a third-year BE student specializing in AI &amp; ML at BMS Institute of Technology, Bengaluru. I build and deploy practical full-stack products, with a focus on MERN, Python, intelligent systems, and clear user experiences.</p>
            <Button className="metro-button metro-button--ghost" variant="outline" onClick={() => scrollToSection('contact')}>Skip to contact <ArrowDown size={16} aria-hidden="true" /></Button>
          </div>
          <aside className="passenger-card reveal" data-reveal aria-label="Deepak Kumar profile card">
            <span className="passenger-card__sticker">Bengaluru · India</span>
            <div className="passenger-card__monogram" aria-hidden="true">DK</div>
            <div><p>Current toolkit</p><ul><li>React, Next.js &amp; Tailwind CSS</li><li>Node.js, Express &amp; FastAPI</li><li>Python, AI/ML &amp; Gemini</li><li>MongoDB, PostgreSQL &amp; MySQL</li></ul></div>
          </aside>
        </section>

        <section className="contact-section reveal" data-reveal id="contact">
          <p className="eyebrow">Final platform / Contact</p>
          <h2>Let’s build the<br /><em>next thing.</em></h2>
          <a className="contact-link" href="mailto:krd04197@gmail.com">krd04197@gmail.com <ArrowUpRight size={24} aria-hidden="true" /></a>
          <div className="contact-socials" aria-label="Social profiles">
            <a href="https://github.com/Dkumar8264" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/deepak-kumar-65a192340" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <p className="contact-note">Open to thoughtful collaborations, internships, and ambitious product ideas.</p>
          <Button className="metro-button metro-button--ghost loop-button" variant="outline" onClick={() => scrollToSection('arrival')}>
            Ride the loop again <Repeat2 size={16} aria-hidden="true" />
          </Button>
        </section>
      </main>

      <footer className="site-footer"><span>© {currentYear} Deepak Kumar</span><span>GitHub @Dkumar8264 / Built to move</span></footer>

      <Dialog open={openProject !== null} onOpenChange={(open) => { if (!open) setOpenProject(null) }}>
        <DialogContent className="metro-dialog">
          {openProject !== null && <>
            <DialogHeader><p className="eyebrow">Project {projects[openProject].number} / {projects[openProject].status}</p><DialogTitle>{projects[openProject].name}</DialogTitle><DialogDescription>{projects[openProject].description}</DialogDescription></DialogHeader>
            <div className="metro-dialog__route">{projects[openProject].stack.map((item, index) => <span key={item}>{index > 0 && <MoveRight size={16} aria-hidden="true" />}{item}</span>)}</div>
            <div className="metro-dialog__actions">
              <a className="metro-button metro-button--primary" href={projects[openProject].github} target="_blank" rel="noreferrer">View source <ArrowUpRight size={16} aria-hidden="true" /></a>
              {projects[openProject].live && <a className="metro-button metro-button--ghost" href={projects[openProject].live} target="_blank" rel="noreferrer">Open live app <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
