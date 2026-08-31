import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClayCard, StatusBadge } from "../components/clay"
import { api } from "../lib/api"
import {
  ScissorsIcon,
  SparkleIcon,
  MusicNote01Icon,
  Edit03Icon,
  PlayIcon,
  PauseIcon,
  Shield01Icon,
  VideoAiIcon,
  CheckmarkSquare03Icon
} from "../lib/icons"

type MediaTab = "clips" | "thumbnails" | "music"

export default function MediaStudio() {
  const [activeTab, setActiveTab] = useState<MediaTab>("clips")

  // --- 1. Mini-Clips Extractor State ---
  const [videoTitle, setVideoTitle] = useState("10 AI Tools That Changed How I Build Software in 2026")
  const [transcript, setTranscript] = useState(
    "In this deep dive, we look at how AI agents are transforming coding. At 02:15, I reveal the golden rule of building autonomous agents that nobody is talking about: you must decouple planning from tool execution. Then at 05:30, we inspect live telemetry in Firestore and see how latency dropped from 2 seconds to 350ms. At 08:45, I walk through how to counter predatory sponsorship contracts and gain 4000 dollars in value."
  )
  const [maxClips, setMaxClips] = useState<number>(3)
  const [extractingClips, setExtractingClips] = useState(false)
  const [clipsData, setClipsData] = useState<any | null>(null)

  // --- 2. Imagen 3 Thumbnail State ---
  const [thumbTopic, setThumbTopic] = useState("How Autonomous AI Agents 10x Creator Revenue")
  const [generatingThumbnails, setGeneratingThumbnails] = useState(false)
  const [thumbnailConcepts, setThumbnailConcepts] = useState<any[]>([])

  // --- 3. Lyria AI Music State ---
  const [mood, setMood] = useState("lofi_chill")
  const [genre, setGenre] = useState("Lo-Fi Hip Hop / Chillhop")
  const [tempoBpm, setTempoBpm] = useState(85)
  const [durationSeconds, setDurationSeconds] = useState(60)
  const [generatingMusic, setGeneratingMusic] = useState(false)
  const [musicTrack, setMusicTrack] = useState<any | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const synthIntervalRef = useRef<any>(null)

  const stopAudio = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current)
      synthIntervalRef.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.suspend()
      } catch {}
    }
    setIsPlaying(false)
  }

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      setIsPlaying(true)

      // Warm chill synth chords progression: Cmaj7 -> Am7 -> Fmaj7 -> G7
      const chordProgressions = [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 261.63, 329.63, 392.00],
        [174.61, 220.00, 261.63, 329.63],
        [196.00, 246.94, 293.66, 349.23],
      ]
      let chordIndex = 0

      const playChord = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return
        const currentChord = chordProgressions[chordIndex % chordProgressions.length]
        chordIndex++

        const now = ctx.currentTime
        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(0.06, now)
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4)

        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.setValueAtTime(800, now)

        masterGain.connect(filter)
        filter.connect(ctx.destination)

        currentChord.forEach((freq) => {
          const osc = ctx.createOscillator()
          osc.type = "sine"
          osc.frequency.setValueAtTime(freq, now)
          osc.connect(masterGain)
          osc.start(now)
          osc.stop(now + 2.4)
        })
      }

      playChord()
      synthIntervalRef.current = setInterval(playChord, (60 / (tempoBpm || 85)) * 4 * 1000 / 2)
    } catch (e) {
      console.error("Web Audio API synth error:", e)
      setIsPlaying(false)
    }
  }

  const togglePlayMusic = () => {
    if (isPlaying) {
      stopAudio()
    } else {
      startAudio()
    }
  }

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  // Handlers
  const handleExtractClips = async () => {
    if (!videoTitle.trim() || !transcript.trim()) return
    setExtractingClips(true)
    try {
      const data = await api.extractClips(videoTitle, transcript, maxClips)
      setClipsData(data)
    } catch (err) {
      console.error("Clip extraction error:", err)
    } finally {
      setExtractingClips(false)
    }
  }

  const handleGenerateThumbnails = async () => {
    if (!thumbTopic.trim()) return
    setGeneratingThumbnails(true)
    try {
      const data = await api.generateThumbnailConcepts(thumbTopic)
      if (data?.concepts) {
        setThumbnailConcepts(data.concepts)
      }
    } catch (err) {
      console.error("Thumbnail generation error:", err)
    } finally {
      setGeneratingThumbnails(false)
    }
  }

  const handleGenerateMusic = async () => {
    setGeneratingMusic(true)
    try {
      const data = await api.generateMusic(mood, genre, tempoBpm, durationSeconds)
      setMusicTrack(data)
    } catch (err) {
      console.error("Music generation error:", err)
    } finally {
      setGeneratingMusic(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="pt-2 pb-3 border-b border-[var(--border)]/60">
        <h1 className="text-2xl sm:text-[30px] font-bold text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Media Studio
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
          Viral mini-clips extraction, Imagen 3 thumbnail concepts, and Lyria AI music synthesis.
        </p>
      </div>
      {/* Studio Tab Switcher */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] max-w-xl">
        <button
          onClick={() => setActiveTab("clips")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "clips"
              ? "bg-[var(--surface)] text-primary clay-sm shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <ScissorsIcon size={16} />
          <span>Mini-Clips Extractor</span>
        </button>

        <button
          onClick={() => setActiveTab("thumbnails")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "thumbnails"
              ? "bg-[var(--surface)] text-primary clay-sm shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Edit03Icon size={16} />
          <span>Imagen 3 Thumbnails</span>
        </button>

        <button
          onClick={() => setActiveTab("music")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "music"
              ? "bg-[var(--surface)] text-primary clay-sm shadow-xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <MusicNote01Icon size={16} />
          <span>Lyria Background Music</span>
        </button>
      </div>

      {/* TAB 1: Smart Mini-Clips Extractor */}
      {activeTab === "clips" && (
        <div className="flex flex-col gap-6">
          <ClayCard accent="var(--primary)">
            <div className="flex flex-col gap-5 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center">
                    <ScissorsIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-text-primary tracking-tight font-[var(--font-display)]">
                      Smart Mini-Clips & Repurposing Director
                    </h2>
                    <p className="text-xs text-text-tertiary">
                      Agent 12 · Extract viral 30-60s moments from long-form videos with vertical 9:16 crop packages
                    </p>
                  </div>
                </div>
                <span className="clay-sm px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary-pale">
                  Limit: {maxClips} Clips
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Original Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Video Transcript or Key Timestamps
                  </label>
                  <textarea
                    rows={3}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste your video transcript, notes, or chapter timestamps here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-primary transition leading-relaxed resize-none"
                  />
                </div>

                {/* Clip Limit Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-secondary">
                      Max Clips Limit:
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setMaxClips(num)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            maxClips === num
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-[var(--surface-sunken)] border-[var(--border)] text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleExtractClips}
                    disabled={extractingClips}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {extractingClips ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Detecting Viral Moments...</span>
                      </>
                    ) : (
                      <>
                        <ScissorsIcon size={14} />
                        <span>Extract {maxClips} Viral Clips</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ClayCard>

          {/* Render Extracted Clips */}
          <AnimatePresence>
            {clipsData?.clips?.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {clipsData.clips.map((clip: any) => (
                  <div
                    key={clip.clip_id}
                    className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-primary font-mono text-[11px] font-bold">
                        {clip.start_timestamp} - {clip.end_timestamp} ({clip.duration_seconds}s)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {clip.predicted_virality_score}% Virality
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                        {clip.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {clip.viral_hook_reason}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-1.5 text-[11px]">
                      <div className="flex items-center justify-between font-semibold text-text-tertiary">
                        <span>9:16 Vertical Crop Guide:</span>
                        <span className="text-primary font-bold">Shorts & Reels</span>
                      </div>
                      <p className="text-text-primary font-medium">
                        {clip.crop_guide_9_16}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-1.5 text-[11px]">
                      <span className="font-semibold text-text-tertiary">Suggested Platform Titles:</span>
                      {clip.platform_packages?.map((pkg: any, i: number) => (
                        <div key={i} className="text-text-primary text-[11px] leading-snug">
                          <span className="font-bold uppercase text-primary text-[10px] mr-1.5">
                            {pkg.platform === "youtube_shorts" ? "Shorts" : "Reels"}:
                          </span>
                          "{pkg.suggested_title}"
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-[var(--surface)] rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-3">
                  <ScissorsIcon size={24} />
                </div>
                <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                  Extract 1 to 5 Viral Clips from Any Video
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
                  Enter your video title and transcript above, choose your clip limit, and click <b>"Extract Viral Clips"</b> to produce short-form assets.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: Imagen 3 High-CTR Thumbnail Studio */}
      {activeTab === "thumbnails" && (
        <div className="flex flex-col gap-6">
          <ClayCard accent="var(--accent)">
            <div className="flex flex-col gap-5 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Edit03Icon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-text-primary tracking-tight font-[var(--font-display)]">
                      Imagen 3 High-CTR Thumbnail Studio
                    </h2>
                    <p className="text-xs text-text-tertiary">
                      Predictive High-CTR Visual Layouts, Color Harmonies & Photorealistic Prompts
                    </p>
                  </div>
                </div>
                <span className="clay-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50">
                  Engine: imagen-3.0-generate-002
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={thumbTopic}
                  onChange={(e) => setThumbTopic(e.target.value)}
                  placeholder="e.g. 10 AI Tools That Changed How I Build Software..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-accent transition"
                />
                <button
                  onClick={handleGenerateThumbnails}
                  disabled={generatingThumbnails}
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-60 shrink-0"
                >
                  {generatingThumbnails ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Concepts...</span>
                    </>
                  ) : (
                    <>
                      <SparkleIcon size={14} />
                      <span>Generate Concepts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </ClayCard>

          {/* Render Thumbnail Concepts */}
          <AnimatePresence>
            {thumbnailConcepts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {thumbnailConcepts.map((concept: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                        "{concept.headline_text}"
                      </span>
                      <span className="clay-sm px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                        {concept.predicted_ctr || "13.2%"} CTR
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-text-tertiary mb-1.5">
                        Harmonized Color Palette:
                      </p>
                      <div className="flex gap-2">
                        {concept.color_palette?.map((hex: string, i: number) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-lg border border-slate-200 shadow-xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                      <p className="text-[11px] font-bold text-text-primary mb-1">
                        Imagen 3 Generation Prompt:
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed font-mono text-[11px]">
                        {concept.imagen_prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-[var(--surface)] rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Edit03Icon size={24} />
                </div>
                <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                  Generate High-CTR Thumbnail Layouts
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
                  Enter your video title above and click <b>"Generate Concepts"</b> to synthesize predictive thumbnail concepts with color harmonies.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 3: Lyria AI Background Music Studio */}
      {activeTab === "music" && (
        <div className="flex flex-col gap-6">
          <ClayCard accent="var(--secondary)">
            <div className="flex flex-col gap-5 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-secondary flex items-center justify-center">
                    <MusicNote01Icon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-text-primary tracking-tight font-[var(--font-display)]">
                      Google DeepMind Lyria AI Background Music Studio
                    </h2>
                    <p className="text-xs text-text-tertiary">
                      Royalty-free background soundtrack generation with 100% YouTube Content ID & commercial clearance
                    </p>
                  </div>
                </div>
                <span className="clay-sm px-3 py-1 rounded-full text-xs font-semibold text-secondary bg-secondary-pale">
                  Engine: Lyria Gen-3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Track Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border)] text-xs text-text-primary focus:outline-none focus:border-secondary transition cursor-pointer"
                  >
                    <option value="lofi_chill">Lo-Fi Chill & Study</option>
                    <option value="uplifting">Uplifting & Inspiring</option>
                    <option value="cyberpunk">Cyberpunk / Tech Drive</option>
                    <option value="dramatic">Cinematic & Dramatic</option>
                    <option value="corporate">Minimal Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Tempo: {tempoBpm} BPM
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="160"
                    value={tempoBpm}
                    onChange={(e) => setTempoBpm(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--surface-sunken)] rounded-lg appearance-none cursor-pointer accent-secondary mt-2.5"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateMusic}
                    disabled={generatingMusic}
                    className="w-full py-2.5 px-4 rounded-xl bg-secondary text-white font-bold text-xs hover:brightness-110 active:scale-[0.98] transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {generatingMusic ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing Track...</span>
                      </>
                    ) : (
                      <>
                        <MusicNote01Icon size={14} />
                        <span>Synthesize Audio Track</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ClayCard>

          {/* Render Music Player & Clearance Certificate */}
          <AnimatePresence>
            {musicTrack ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-6"
              >
                {/* Audio Player Card */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)]">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                      onClick={togglePlayMusic}
                      className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-sm hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0"
                    >
                      {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                    </button>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                        {musicTrack.title}
                      </h4>
                      <p className="text-xs text-text-tertiary">
                        {musicTrack.artist} · {musicTrack.genre} ({musicTrack.tempo_bpm} BPM)
                      </p>
                    </div>
                  </div>

                  {/* Waveform Visualization Bars */}
                  <div className="flex items-end gap-1.5 h-10 w-full md:w-64 px-2">
                    {musicTrack.waveform_amplitudes?.map((amp: number, i: number) => (
                      <motion.div
                        key={i}
                        animate={
                          isPlaying
                            ? { height: [`${amp * 100}%`, `${Math.max(15, (1 - amp) * 100)}%`, `${amp * 100}%`] }
                            : { height: `${Math.max(15, amp * 100)}%` }
                        }
                        transition={
                          isPlaying
                            ? { repeat: Infinity, duration: 0.6 + (i % 6) * 0.1, ease: "easeInOut" }
                            : { repeat: 0, duration: 0.25, ease: "easeOut" }
                        }
                        className="flex-1 rounded-full bg-secondary transition-colors"
                        style={{ minHeight: 6 }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100 flex items-center gap-1.5">
                      <Shield01Icon size={14} />
                      <span>100% Cleared</span>
                    </span>
                  </div>
                </div>

                {/* Stems & License Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      Synthesized Audio Stems:
                    </span>
                    <ul className="flex flex-col gap-1.5 text-xs text-text-secondary">
                      {musicTrack.audio_stems?.map((stem: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckmarkSquare03Icon size={13} className="text-secondary" />
                          <span>{stem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border)] flex flex-col gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      Commercial License Verification:
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {musicTrack.clearance_certificate?.license_type}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-emerald-600">
                      <span>YouTube Content ID Safe</span> · <span>Instagram Reels Safe</span> · <span>TikTok Cleared</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-[var(--surface)] rounded-3xl border border-[var(--border)]">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-secondary flex items-center justify-center mb-3">
                  <MusicNote01Icon size={24} />
                </div>
                <h4 className="font-bold text-text-primary text-sm font-[var(--font-display)]">
                  Generate Custom Royalty-Free Music
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
                  Choose your mood and tempo above, then click <b>"Synthesize Audio Track"</b> to create cleared soundtracks for your videos.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
