import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'


const EASE = 'easeOut' as const

// ── Mockup screens ──────────────────────────────────────────────────────────

function MockupSignup() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body">
        <div className="hiw-mock-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          إدارة الملكية الفكرية
        </div>
        <div className="hiw-mock-heading">إنشاء حساب جديد</div>
        <div className="hiw-mock-field">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          example@example.com
        </div>
        <div className="hiw-mock-field">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          ••••••••••
        </div>
        <div className="hiw-mock-btn-primary">إنشاء الحساب</div>
        <div className="hiw-mock-link-row">لديك حساب؟ <span>تسجيل الدخول</span></div>
      </div>
    </div>
  )
}

function MockupWallet() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body">
        <div className="hiw-mock-heading" style={{ marginBottom: 4 }}>ربط المحفظة</div>
        <div className="hiw-mock-sub">للتوقيع على شبكة البلوكشين</div>
        <div className="hiw-mock-wallet-btn">
          <svg width="18" height="18" viewBox="0 0 35 33" fill="none"><path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E17726"/><path d="M2.04858 1L15.0707 10.8093L12.7336 4.99099L2.04858 1Z" fill="#E27625"/><path d="M28.2295 23.5334L24.7344 28.872L32.2351 30.9324L34.3825 23.6501L28.2295 23.5334Z" fill="#E27625"/><path d="M0.627441 23.6501L2.76281 30.9324L10.2516 28.872L6.76849 23.5334L0.627441 23.6501Z" fill="#E27625"/></svg>
          ربط MetaMask
        </div>
        <div className="hiw-mock-hint-box">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          محفظتك تمنحك هوية رقمية فريدة على البلوكشين
        </div>
        <div className="hiw-mock-link-row">كيف أحصل على محفظة؟ <span>دليل الخطوات →</span></div>
      </div>
    </div>
  )
}

function MockupIPType() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body">
        <div className="hiw-mock-heading" style={{ marginBottom: 12 }}>نوع الحق الفكري</div>
        <div className="hiw-mock-type-grid">
          <div className="hiw-mock-type hiw-mock-type-selected">
            <span style={{ fontSize: 18 }}>©</span>
            حقوق النشر
          </div>
          <div className="hiw-mock-type">
            <span style={{ fontSize: 18 }}>®</span>
            العلامات التجارية
          </div>
          <div className="hiw-mock-type">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
            براءات الاختراع
          </div>
        </div>
        <div className="hiw-mock-field-sm">اسم العمل *</div>
        <div className="hiw-mock-field" style={{ opacity: 0.6 }}>
          <span style={{ color: '#64748b' }}>مثال: رواية «الطريق الطويل»...</span>
        </div>
        <div className="hiw-mock-field-sm" style={{ marginTop: 6 }}>نوع العمل *</div>
        <div className="hiw-mock-select">كتاب / مؤلَّف أدبي ▾</div>
      </div>
    </div>
  )
}

function MockupUpload() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body">
        <div className="hiw-mock-heading" style={{ marginBottom: 10 }}>رفع الملف</div>
        <div className="hiw-mock-upload">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div className="hiw-mock-upload-label">اسحب الملف أو انقر للرفع</div>
          <div className="hiw-mock-upload-sub">PDF، صورة، أو أي ملف · حتى 50MB</div>
        </div>
        <div className="hiw-mock-hash-preview">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>SHA-256: <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>a3f9c2...e7b1</span></span>
        </div>
      </div>
    </div>
  )
}

function MockupBlockchain() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body">
        <div className="hiw-mock-success-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          تمت المعاملة بنجاح
        </div>
        <div className="hiw-mock-bc-row">
          <span className="hiw-mock-bc-label">رقم الشهادة</span>
          <span className="hiw-mock-bc-val">#1,234</span>
        </div>
        <div className="hiw-mock-bc-row">
          <span className="hiw-mock-bc-label">هاش المعاملة</span>
          <span className="hiw-mock-bc-val" style={{ fontFamily: 'monospace', fontSize: 9 }}>0x4a8f...c21b</span>
        </div>
        <div className="hiw-mock-bc-row">
          <span className="hiw-mock-bc-label">رقم الكتلة</span>
          <span className="hiw-mock-bc-val">#4,521,908</span>
        </div>
        <div className="hiw-mock-bc-row">
          <span className="hiw-mock-bc-label">الشبكة</span>
          <span className="hiw-mock-bc-val">Sepolia Testnet</span>
        </div>
        <div className="hiw-mock-btn-primary" style={{ marginTop: 10, fontSize: 11 }}>عرض الشهادة الكاملة</div>
      </div>
    </div>
  )
}

