import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { uploadAvatar, updateProfile, updateEmail, updatePassword, verifyCurrentPassword } from '../lib/auth'

interface Props {
  open: boolean
  onClose: () => void
}

type SectionStatus = { loading: boolean; error: string; success: string }
const idle = (): SectionStatus => ({ loading: false, error: '', success: '' })

const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

export default function AccountSettingsModal({ open, onClose }: Props) {
  const { user } = useAuth()

  // Current password (required before any change)
  const [currentPwd, setCurrentPwd] = useState('')
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<SectionStatus>(idle())

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarStatus, setAvatarStatus] = useState<SectionStatus>(idle())

  // Name
  const [name, setName] = useState('')
  const [nameStatus, setNameStatus] = useState<SectionStatus>(idle())

  // Email
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<SectionStatus>(idle())

  // Password
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [pwdStatus, setPwdStatus] = useState<SectionStatus>(idle())

  // Reset all state when modal opens/closes
  useEffect(() => {
    if (open && user) {
      setName((user.user_metadata?.full_name as string) ?? '')
      setEmail(user.email ?? '')
      setCurrentPwd('')
      setIsVerified(false)
      setVerifyStatus(idle())
      setNameStatus(idle())
      setEmailStatus(idle())
      setPwdStatus(idle())
      setAvatarStatus(idle())
      setNewPwd('')
      setConfirmPwd('')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync name/email when user metadata updates after a save
  useEffect(() => {
    if (user && open) {
      setName(prev => {
        const fresh = (user.user_metadata?.full_name as string) ?? ''
        return prev === '' ? fresh : prev
      })
    }
  }, [user, open])

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const initials = (user?.user_metadata?.full_name as string)?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase() ?? '؟'

  // ── Verify current password ──
  const handleVerify = async () => {
    if (!currentPwd) { setVerifyStatus({ loading: false, error: 'يرجى إدخال كلمة المرور الحالية', success: '' }); return }
    setVerifyStatus({ loading: true, error: '', success: '' })
    try {
      await verifyCurrentPassword(user!.email!, currentPwd)
      setIsVerified(true)
      setVerifyStatus({ loading: false, error: '', success: 'تم التحقق من هويتك' })
    } catch (err) {
      setIsVerified(false)
      setVerifyStatus({ loading: false, error: (err as Error).message, success: '' })
    }
  }

  // Helper: guard all save handlers behind verification
  const withVerify = async (action: () => Promise<void>, setStatus: (s: SectionStatus) => void) => {
    if (!isVerified) {
      setStatus({ loading: false, error: 'يجب التحقق من كلمة المرور الحالية أولاً', success: '' })
      return
    }
    await action()
  }

  // ── Avatar ──
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!isVerified) { setAvatarStatus({ loading: false, error: 'يجب التحقق من كلمة المرور الحالية أولاً', success: '' }); e.target.value = ''; return }
    setAvatarStatus({ loading: true, error: '', success: '' })
    try {
      await uploadAvatar(file, user.id)
      setAvatarStatus({ loading: false, error: '', success: 'تم تحديث الصورة بنجاح' })
    } catch {
      setAvatarStatus({ loading: false, error: 'فشل رفع الصورة، حاول مجدداً', success: '' })
    } finally {
      e.target.value = ''
    }
  }

  // ── Name ──
  const handleSaveName = () => withVerify(async () => {
    if (!name.trim()) { setNameStatus({ loading: false, error: 'يرجى إدخال الاسم', success: '' }); return }
    setNameStatus({ loading: true, error: '', success: '' })
    try {
      await updateProfile(name.trim())
      setNameStatus({ loading: false, error: '', success: 'تم تحديث الاسم بنجاح' })
    } catch {
      setNameStatus({ loading: false, error: 'فشل تحديث الاسم، حاول مجدداً', success: '' })
    }
  }, setNameStatus)

  // ── Email ──
  const handleSaveEmail = () => withVerify(async () => {
    if (!email.trim()) { setEmailStatus({ loading: false, error: 'يرجى إدخال البريد الإلكتروني', success: '' }); return }
    if (email === user?.email) { setEmailStatus({ loading: false, error: 'هذا هو بريدك الحالي', success: '' }); return }
    setEmailStatus({ loading: true, error: '', success: '' })
    try {
      await updateEmail(email.trim())
      setEmailStatus({ loading: false, error: '', success: 'تم إرسال رابط التأكيد إلى بريدك الجديد' })
    } catch {
      setEmailStatus({ loading: false, error: 'فشل تحديث البريد الإلكتروني، حاول مجدداً', success: '' })
    }
  }, setEmailStatus)

  // ── Password ──
  const handleSavePassword = () => withVerify(async () => {
    if (newPwd.length < 8) { setPwdStatus({ loading: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', success: '' }); return }
    if (newPwd !== confirmPwd) { setPwdStatus({ loading: false, error: 'كلمتا المرور غير متطابقتين', success: '' }); return }
    setPwdStatus({ loading: true, error: '', success: '' })
    try {
      await updatePassword(newPwd)
      setPwdStatus({ loading: false, error: '', success: 'تم تغيير كلمة المرور بنجاح' })
      setNewPwd('')
      setConfirmPwd('')
    } catch {
      setPwdStatus({ loading: false, error: 'فشل تغيير كلمة المرور، حاول مجدداً', success: '' })
    }
  }, setPwdStatus)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="account-modal-container">
            <motion.div
              className="account-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="account-modal-header">
                <h2 className="account-modal-title">إعدادات الحساب</h2>
                <button className="account-modal-close" onClick={onClose} aria-label="إغلاق">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="account-modal-body">

                {/* ── Verify Identity ── */}
                <div className={`account-verify-banner${isVerified ? ' account-verify-banner-ok' : ''}`}>
                  {isVerified ? (
                    <div className="account-verify-ok">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      تم التحقق من هويتك — يمكنك تعديل بياناتك
                    </div>
                  ) : (
                    <>
                      <p className="account-verify-label">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        أدخل كلمة مرورك الحالية للتحقق من هويتك
                      </p>
                      <div className="account-verify-row">
                        <div className="account-pwd-wrap" style={{ flex: 1 }}>
                          <input
                            type={showCurrentPwd ? 'text' : 'password'}
                            className="account-input"
                            placeholder="كلمة المرور الحالية"
                            value={currentPwd}
                            onChange={e => { setCurrentPwd(e.target.value); setVerifyStatus(idle()) }}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                            dir="ltr"
                          />
                          <button type="button" className="account-eye-btn" onClick={() => setShowCurrentPwd(v => !v)}>
                            <EyeIcon visible={showCurrentPwd} />
                          </button>
                        </div>
                        <button
                          className="account-save-btn"
                          onClick={handleVerify}
                          disabled={verifyStatus.loading}
                        >
                          {verifyStatus.loading
                            ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                            : 'تحقق'}
                        </button>
                      </div>
                      {verifyStatus.error && <p className="account-msg account-msg-error" style={{ marginTop: 8 }}>{verifyStatus.error}</p>}
                    </>
                  )}
                </div>

                {/* ── Avatar ── */}
                <div className="account-section">
                  <div className="account-section-title">الصورة الشخصية</div>
                  <div className="account-avatar-section">
                    <div
                      className={`account-avatar-wrap${!isVerified ? ' account-avatar-locked' : ''}`}
                      onClick={() => !avatarStatus.loading && fileInputRef.current?.click()}
                      title={isVerified ? 'اضغط لتغيير الصورة' : 'تحقق من هويتك أولاً'}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="صورتك الشخصية" className="account-avatar-img" />
                      ) : (
                        <span className="account-avatar-initials">{initials}</span>
                      )}
                      <div className="account-avatar-overlay">
                        {avatarStatus.loading ? (
                          <span className="btn-spinner" style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#fff', borderTopColor: 'transparent' }} />
                        ) : isVerified ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} disabled={avatarStatus.loading || !isVerified} />
                    <p className="account-avatar-hint">
                      {avatarStatus.loading ? 'جارٍ رفع الصورة...' : isVerified ? 'اضغط على الصورة لتغييرها' : 'تحقق من هويتك لتغيير الصورة'}
                    </p>
                    {avatarStatus.error && <p className="account-msg account-msg-error">{avatarStatus.error}</p>}
                    {avatarStatus.success && <p className="account-msg account-msg-success">{avatarStatus.success}</p>}
                  </div>
                </div>

                <div className="account-divider" />

                {/* ── Name ── */}
                <div className="account-section">
                  <div className="account-section-title">الاسم الكامل</div>
                  <div className="account-field-row">
                    <input
                      type="text"
                      className="account-input"
                      placeholder="أدخل اسمك الكامل"
                      value={name}
                      onChange={e => { setName(e.target.value); setNameStatus(idle()) }}
                      disabled={!isVerified}
                    />
                    <button
                      className="account-save-btn"
                      onClick={handleSaveName}
                      disabled={nameStatus.loading || !isVerified}
                    >
                      {nameStatus.loading ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'حفظ'}
                    </button>
                  </div>
                  {nameStatus.error && <p className="account-msg account-msg-error">{nameStatus.error}</p>}
                  {nameStatus.success && <p className="account-msg account-msg-success">{nameStatus.success}</p>}
                </div>

                <div className="account-divider" />

                {/* ── Email ── */}
                <div className="account-section">
                  <div className="account-section-title">البريد الإلكتروني</div>
                  <div className="account-field-row">
                    <input
                      type="email"
                      className="account-input"
                      placeholder="example@domain.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailStatus(idle()) }}
                      dir="ltr"
                      disabled={!isVerified}
                    />
                    <button
                      className="account-save-btn"
                      onClick={handleSaveEmail}
                      disabled={emailStatus.loading || !isVerified}
                    >
                      {emailStatus.loading ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'حفظ'}
                    </button>
                  </div>
                  {emailStatus.error && <p className="account-msg account-msg-error">{emailStatus.error}</p>}
                  {emailStatus.success && <p className="account-msg account-msg-success">{emailStatus.success}</p>}
                </div>

                <div className="account-divider" />

                {/* ── Password ── */}
                <div className="account-section">
                  <div className="account-section-title">تغيير كلمة المرور</div>
                  <div className="account-field-col">
                    <div className="account-pwd-wrap">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        className="account-input"
                        placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                        value={newPwd}
                        onChange={e => { setNewPwd(e.target.value); setPwdStatus(idle()) }}
                        dir="ltr"
                        disabled={!isVerified}
                      />
                      <button type="button" className="account-eye-btn" onClick={() => setShowNewPwd(v => !v)}>
                        <EyeIcon visible={showNewPwd} />
                      </button>
                    </div>
                    <div className="account-pwd-wrap">
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        className="account-input"
                        placeholder="تأكيد كلمة المرور الجديدة"
                        value={confirmPwd}
                        onChange={e => { setConfirmPwd(e.target.value); setPwdStatus(idle()) }}
                        dir="ltr"
                        disabled={!isVerified}
                      />
                      <button type="button" className="account-eye-btn" onClick={() => setShowConfirmPwd(v => !v)}>
                        <EyeIcon visible={showConfirmPwd} />
                      </button>
                    </div>
                    <button
                      className="account-save-btn account-save-btn-full"
                      onClick={handleSavePassword}
                      disabled={pwdStatus.loading || !isVerified}
                    >
                      {pwdStatus.loading
                        ? <><span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />جارٍ الحفظ...</>
                        : 'تغيير كلمة المرور'}
                    </button>
                  </div>
                  {pwdStatus.error && <p className="account-msg account-msg-error">{pwdStatus.error}</p>}
                  {pwdStatus.success && <p className="account-msg account-msg-success">{pwdStatus.success}</p>}
                </div>

              </div>

              {/* Footer */}
              <div className="account-modal-footer">
                <button className="account-btn-close" onClick={onClose}>إغلاق</button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
