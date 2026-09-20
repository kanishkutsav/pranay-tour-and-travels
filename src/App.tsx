import { type CSSProperties, type FormEvent, type RefObject, useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Menu,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import './App.css'

const destinations = [
  { name: 'Uttar Pradesh', detail: 'Heritage, culture & sacred cities', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=88' },
  { name: 'Bihar', detail: 'Ancient paths & quiet wisdom', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhi_temple_complex.jpg?width=1200' },
  { name: 'Jharkhand', detail: 'Waterfalls, forests & open skies', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=88' },
  { name: 'Delhi', detail: 'Stories, flavours & city energy', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=88' },
]

const packages = [
  { title: 'Ram Janmabhoomi & Ayodhya', location: 'Ayodhya · 3 days', destinations: ['Ayodhya'], tag: 'Spiritual trail', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ram%20Janmbhoomi%20Mandir%2C%20Ayodhya%20Dham.jpg?width=1200' },
  { title: 'The Taj Mahal story', location: 'Agra · 2 days', destinations: ['Agra'], tag: 'Heritage pick', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taj%20Mahal%20in%20March%202004.jpg?width=1200' },
  { title: 'Varanasi by the Ganga', location: 'Varanasi · 4 days', destinations: ['Varanasi'], tag: 'Soulful escape', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganga%20Dwar%2C%20Gateway%20of%20Corridor%20of%20Kashi%20Vishwanath%20Temple%2C%20Varanasi%202.webp?width=1200' },
  { title: 'Prayagraj confluence', location: 'Allahabad · 3 days', destinations: ['Allahabad'], tag: 'River retreat', image: '/prayagraj-confluence.png' },
  { title: 'Lucknow tehzeeb trail', location: 'Lucknow · 3 days', destinations: ['Lucknow'], tag: 'Culture pick', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bara%20Imambara%20Lucknow.jpg?width=1200' },
  { title: 'Bodh Gaya awakening', location: 'Bodh Gaya · 3 days', destinations: ['Bodh Gaya'], tag: 'Buddhist trail', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhi%20temple%20complex.jpg?width=1200' },
  { title: 'Vindhyachal blessings', location: 'Vindhyachal · 2 days', destinations: ['Vindhyachal'], tag: 'Temple trail', image: '/vindhyachal-temple.png' },
  { title: 'Deoghar temple trail', location: 'Deoghar · 3 days', destinations: ['Deoghar'], tag: 'Sacred journey', image: '/deoghar-temple.png' },
  { title: 'Nalanda knowledge trail', location: 'Nalanda · 2 days', destinations: ['Nalanda'], tag: 'Ancient India', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nalanda%20ruins.jpg?width=1200' },
  { title: 'Rajgir hills & peace', location: 'Rajgir · 3 days', destinations: ['Rajgir'], tag: 'Slow travel', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vishwa%20Shanti%20Stupa%2C%20Rajgir.jpg?width=1200' },
  { title: 'Delhi heritage & old-city trail', location: 'Delhi · 2 days', destinations: ['Delhi'], tag: 'City heritage', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=88' },
]

const regionMap: Record<string, string[]> = {
  'Uttar Pradesh': ['Ayodhya', 'Agra', 'Varanasi', 'Allahabad', 'Lucknow', 'Vindhyachal'],
  Bihar: ['Bodh Gaya', 'Nalanda', 'Rajgir'],
  Jharkhand: ['Deoghar'],
  Delhi: ['Delhi'],
}

const experienceDestinations = [...new Set(packages.flatMap((trip) => trip.destinations))]
const popularDestinations = ['Ayodhya', 'Varanasi', 'Bodh Gaya', 'Rajgir']
const businessPhone = '9935123959'
const whatsappLink = 'https://wa.me/919935123959?text=Hi%20Pranay%20Tour%20%26%20Travels%2C%20I%27d%20like%20to%20plan%20a%20trip.'
const heroImage = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90'

function App() {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [isDestinationMenuOpen, setIsDestinationMenuOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [finderPlacement, setFinderPlacement] = useState<'below' | 'above'>('below')
  const [calendarMonth, setCalendarMonth] = useState(() => { const current = new Date(); return new Date(current.getFullYear(), current.getMonth(), 1) })
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [savedTrips, setSavedTrips] = useState<string[]>([])
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [cursorLabel, setCursorLabel] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [callbackForm, setCallbackForm] = useState({ name: '', trip: '', plannedDate: '', phone: '', comments: '' })
  const destinationMenuRef = useRef<HTMLDivElement>(null)
  const dateMenuRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const today = new Date().toISOString().split('T')[0]
  const dateLabel = date
    ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
    : 'Add dates'
  const calendarMonthLabel = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(calendarMonth)
  const calendarStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const calendarOffset = calendarStart.getDay()
  const calendarDays = Array.from({ length: 42 }, (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - calendarOffset + 1))
  const minimumDate = new Date(`${today}T00:00:00`)
  const isPastDate = (value: Date) => value < minimumDate
  const formatDateValue = (value: Date) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const updateFinderPlacement = (ref: RefObject<HTMLDivElement | null>, menuHeight: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setFinderPlacement(spaceBelow < Math.min(menuHeight, window.innerHeight * .72) + 16 && spaceAbove > spaceBelow ? 'above' : 'below')
  }

  const openDestinationMenu = () => {
    updateFinderPlacement(destinationMenuRef, 330)
    setIsDatePickerOpen(false)
    setIsDestinationMenuOpen((open) => !open)
  }

  const openDatePicker = () => {
    updateFinderPlacement(dateMenuRef, 365)
    setIsDestinationMenuOpen(false)
    setIsDatePickerOpen((open) => !open)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 720)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsCallbackFormOpen(false)
        setIsDestinationMenuOpen(false)
        setIsDatePickerOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!destinationMenuRef.current?.contains(target)) setIsDestinationMenuOpen(false)
      if (!dateMenuRef.current?.contains(target)) setIsDatePickerOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  useEffect(() => {
    if (!isDestinationMenuOpen && !isDatePickerOpen) return
    const refreshPlacement = () => updateFinderPlacement(isDestinationMenuOpen ? destinationMenuRef : dateMenuRef, isDestinationMenuOpen ? 330 : 365)
    refreshPlacement()
    window.addEventListener('resize', refreshPlacement)
    window.addEventListener('scroll', refreshPlacement, true)
    return () => {
      window.removeEventListener('resize', refreshPlacement)
      window.removeEventListener('scroll', refreshPlacement, true)
    }
  }, [isDestinationMenuOpen, isDatePickerOpen])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ticking = false

    const updateScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 36)
      if (!reducedMotion && heroRef.current) {
        heroRef.current.style.setProperty('--hero-shift', `${Math.min(scrollY * 0.12, 70)}px`)
      }
      document.documentElement.style.setProperty('--scroll-progress', `${Math.min(scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)}`)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    updateScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['top', 'destinations', 'experiences', 'why-us']
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('.reveal'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -7% 0px' },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [selectedDestination])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  const openCallbackForm = (trip = '', plannedDate = '') => {
    setIsFormSubmitted(false)
    setFormError('')
    setIsMobileMenuOpen(false)
    setCallbackForm((current) => ({
      ...current,
      trip,
      plannedDate,
    }))
    setIsCallbackFormOpen(true)
  }

  const closeCallbackForm = () => setIsCallbackFormOpen(false)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const selectDestination = (destinationName: string) => {
    setSelectedDestination(destinationName)
    window.requestAnimationFrame(() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const toggleSavedTrip = (title: string) => {
    setSavedTrips((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title])
  }

  const handleCallbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = callbackForm.name.trim()
    const trip = callbackForm.trip.trim()
    const phone = callbackForm.phone.trim()

    if (name.length < 2) {
      setFormError('Please enter your name. It should contain at least 2 characters.')
      return
    }

    if (!trip) {
      setFormError('Please enter the trip or destination you are interested in.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch('/.netlify/functions/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...callbackForm, name, trip, phone }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'We could not send your request. Please check your details and try again.')
      setCallbackForm({ name: '', trip: '', plannedDate: '', phone: '', comments: '' })
      setIsFormSubmitted(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'We could not send your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const visiblePackages = packages.filter((trip) => {
    if (!selectedDestination) return true
    return regionMap[selectedDestination]?.some((place) => trip.destinations.includes(place)) ?? false
  })

  return (
    <main className={isLoading ? 'is-loading' : ''}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-system" aria-hidden="true"><span className="cursor-ring" /><span className="cursor-dot" /><span className="cursor-label">{cursorLabel}</span></div>

      {isLoading && (
        <div className="loading-screen" aria-hidden="true">
          <div className="loading-inner">
            <span className="loading-mark"><img src="/pranay-logo.png" alt="" /></span>
            <span className="loading-name">Pranay Tour &amp; Travels</span>
            <span className="loading-line"><i /></span>
          </div>
        </div>
      )}

      <section
        className={`hero-section ${isDestinationMenuOpen || isDatePickerOpen ? 'has-finder-open' : ''}`}
        id="top"
        ref={heroRef}
        style={{ '--hero-image': `url("${heroImage}")` } as CSSProperties}
      >
        <div className="hero-atmosphere" aria-hidden="true" />
        <nav className={`navbar ${isScrolled ? 'is-scrolled' : ''}`} aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Pranay Tour and Travels home">
            <span className="brand-mark"><img src="/pranay-logo.png" alt="" /></span>
            <span>Pranay <em>Tour &amp; Travels</em></span>
          </a>

          <div className="nav-links">
            <a className={activeSection === 'destinations' ? 'active' : ''} href="#destinations">Destinations</a>
            <a className={activeSection === 'experiences' ? 'active' : ''} href="#experiences">Experiences</a>
            <a className={activeSection === 'why-us' ? 'active' : ''} href="#why-us">Why us</a>
          </div>

          <div className="nav-actions">
            <a className="nav-enquire" href="#contact" onClick={(event) => { event.preventDefault(); openCallbackForm() }}>Plan a journey <ArrowRight size={15} /></a>
            <button className="menu-button" type="button" aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((open) => !open)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeMobileMenu() }}>
              <aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                <div className="mobile-menu-header">
                  <div><span className="menu-overline">Explore</span><strong>Pranay</strong></div>
                  <button type="button" onClick={closeMobileMenu} aria-label="Close menu"><X size={20} /></button>
                </div>
                <nav className="mobile-menu-links" aria-label="Mobile navigation links">
                  <a href="#destinations" onClick={closeMobileMenu}><span>01</span>Destinations<ArrowRight size={17} /></a>
                  <a href="#experiences" onClick={closeMobileMenu}><span>02</span>Experiences<ArrowRight size={17} /></a>
                  <a href="#why-us" onClick={closeMobileMenu}><span>03</span>Why us<ArrowRight size={17} /></a>
                </nav>
                <div className="mobile-menu-footer">
                  <span>Start a conversation</span>
                  <a href="tel:9935123959">9935123959</a>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a>
                </div>
              </aside>
            </div>
          )}
        </nav>

        <div className="hero-content">
          <div className="hero-index"><span>01</span><i /><span>Pranay / India</span></div>
          <div className="hero-copy-block">
            <div className="eyebrow reveal">Travel slowly. Feel deeply.</div>
            <h1 className="hero-title"><span className="hero-title-line">Go where your</span><span className="hero-title-line hero-title-accent">heart feels at home.</span></h1>
            <p className="hero-copy">Thoughtful journeys across India, made for curious people and the stories they bring back.</p>
            <div className="hero-finder" aria-label="Find a journey">
              <div className="hero-finder-field hero-destination-field" ref={destinationMenuRef}>
                <span className="hero-finder-icon">01</span>
                <label>Where to?</label>
                <button className="hero-finder-control" type="button" aria-haspopup="listbox" aria-expanded={isDestinationMenuOpen} onClick={openDestinationMenu}>
                  <span className={destination ? '' : 'is-placeholder'}>{destination || 'Choose a destination'}</span>
                </button>
                <ChevronDown className={isDestinationMenuOpen ? 'is-open' : ''} size={14} />
                {isDestinationMenuOpen && (
                  <div className={`finder-dropdown ${finderPlacement === 'above' ? 'finder-menu-above' : ''}`} role="listbox" aria-label="Choose a destination">
                    <button className={!destination ? 'is-selected' : ''} type="button" role="option" aria-selected={!destination} onClick={() => { setDestination(''); setIsDestinationMenuOpen(false) }}>Choose a destination</button>
                    {experienceDestinations.map((destinationName) => (
                      <button className={destination === destinationName ? 'is-selected' : ''} type="button" role="option" aria-selected={destination === destinationName} key={destinationName} onClick={() => { setDestination(destinationName); setIsDestinationMenuOpen(false) }}>{destinationName}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="hero-finder-field hero-date-field" ref={dateMenuRef} onClick={openDatePicker}>
                <span className="hero-finder-icon">02</span>
                <label>When?</label>
                <button id="dates" className="hero-finder-control" type="button" aria-haspopup="dialog" aria-expanded={isDatePickerOpen} onClick={(event) => { event.stopPropagation(); openDatePicker() }}>
                  <span className={date ? '' : 'is-placeholder'}>{dateLabel}</span>
                </button>
                <CalendarDays size={14} />
                {isDatePickerOpen && (
                  <div className={`finder-calendar ${finderPlacement === 'above' ? 'finder-menu-above' : ''}`} role="dialog" aria-label="Choose a travel date" onClick={(event) => event.stopPropagation()}>
                    <div className="finder-calendar-head">
                      <button type="button" aria-label="Previous month" disabled={calendarMonth <= new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)} onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={15} /></button>
                      <strong>{calendarMonthLabel}</strong>
                      <button type="button" aria-label="Next month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={15} /></button>
                    </div>
                    <div className="finder-calendar-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName) => <span key={dayName}>{dayName}</span>)}</div>
                    <div className="finder-calendar-grid">
                      {calendarDays.map((calendarDay) => {
                        const value = formatDateValue(calendarDay)
                        const outsideMonth = calendarDay.getMonth() !== calendarMonth.getMonth()
                        const disabled = outsideMonth || isPastDate(calendarDay)
                        const selected = value === date
                        return <button key={value} type="button" disabled={disabled} className={`${outsideMonth ? 'is-outside ' : ''}${selected ? 'is-selected' : ''}`} onClick={() => { setDate(value); setIsDatePickerOpen(false) }}>{calendarDay.getDate()}</button>
                      })}
                    </div>
                    <div className="finder-calendar-foot"><button type="button" onClick={() => { setDate(''); setIsDatePickerOpen(false) }}>Clear</button><button type="button" onClick={() => { setDate(today); setIsDatePickerOpen(false); setCalendarMonth(new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)) }}>Today</button></div>
                  </div>
                )}
              </div>
              <button className="hero-finder-submit" type="button" onClick={() => openCallbackForm(destination, date)}>
                <span>Plan your journey</span><ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-location"><span className="hero-location-dot" /> Uttar Pradesh · Bihar · Jharkhand · Delhi</div>
            <a href="#journey" className="scroll-cue"><span>Scroll to explore</span><ArrowDownRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="journey-strip" id="journey" aria-label="Plan your journey">
        <div className="journey-strip-intro reveal">
          <span className="section-kicker">A slower way to travel</span>
          <h2>Come for the place.<br /><i>Stay for the feeling.</i></h2>
        </div>
        <div className="journey-strip-actions reveal reveal-delay-1">
          <p>Choose a destination, tell us what you have in mind, and let our team shape the details around you.</p>
          <div className="journey-actions">
            <button className="line-action line-action-dark" type="button" onClick={() => openCallbackForm()}>
              <span><strong>Get a callback</strong><small>Tell us what you have in mind</small></span><ArrowRight size={17} />
            </button>
            <a className="line-action" href={whatsappLink} target="_blank" rel="noreferrer">
              <span><strong>WhatsApp</strong><small>Message us directly</small></span><MessageCircle size={17} />
            </a>
            <a className="line-action" href={'tel:' + businessPhone}>
              <span><strong>Call now</strong><small>Speak with our team</small></span><PhoneCall size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-number reveal">02 / The feeling</div>
        <div className="manifesto-grid">
          <div className="manifesto-statement reveal">
            <span className="section-kicker">Made for meaningful moments</span>
            <h2>India is not a destination.<br /><i>It is a thousand feelings.</i></h2>
          </div>
          <div className="manifesto-copy reveal reveal-delay-1">
            <p>We plan the kind of trips that leave you with more than photographs. Local hosts, unhurried days, and the little detours that turn into your favourite memories.</p>
            <a className="editorial-link" href="#experiences">Our way of travelling <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="stat-row reveal reveal-delay-2">
          <div><strong>12+</strong><span>years of journeys</span></div>
          <div><strong>4.9</strong><span><Star size={13} fill="currentColor" /> guest rating</span></div>
          <div><strong>28</strong><span>corners of India</span></div>
        </div>
      </section>

      <section className="destination-section" id="destinations">
        <div className="section-shell">
          <div className="section-heading reveal">
            <div><span className="section-kicker">03 / Pick a feeling</span><h2>Places that stay with you.</h2></div>
            <span className="section-aside">Curated across the heart of India <ArrowDownRight size={16} /></span>
          </div>

          <div className="destination-grid">
            {destinations.map((item, index) => (
              <button
                className={`destination-card destination-card-${index + 1} reveal reveal-delay-${Math.min(index, 3)}`}
                key={item.name}
                type="button"
                onClick={() => selectDestination(item.name)}
                onMouseEnter={() => setCursorLabel('Explore')}
                onMouseLeave={() => setCursorLabel('')}
                aria-label={`Explore experiences in ${item.name}`}
              >
                <img src={item.image} alt={item.name} loading={index === 0 ? 'eager' : 'lazy'} />
                <span className="destination-wash" />
                <span className="destination-topline"><span>Region {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={15} /></span>
                <span className="destination-copy"><small>{item.detail}</small><strong>{item.name}</strong><span className="destination-cta">Explore region <ArrowRight size={14} /></span></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-section" id="experiences">
        <div className="section-shell">
          <div className="section-heading experience-heading reveal">
            <div>
              <span className="section-kicker">{selectedDestination ? `Experiences in ${selectedDestination}` : '04 / Made for your mood'}</span>
              <h2>{selectedDestination ? 'Trips around this region.' : 'Trips worth talking about.'}</h2>
            </div>
            <div className="experience-heading-right">
              <span>{String(visiblePackages.length).padStart(2, '0')} journeys</span>
              {selectedDestination && <button className="text-reset" type="button" onClick={() => setSelectedDestination(null)}>Show all <X size={14} /></button>}
            </div>
          </div>

          <div className="package-grid">
            {visiblePackages.map((trip, index) => {
              const isSaved = savedTrips.includes(trip.title)
              return (
                <article
                  className={`package-card package-card-${(index % 6) + 1} reveal reveal-delay-${index % 3}`}
                  key={trip.title}
                  onMouseEnter={() => setCursorLabel('View')}
                  onMouseLeave={() => setCursorLabel('')}
                >
                  <div className="package-image">
                    <button
                      className="package-hit"
                      type="button"
                      onClick={() => openCallbackForm(trip.destinations.join(' and '))}
                      aria-label={`Plan ${trip.title}`}
                    >
                      <img src={trip.image} alt={trip.title} loading="lazy" />
                      <span className="package-overlay" />
                      <span className="package-content">
                        <span className="package-tag">{trip.tag}</span>
                        <span className="package-copy">
                          <small>{trip.location}</small>
                          <strong>{trip.title}</strong>
                          <span className="package-cta">Plan this journey <ArrowRight size={14} /></span>
                        </span>
                      </span>
                    </button>
                    <button
                      className={`package-save ${isSaved ? 'is-saved' : ''}`}
                      type="button"
                      aria-label={isSaved ? `Remove ${trip.title} from saved journeys` : `Save ${trip.title}`}
                      aria-pressed={isSaved}
                      onClick={() => toggleSavedTrip(trip.title)}
                    >
                      <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="section-shell">
          <div className="process-head reveal">
            <span className="section-kicker">05 / The journey</span>
            <h2>From first hello<br /><i>to last sunset.</i></h2>
          </div>
          <div className="process-list">
            <div className="process-item reveal"><span>01</span><div><strong>Tell us what you are imagining.</strong><p>A destination, a feeling, a rough idea — start anywhere.</p></div><Compass size={20} /></div>
            <div className="process-item reveal reveal-delay-1"><span>02</span><div><strong>We shape the details around you.</strong><p>Our team turns the idea into a thoughtful journey.</p></div><Sparkles size={20} /></div>
            <div className="process-item reveal reveal-delay-2"><span>03</span><div><strong>You travel. We stay close.</strong><p>From the first hello to the last sunset, we are a call away.</p></div><ShieldCheck size={20} /></div>
          </div>
        </div>
      </section>

      <section className="trust-section" id="why-us">
        <div className="trust-image reveal" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88" alt="" loading="lazy" />
          <span className="trust-image-caption">A little more soul / India</span>
        </div>
        <div className="trust-copy">
          <span className="section-kicker reveal">06 / Travel with ease</span>
          <h2 className="reveal">The details are ours.<br /><i>The memories are yours.</i></h2>
          <p className="reveal reveal-delay-1">From your first hello to the last sunset, our on-ground experts are here to make every part of your trip feel effortless.</p>
          <button className="dark-button reveal reveal-delay-2" type="button" onClick={() => openCallbackForm()}>Plan my journey <ArrowRight size={17} /></button>
          <div className="contact-stat reveal reveal-delay-2">
            <strong>Contact us</strong>
            <span><a href="tel:9935123959">9935123959</a><a href="mailto:ukindiavns@gmail.com">ukindiavns@gmail.com</a></span>
          </div>
          <div className="trust-list">
            <div className="reveal"><ShieldCheck size={21} /><span><strong>Real people, always</strong>Someone from our team is never more than a call away.</span></div>
            <div className="reveal reveal-delay-1"><Compass size={21} /><span><strong>Made locally</strong>Stay with people who know their home by heart.</span></div>
            <div className="reveal reveal-delay-2"><Star size={21} /><span><strong>4.9 from 8,000+ travellers</strong>Good trips are better when they come recommended.</span></div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-shell">
          <div className="footer-top reveal">
            <div className="footer-brand">
              <a className="brand" href="#top">
                <span className="brand-mark"><img src="/pranay-logo.png" alt="" /></span>
                <span>Pranay <em>Tour &amp; Travels</em></span>
              </a>
              <p>Journeys with a little more soul.</p>
            </div>
            <div className="footer-statement">Go somewhere<br /><i>that stays with you.</i></div>
            <a className="footer-cta" href={whatsappLink} target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight size={17} /></a>
          </div>
          <div className="footer-links reveal reveal-delay-1">
            <div><span>Explore</span><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#why-us">Why us</a></div>
            <div><span>Contact</span><a href="tel:9935123959">9935123959</a><a href="mailto:ukindiavns@gmail.com">ukindiavns@gmail.com</a><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={12} /></a></div>
            <div><span>Popular right now</span>{popularDestinations.map((item) => <span className="footer-destination" key={item}>{item}</span>)}</div>
          </div>
          <div className="footer-bottom"><span>© 2026 Pranay Tour and Travels</span><span>Thoughtful journeys across India.</span><a href="#top">Back to top <ArrowUpRight size={12} /></a></div>
        </div>
      </footer>

      <a className="mobile-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with Pranay Tour and Travels on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.1 3.1a12.9 12.9 0 0 0-11.1 19.5L3.2 28.9l6.5-1.7A12.9 12.9 0 1 0 16.1 3.1Zm0 23.4c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.8 1 1-3.7-.3-.4a10.7 10.7 0 1 1 9.1 4.8Zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.3-.7.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.9-1.5.1-.2.1-.4 0-.6s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 .9 4.1.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.2-.2-.4-.3-.7-.4Z"/></svg>
      </a>

      {isCallbackFormOpen && (
        <div className="callback-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCallbackForm() }}>
          <section className="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-title">
            <button className="callback-close" type="button" aria-label="Close callback form" onClick={closeCallbackForm}><X size={20} /></button>
            {isFormSubmitted ? (
              <div className="callback-success">
                <span className="success-mark"><Sparkles size={19} /></span>
                <span className="section-kicker">Request sent</span>
                <h2 id="callback-title">We’ll be in touch soon.</h2>
                <p>Your trip details were sent to our team.</p>
                <button className="dark-button" type="button" onClick={closeCallbackForm}>Done <ArrowRight size={16} /></button>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} noValidate>
                <span className="section-kicker">Let’s plan it</span>
                <h2 id="callback-title">Tell us about your trip.</h2>
                <p className="callback-required-note"><span aria-hidden="true">*</span> Required fields</p>
                <label htmlFor="callback-name"><span className="callback-label-text">Name</span> <span className="callback-required-mark" aria-hidden="true">*</span><input id="callback-name" type="text" value={callbackForm.name} minLength={2} autoComplete="name" onChange={(event) => setCallbackForm({ ...callbackForm, name: event.target.value })} required /></label>
                <label htmlFor="callback-trip"><span className="callback-label-text">Trip interested in</span> <span className="callback-required-mark" aria-hidden="true">*</span><input id="callback-trip" type="text" value={callbackForm.trip} onChange={(event) => setCallbackForm({ ...callbackForm, trip: event.target.value })} placeholder="e.g. Ayodhya and Varanasi" required /></label>
                <label htmlFor="callback-date"><span className="callback-label-text">Planned date</span><input id="callback-date" type="date" min={today} value={callbackForm.plannedDate} onChange={(event) => setCallbackForm({ ...callbackForm, plannedDate: event.target.value })} /></label>
                <label htmlFor="callback-phone"><span className="callback-label-text">Phone number</span> <span className="callback-required-mark" aria-hidden="true">*</span><input id="callback-phone" type="tel" value={callbackForm.phone} inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} onChange={(event) => setCallbackForm({ ...callbackForm, phone: event.target.value.replace(/\D/g, '').slice(0, 10) })} required /></label>
                <label htmlFor="callback-comments"><span className="callback-label-text">Comments</span><textarea id="callback-comments" value={callbackForm.comments} onChange={(event) => setCallbackForm({ ...callbackForm, comments: event.target.value })} placeholder="Anything you'd like us to know?" rows={4} /></label>
                {formError && <p className="callback-error" role="alert" aria-live="polite">{formError}</p>}
                <button className="dark-button callback-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send request'} {!isSubmitting && <ArrowRight size={17} />}</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
