import { type FormEvent, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Menu,
  PhoneCall,
  ShieldCheck,
  Star,
} from 'lucide-react'
import './App.css'

const destinations = [
  { name: 'Uttar Pradesh', detail: 'Heritage, culture & sacred cities', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85' },
  { name: 'Bihar', detail: 'Ancient paths & quiet wisdom', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhi_temple_complex.jpg?width=900' },
  { name: 'Jharkhand', detail: 'Waterfalls, forests & open skies', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=85' },
  { name: 'Delhi', detail: 'Stories, flavours & city energy', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85' },
]

const packages = [
  { title: 'Ram Janmabhoomi & Ayodhya', location: 'Ayodhya · 3 days', destinations: ['Ayodhya'], tag: 'Spiritual trail', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ram%20Janmbhoomi%20Mandir%2C%20Ayodhya%20Dham.jpg?width=1000' },
  { title: 'The Taj Mahal story', location: 'Agra · 2 days', destinations: ['Agra'], tag: 'Heritage pick', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Taj%20Mahal%20in%20March%202004.jpg?width=1000' },
  { title: 'Varanasi by the Ganga', location: 'Varanasi · 4 days', destinations: ['Varanasi'], tag: 'Soulful escape', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganga%20Dwar%2C%20Gateway%20of%20Corridor%20of%20Kashi%20Vishwanath%20Temple%2C%20Varanasi%202.webp?width=1000' },
  { title: 'Prayagraj confluence', location: 'Allahabad · 3 days', destinations: ['Allahabad'], tag: 'River retreat', image: '/prayagraj-confluence.png' },
  { title: 'Lucknow tehzeeb trail', location: 'Lucknow · 3 days', destinations: ['Lucknow'], tag: 'Culture pick', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bara%20Imambara%20Lucknow.jpg?width=1000' },
  { title: 'Bodh Gaya awakening', location: 'Bodh Gaya · 3 days', destinations: ['Bodh Gaya'], tag: 'Buddhist trail', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabodhi%20temple%20complex.jpg?width=1000' },
  { title: 'Vindhyachal blessings', location: 'Vindhyachal · 2 days', destinations: ['Vindhyachal'], tag: 'Temple trail', image: '/vindhyachal-temple.png' },
  { title: 'Deoghar temple trail', location: 'Deoghar · 3 days', destinations: ['Deoghar'], tag: 'Sacred journey', image: '/deoghar-temple.png' },
  { title: 'Nalanda knowledge trail', location: 'Nalanda · 2 days', destinations: ['Nalanda'], tag: 'Ancient India', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nalanda%20ruins.jpg?width=1000' },
  { title: 'Rajgir hills & peace', location: 'Rajgir · 3 days', destinations: ['Rajgir'], tag: 'Slow travel', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vishwa%20Shanti%20Stupa%2C%20Rajgir.jpg?width=1000' },
]

const experienceDestinations = [...new Set(packages.flatMap((trip) => trip.destinations))]

function App() {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [callbackForm, setCallbackForm] = useState({ name: '', trip: '', plannedDate: '', phone: '', comments: '' })
  const datePickerRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().split('T')[0]
  const dateLabel = date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`)) : 'Add dates'
  const searchLabel = destination.trim() ? `Explore ${destination}` : 'Find your next story'
  const openCallbackForm = () => {
    setIsFormSubmitted(false)
    setFormError('')
    setIsCallbackFormOpen(true)
  }
  const closeCallbackForm = () => setIsCallbackFormOpen(false)
  const handleCallbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')
    try {
      const response = await fetch('/.netlify/functions/callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(callbackForm) })
      if (!response.ok) throw new Error('Request failed')
      setIsFormSubmitted(true)
    } catch {
      setFormError('We could not send your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <section className="hero-section">
        <nav className="navbar" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Pranay Tour and Travels home"><span className="brand-mark"><img src="/pranay-logo.png" alt="" /></span><span>Pranay <em>Tour &amp; Travels</em></span></a>
          <div className="nav-links"><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#about">Why us</a></div>
          <div className="nav-actions"><button className="menu-button" type="button" aria-label="Open menu"><Menu size={21} /></button></div>
        </nav>
        <div className="hero-content" id="top">
          <p className="eyebrow">Travel slowly. Feel deeply.</p>
          <h1>Go where your<br /><span>heart feels at home.</span></h1>
          <p className="hero-copy">Thoughtful journeys across India, made for curious people and the stories they bring back.</p>
          <div className="search-panel">
            <div className="search-field"><MapPin size={20} /><label htmlFor="destination">Where do you want to go?</label><select id="destination" value={destination} onChange={(event) => setDestination(event.target.value)}><option value="">Select a destination</option>{experienceDestinations.map((destinationName) => <option value={destinationName} key={destinationName}>{destinationName}</option>)}</select></div>
            <div className="search-field date-field"><CalendarDays size={20} /><label htmlFor="dates">When</label><button id="dates" type="button" onClick={() => datePickerRef.current?.showPicker()}>{dateLabel} <ChevronDown size={15} /></button><input ref={datePickerRef} className="date-picker-input" type="date" value={date} min={today} onChange={(event) => setDate(event.target.value)} aria-label="Select travel date" tabIndex={-1} /></div>
            <button className="search-button" type="button" aria-label="Get a callback" onClick={openCallbackForm}><PhoneCall size={20} /><span>Get a callback</span></button>
          </div>
          <p className="search-result" aria-live="polite">{searchLabel}</p>
        </div>
        <div className="hero-bottom-note"><span>01</span><span className="note-line"></span><span>Every journey starts with a yes.</span></div>
      </section>

      <section className="intro-section" id="about">
        <div className="section-kicker">Made for meaningful moments</div>
        <div className="intro-grid"><h2>India is not a destination.<br /><i>It is a thousand feelings.</i></h2><div className="intro-copy"><p>We plan the kind of trips that leave you with more than photographs. Local hosts, unhurried days, and the little detours that turn into your favourite memories.</p><a className="arrow-link" href="#experiences" onClick={(event) => { event.preventDefault(); openCallbackForm() }}>Our way of travelling <ArrowRight size={17} /></a></div></div>
        <div className="stat-row"><div><strong>12+</strong><span>years of journeys</span></div><div><strong>4.9</strong><span><Star size={14} fill="currentColor" /> guest rating</span></div><div><strong>28</strong><span>corners of India</span></div></div>
      </section>

      <section className="destination-section" id="destinations">
        <div className="section-heading"><div><div className="section-kicker">Pick a feeling</div><h2>Places that stay with you</h2></div><a className="arrow-link" href="#destinations" onClick={(event) => { event.preventDefault(); openCallbackForm() }}>See all destinations <ArrowRight size={17} /></a></div>
        <div className="destination-grid">{destinations.map((destinationItem, index) => <a className={`destination-card destination-card-${index + 1}`} href="#experiences" key={destinationItem.name}><img src={destinationItem.image} alt={destinationItem.name} /><div className="card-shade"></div><div className="destination-info"><span>{destinationItem.detail}</span><h3>{destinationItem.name}</h3></div></a>)}</div>
      </section>

      <section className="experience-section" id="experiences">
        <div className="section-heading experience-heading"><div><div className="section-kicker">Made for your mood</div><h2>Trips worth talking about</h2></div></div>
        <div className="package-grid">{packages.map((trip) => <article className="package-card" key={trip.title} onClick={openCallbackForm} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCallbackForm() } }}><div className="package-image"><img src={trip.image} alt={trip.title} /><span>{trip.tag}</span><button type="button" aria-label={`Save ${trip.title}`} onClick={(event) => event.stopPropagation()}><Heart size={17} /></button></div><div className="package-body"><div className="package-location"><MapPin size={14} /> {trip.location}</div><h3>{trip.title}</h3></div></article>)}</div>
      </section>

      <section className="trust-section"><div className="trust-copy"><div className="section-kicker">Travel with ease</div><h2>The details are ours.<br /><i>The memories are yours.</i></h2><p>From your first hello to the last sunset, our on-ground experts are here to make every part of your trip feel effortless.</p><button className="dark-button" type="button" onClick={openCallbackForm}>Plan my journey <ArrowRight size={17} /></button><div className="contact-stat"><strong>Contact us</strong><span><a href="tel:9935123959">9935123959</a><br /><a href="mailto:ukindiavns@gmail.com">ukindiavns@gmail.com</a></span></div></div><div className="trust-list"><div><ShieldCheck size={24} /><span><strong>Real people, always</strong>Someone from our team is never more than a call away.</span></div><div><Compass size={24} /><span><strong>Made locally</strong>Stay with people who know their home by heart.</span></div><div><Star size={24} /><span><strong>4.9 from 8,000+ travellers</strong>Good trips are better when they come recommended.</span></div></div></section>
      <footer><a className="brand" href="#top"><span className="brand-mark"><img src="/pranay-logo.png" alt="" /></span><span>Pranay <em>Tour &amp; Travels</em></span></a><span>Journeys with a little more soul.</span><span>© 2026 Pranay Tour and Travels</span></footer>
      {isCallbackFormOpen && <div className="callback-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCallbackForm() }}><section className="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-title"><button className="callback-close" type="button" aria-label="Close callback form" onClick={closeCallbackForm}>×</button>{isFormSubmitted ? <div className="callback-success"><div className="section-kicker">Request sent</div><h2 id="callback-title">We’ll be in touch soon.</h2><p>Your trip details were sent to our team.</p><button className="dark-button" type="button" onClick={closeCallbackForm}>Done</button></div> : <form onSubmit={handleCallbackSubmit}><div className="section-kicker">Let’s plan it</div><h2 id="callback-title">Tell us about your trip.</h2><label htmlFor="callback-name">Name<input id="callback-name" type="text" value={callbackForm.name} onChange={(event) => setCallbackForm({ ...callbackForm, name: event.target.value })} required /></label><label htmlFor="callback-trip">Trip interested in<input id="callback-trip" type="text" value={callbackForm.trip} onChange={(event) => setCallbackForm({ ...callbackForm, trip: event.target.value })} placeholder="e.g. Ayodhya and Varanasi" required /></label><label htmlFor="callback-date">Planned date<input id="callback-date" type="date" min={today} value={callbackForm.plannedDate} onChange={(event) => setCallbackForm({ ...callbackForm, plannedDate: event.target.value })} required /></label><label htmlFor="callback-phone">Phone number<input id="callback-phone" type="tel" value={callbackForm.phone} onChange={(event) => setCallbackForm({ ...callbackForm, phone: event.target.value })} required /></label><label htmlFor="callback-comments">Comments<textarea id="callback-comments" value={callbackForm.comments} onChange={(event) => setCallbackForm({ ...callbackForm, comments: event.target.value })} placeholder="Anything you'd like us to know?" rows={4} /></label>{formError && <p className="callback-error" role="alert">{formError}</p>}<button className="dark-button callback-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit'} {!isSubmitting && <ArrowRight size={17} />}</button></form>}</section></div>}
    </main>
  )
}

export default App
