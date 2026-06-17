import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onClose: () => void
}

const STEPS = [
  {
    num: '١',
    title: 'ما هي المحفظة الرقمية؟',
    desc: 'المحفظة الرقمية (Crypto Wallet) هي برنامج يخزّن مفاتيحك الخاصة ويتيح لك التعامل مع شبكة البلوكشين. لا تحتاج إلى بنك أو وسيط — أنت تتحكم بحقوقك مباشرة.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    num: '٢',
    title: 'كيف أحصل عليها؟',
    desc: 'أشهر المحافظ هي MetaMask — إضافة مجانية لمتصفح Chrome أو Firefox. ثبّتها من الموقع الرسمي فقط واحتفظ بعبارة الاسترداد السرية في مكان آمن.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    num: '٣',
    title: 'كيف أربطها بالمنصة؟',
    desc: 'اضغط "ربط المحفظة" ← اختر MetaMask من القائمة ← اضغط "Connect" في نافذة MetaMask ← تأكد من اختيار شبكة Sepolia Testnet.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    num: '٤',
    title: 'لماذا نحتاجها هنا؟',
    desc: 'المحفظة تُوقّع على تسجيل حقوقك في البلوكشين — كأنها توقيعك الرقمي الذي لا يمكن تزويره. كل شهادة مرتبطة بعنوان محفظتك وتُخزَّن في قاعدة البيانات.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
]

export default function WalletGuideModal({ onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="wgm-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="wgm-modal"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="wgm-header">
            <div className="wgm-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 className="wgm-title">دليل المحفظة الرقمية</h2>
            <button className="wgm-close" onClick={onClose} aria-label="إغلاق">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="wgm-steps">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                className="wgm-step"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
              >
                <div className="wgm-step-num">{s.num}</div>
                <div className="wgm-step-icon">{s.icon}</div>
                <div className="wgm-step-body">
                  <p className="wgm-step-title">{s.title}</p>
                  <p className="wgm-step-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="wgm-footer">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="wgm-install-btn"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width="20" height="20" />
              تثبيت MetaMask
            </a>
            <button className="wgm-close-btn" onClick={onClose}>فهمت، ارجع للتسجيل</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
