import { useState, FormEvent } from 'react';
import {
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  MessageSquare,
  FileText,
  Stethoscope,
  Briefcase,
  Send
} from 'lucide-react';
import { submitForm, FormSubmission } from '../lib/supabase';
import { cityOptions } from '../data/cities';

type RepresentativeType = FormSubmission['representative_type'];

interface FormData {
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  brandName: string;
  representativeType: RepresentativeType | '';
  medicalSpecialty: string;
  brandField: string;
  city: string;
  country: string;
  website: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  messageToManagement: string;
  notes: string;
}

export default function LandingPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    whatsapp: '',
    email: '',
    brandName: '',
    representativeType: '',
    medicalSpecialty: '',
    brandField: '',
    city: '',
    country: 'السعودية',
    website: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    snapchat: '',
    messageToManagement: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showMedicalSpecialty =
    formData.representativeType === 'doctor' ||
    formData.representativeType === 'clinic';

  const showBrandField = formData.representativeType === 'other';
  const showCountryInput = formData.city === 'outside_ksa';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الثاني مطلوب';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'رقم الواتساب مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.brandName.trim()) newErrors.brandName = 'اسم البراند مطلوب';
    if (!formData.representativeType) newErrors.representativeType = 'يرجى الاختيار';
    if (!formData.city) newErrors.city = 'المدينة مطلوبة';

    if (showMedicalSpecialty && !formData.medicalSpecialty.trim()) {
      newErrors.medicalSpecialty = 'التخصص الطبي مطلوب';
    }

    if (showBrandField && !formData.brandField.trim()) {
      newErrors.brandField = 'مجال عمل البراند مطلوب';
    }

    if (showCountryInput && !formData.country.trim()) {
      newErrors.country = 'اسم الدولة مطلوب';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submission: FormSubmission = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        whatsapp: formData.whatsapp,
        email: formData.email,
        brand_name: formData.brandName,
        representative_type: formData.representativeType as RepresentativeType,
        city: formData.city,
        country: showCountryInput ? formData.country : 'السعودية',
        ...(showMedicalSpecialty && { medical_specialty: formData.medicalSpecialty }),
        ...(showBrandField && { brand_field: formData.brandField }),
        ...(formData.website && { website: formData.website }),
        ...(formData.instagram && { instagram: formData.instagram }),
        ...(formData.youtube && { youtube: formData.youtube }),
        ...(formData.tiktok && { tiktok: formData.tiktok }),
        ...(formData.snapchat && { snapchat: formData.snapchat }),
        ...(formData.messageToManagement && { message_to_management: formData.messageToManagement }),
        ...(formData.notes && { notes: formData.notes }),
      };

      await submitForm(submission);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          whatsapp: '',
          email: '',
          brandName: '',
          representativeType: '',
          medicalSpecialty: '',
          brandField: '',
          city: '',
          country: 'السعودية',
          website: '',
          instagram: '',
          youtube: '',
          tiktok: '',
          snapchat: '',
          messageToManagement: '',
          notes: '',
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'city' && value !== 'outside_ksa') {
      setFormData(prev => ({ ...prev, country: 'السعودية' }));
    }

    if (field === 'representativeType') {
      if (value !== 'doctor' && value !== 'clinic') {
        setFormData(prev => ({ ...prev, medicalSpecialty: '' }));
      }
      if (value !== 'other') {
        setFormData(prev => ({ ...prev, brandField: '' }));
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-sky-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pulse-wave"></div>
        <div className="pulse-wave" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex flex-col items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center animate-float">
                <img
                  src="/Dot-Logo.svg"
                  alt="Dot Studio Logo"
                  className="w-full h-full drop-shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide" style={{ fontFamily: "'Cairo', sans-serif", letterSpacing: '0.02em' }}>
              Dot Studio
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-sky-100 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
            نرسم حضورك الطبي
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 md:p-8 lg:p-10 animate-slide-up">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400 rounded-lg text-green-100 text-center animate-fade-in">
                تم إرسال البيانات بنجاح! سنتواصل معك قريباً
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">
                    <User className="w-5 h-5" />
                    <span>الاسم الأول *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`form-input ${errors.firstName ? 'border-red-400' : ''}`}
                    placeholder="أدخل اسمك الأول"
                  />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <User className="w-5 h-5" />
                    <span>الاسم الثاني *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`form-input ${errors.lastName ? 'border-red-400' : ''}`}
                    placeholder="أدخل اسمك الثاني"
                  />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="w-5 h-5" />
                  <span>رقم الواتساب *</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-20 px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-center font-medium">
                    +966
                  </div>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className={`form-input flex-1 ${errors.whatsapp ? 'border-red-400' : ''}`}
                    placeholder="5xxxxxxxx"
                  />
                </div>
                <p className="mt-2 text-xs text-sky-200">
                  سيتم إرسال رمز التحقق عبر الواتساب
                </p>
                {errors.whatsapp && <p className="form-error">{errors.whatsapp}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail className="w-5 h-5" />
                  <span>البريد الإلكتروني *</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="example@domain.com"
                  dir="ltr"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building2 className="w-5 h-5" />
                  <span>اسم البراند *</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className={`form-input ${errors.brandName ? 'border-red-400' : ''}`}
                  placeholder="أدخل اسم البراند"
                />
                {errors.brandName && <p className="form-error">{errors.brandName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Briefcase className="w-5 h-5" />
                  <span>أنت تتحدث بالنيابة عن؟ *</span>
                </label>
                <select
                  value={formData.representativeType}
                  onChange={(e) => handleChange('representativeType', e.target.value)}
                  className={`form-input ${errors.representativeType ? 'border-red-400' : ''}`}
                >
                  <option value="">اختر...</option>
                  <option value="doctor">طبيب</option>
                  <option value="clinic">عيادة</option>
                  <option value="medical_center">مركز طبي</option>
                  <option value="other">أخرى</option>
                </select>
                {errors.representativeType && <p className="form-error">{errors.representativeType}</p>}
              </div>

              {showMedicalSpecialty && (
                <div className="form-group animate-slide-down">
                  <label className="form-label">
                    <Stethoscope className="w-5 h-5" />
                    <span>التخصص الطبي *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.medicalSpecialty}
                    onChange={(e) => handleChange('medicalSpecialty', e.target.value)}
                    className={`form-input ${errors.medicalSpecialty ? 'border-red-400' : ''}`}
                    placeholder="مثلاً: طب الأسنان، جراحة، أطفال..."
                  />
                  {errors.medicalSpecialty && <p className="form-error">{errors.medicalSpecialty}</p>}
                </div>
              )}

              {showBrandField && (
                <div className="form-group animate-slide-down">
                  <label className="form-label">
                    <Briefcase className="w-5 h-5" />
                    <span>مجال عمل البراند *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.brandField}
                    onChange={(e) => handleChange('brandField', e.target.value)}
                    className={`form-input ${errors.brandField ? 'border-red-400' : ''}`}
                    placeholder="مثلاً: تجارة إلكترونية، مطعم، معرض سيارات"
                  />
                  {errors.brandField && <p className="form-error">{errors.brandField}</p>}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <MapPin className="w-5 h-5" />
                  <span>المدينة *</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`form-input ${errors.city ? 'border-red-400' : ''}`}
                >
                  <option value="">اختر المدينة...</option>
                  {cityOptions.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>

              {showCountryInput && (
                <div className="form-group animate-slide-down">
                  <label className="form-label">
                    <Globe className="w-5 h-5" />
                    <span>اسم الدولة *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={`form-input ${errors.country ? 'border-red-400' : ''}`}
                    placeholder="أدخل اسم الدولة"
                  />
                  {errors.country && <p className="form-error">{errors.country}</p>}
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-300" />
                  روابط التواصل الاجتماعي
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-sm">
                      <Globe className="w-4 h-4" />
                      <span>الموقع الإلكتروني</span>
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="form-input"
                      placeholder="https://example.com"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm">
                      <Instagram className="w-4 h-4" />
                      <span>إنستجرام</span>
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="form-input"
                      placeholder="@username"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm">
                      <Youtube className="w-4 h-4" />
                      <span>يوتيوب</span>
                    </label>
                    <input
                      type="text"
                      value={formData.youtube}
                      onChange={(e) => handleChange('youtube', e.target.value)}
                      className="form-input"
                      placeholder="Channel URL"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>تيك توك</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => handleChange('tiktok', e.target.value)}
                      className="form-input"
                      placeholder="@username"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label className="form-label text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>سناب شات</span>
                    </label>
                    <input
                      type="text"
                      value={formData.snapchat}
                      onChange={(e) => handleChange('snapchat', e.target.value)}
                      className="form-input"
                      placeholder="@username"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare className="w-5 h-5" />
                  <span>رسالة للإدارة</span>
                </label>
                <textarea
                  value={formData.messageToManagement}
                  onChange={(e) => handleChange('messageToManagement', e.target.value.slice(0, 1000))}
                  className="form-input min-h-[100px] resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  maxLength={1000}
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-sky-200">
                    في حال كتابة رسالة، سيتم إرسالها مرفقة ببياناتك بشكل مباشر لإدارة الشركة
                  </p>
                  <span className="text-xs text-sky-300">
                    {formData.messageToManagement.length}/1000
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText className="w-5 h-5" />
                  <span>ملاحظات</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="form-input min-h-[100px] resize-none"
                  placeholder="أي ملاحظات إضافية..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>ابدأ الآن</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="text-center mt-8 text-sky-200 text-sm">
            <p>© 2025 Dot Studio. جميع الحقوق محفوظة</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