function MockupCertificate() {
  return (
    <div className="hiw-screen">
      <div className="hiw-screen-bar"><span /><span /><span /></div>
      <div className="hiw-screen-body" style={{ flexDirection: 'row', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="hiw-mock-ip-badge">© حقوق النشر</span>
            <span className="hiw-mock-valid-badge">✓ سارية</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>رواية «الطريق الطويل»</div>
          <div className="hiw-mock-bc-row" style={{ flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <span className="hiw-mock-bc-label">صاحب الحق</span>
            <span style={{ fontSize: 10, color: '#e2e8f0' }}>محمد أحمد السيد</span>
          </div>
          <div className="hiw-mock-bc-row" style={{ flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <span className="hiw-mock-bc-label">رقم الشهادة</span>
            <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>#1,234</span>
          </div>
          <div className="hiw-mock-btn-outline" style={{ fontSize: 9, padding: '4px 8px', marginTop: 4 }}>Etherscan ↗</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            {/* QR code visual */}
            {[0,1,2,3,4,5,6,7].map(row =>
              [0,1,2,3,4,5,6,7].map(col => {
                const qrPattern = [
                  [1,1,1,1,1,1,1,0],[1,0,0,0,0,0,1,0],[1,0,1,1,1,0,1,0],
                  [1,0,1,1,1,0,1,0],[1,0,1,1,1,0,1,0],[1,0,0,0,0,0,1,0],
                  [1,1,1,1,1,1,1,0],[0,0,0,0,0,0,0,0]
                ]
                const filled = qrPattern[row]?.[col] ?? (Math.random() > 0.5 ? 1 : 0)
                return filled ? <rect key={`${row}-${col}`} x={col * 8} y={row * 8} width="7" height="7" rx="1" fill="#60a5fa" /> : null
              })
            )}
          </svg>
          <span style={{ fontSize: 9, color: '#64748b' }}>امسح للتحقق</span>
        </div>
      </div>
    </div>
  )
}

// ── Slide data ───────────────────────────────────────────────────────────────

interface Slide {
  num: string
  color: string
  bg: string
  title: string
  desc: string
  tips: string[]
  mockup: React.ReactNode
}

const SLIDES: Slide[] = [
  {
    num: '01', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    title: 'أنشئ حسابك في دقيقة',
    desc: 'سجّل بريدك الإلكتروني وكلمة مرور. ستصلك رسالة تأكيد فورية، وبعدها تكون جاهزاً للبدء.',
    tips: ['التسجيل مجاني تماماً', 'لا حاجة لبيانات بنكية', 'تأكيد فوري على بريدك'],
    mockup: <MockupSignup />,
  },
  {
    num: '02', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    title: 'اربط محفظة البلوكشين',
    desc: 'ربط محفظة MetaMask يمنحك هوية رقمية فريدة على شبكة Ethereum. إذا لم تكن لديك محفظة، يوجد دليل مفصل داخل الموقع.',
    tips: ['محفظة MetaMask مجانية', 'استخدام شبكة Sepolia التجريبية', 'لا تكلفة حقيقية على التسجيل'],
    mockup: <MockupWallet />,
  },
  {
    num: '03', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',
    title: 'اختر نوع حقك الفكري',
    desc: 'كل نوع له نموذج مخصص بحقول مختلفة. حقوق النشر للكتب والبرامج، العلامات التجارية للشعارات، وبراءات الاختراع للاكتشافات التقنية.',
    tips: ['3 أنواع مدعومة', 'حقول مخصصة لكل نوع', 'كل الحقول موضحة بمثال'],
    mockup: <MockupIPType />,
  },
  {
    num: '04', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',
    title: 'ارفع الملف واحسب البصمة',
    desc: 'ارفع الملف الذي تريد حمايته. سيتم حساب بصمته الرقمية (SHA-256) تلقائياً في متصفحك دون إرسالها للخادم.',
    tips: ['الحساب يتم محلياً في المتصفح', 'الملف لا يُرفع للسيرفر', 'SHA-256 = ضمان عدم التغيير'],
    mockup: <MockupUpload />,
  },
  {
    num: '05', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    title: 'سجّل على البلوكشين',
    desc: 'بنقرة واحدة يُرسل طلبك لشبكة Ethereum. MetaMask ستطلب موافقتك، وبعد التأكيد تصبح شهادتك دائمة لا يمكن حذفها أو تعديلها.',
    tips: ['الشهادة دائمة لا تُحذف', 'رقم الكتلة دليل التوقيت', 'يمكن التحقق عبر Etherscan'],
    mockup: <MockupBlockchain />,
  },
  {
    num: '06', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    title: 'شهادتك جاهزة للمشاركة',
    desc: 'احصل على رقم الشهادة ورمز QR. شاركهما مع أي جهة قانونية أو شخصية للتحقق الفوري من أصالة عملك دون الحاجة للمنصة.',
    tips: ['QR code للمشاركة الفورية', 'التحقق يعمل دون حساب', 'مقبول كدليل قانوني'],
    mockup: <MockupCertificate />,
  },
]

// ── Main component ───────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  const goTo = useCallback((idx: number) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
  }, [active])

  const prev = useCallback(() => goTo(active === 0 ? SLIDES.length - 1 : active - 1), [active, goTo])
  const next = useCallback(() => goTo(active === SLIDES.length - 1 ? 0 : active + 1), [active, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  next()
      if (e.key === 'ArrowRight') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  const slide = SLIDES[active]

  return (
    <section className="hiw-section section" id="how">
      <div className="container">

        {/* Header */}
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
          <div className="section-badge">{t('how.badge')}</div>
          <h2 className="section-title">{t('how.title')}</h2>
          <p className="section-subtitle">{t('how.subtitle')}</p>
        </motion.div>

        {/* Step dots nav */}
        <div className="hiw-steps-nav">
          {SLIDES.map((s, i) => (
            <button key={s.num} className={`hiw-step-dot${active === i ? ' hiw-step-dot-active' : ''}`}
              style={active === i ? { background: s.color, borderColor: s.color } : {}}
              onClick={() => goTo(i)}
              aria-label={`الخطوة ${s.num}`}
            >
              <span className="hiw-step-dot-num">{s.num}</span>
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="hiw-slider-wrap">
          <button className="hiw-arrow hiw-arrow-prev" onClick={prev} aria-label="السابق">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="hiw-slide-frame">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                className="hiw-slide"
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {/* Left: info */}
                <div className="hiw-slide-info">
                  <div className="hiw-step-badge" style={{ background: slide.bg, color: slide.color, borderColor: slide.color }}>
                    الخطوة {slide.num}
                  </div>
                  <h3 className="hiw-slide-title">
                    {slide.title}
                  </h3>
                  <p className="hiw-slide-desc">
                    {slide.desc}
                  </p>
                  <ul className="hiw-slide-tips">
                    {slide.tips.map((tip, i) => (
                      <li key={i}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={slide.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: mockup screen */}
                <div className="hiw-slide-screen">
                  <div className="hiw-screen-glow" style={{ background: slide.color }} />
                  {slide.mockup}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="hiw-arrow hiw-arrow-next" onClick={next} aria-label="التالي">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="hiw-progress-bar">
          <motion.div className="hiw-progress-fill"
            animate={{ width: `${((active + 1) / SLIDES.length) * 100}%`, background: slide.color }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
        <p className="hiw-progress-label">
          {active + 1} / {SLIDES.length}
        </p>

      </div>
    </section>
  )
}
