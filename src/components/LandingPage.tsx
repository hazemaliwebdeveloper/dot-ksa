import { useState, FormEvent, SVGProps } from 'react';
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
  countryCode: string;
  website: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  messageToManagement: string;
  notes: string;
}

const countryCodes = [
  { name: 'Afghanistan', dialCode: '+93', code: 'AF' },
  { name: 'Aland Islands', dialCode: '+358', code: 'AX' },
  { name: 'Albania', dialCode: '+355', code: 'AL' },
  { name: 'Algeria', dialCode: '+213', code: 'DZ' },
  { name: 'American Samoa', dialCode: '+1684', code: 'AS' },
  { name: 'Andorra', dialCode: '+376', code: 'AD' },
  { name: 'Angola', dialCode: '+244', code: 'AO' },
  { name: 'Anguilla', dialCode: '+1264', code: 'AI' },
  { name: 'Antarctica', dialCode: '+672', code: 'AQ' },
  { name: 'Antigua and Barbuda', dialCode: '+1268', code: 'AG' },
  { name: 'Argentina', dialCode: '+54', code: 'AR' },
  { name: 'Armenia', dialCode: '+374', code: 'AM' },
  { name: 'Aruba', dialCode: '+297', code: 'AW' },
  { name: 'Australia', dialCode: '+61', code: 'AU' },
  { name: 'Austria', dialCode: '+43', code: 'AT' },
  { name: 'Azerbaijan', dialCode: '+994', code: 'AZ' },
  { name: 'Bahamas', dialCode: '+1242', code: 'BS' },
  { name: 'Bahrain', dialCode: '+973', code: 'BH' },
  { name: 'Bangladesh', dialCode: '+880', code: 'BD' },
  { name: 'Barbados', dialCode: '+1246', code: 'BB' },
  { name: 'Belarus', dialCode: '+375', code: 'BY' },
  { name: 'Belgium', dialCode: '+32', code: 'BE' },
  { name: 'Belize', dialCode: '+501', code: 'BZ' },
  { name: 'Benin', dialCode: '+229', code: 'BJ' },
  { name: 'Bermuda', dialCode: '+1441', code: 'BM' },
  { name: 'Bhutan', dialCode: '+975', code: 'BT' },
  { name: 'Bolivia', dialCode: '+591', code: 'BO' },
  { name: 'Bosnia and Herzegovina', dialCode: '+387', code: 'BA' },
  { name: 'Botswana', dialCode: '+267', code: 'BW' },
  { name: 'Brazil', dialCode: '+55', code: 'BR' },
  { name: 'British Indian Ocean Territory', dialCode: '+246', code: 'IO' },
  { name: 'Brunei', dialCode: '+673', code: 'BN' },
  { name: 'Bulgaria', dialCode: '+359', code: 'BG' },
  { name: 'Burkina Faso', dialCode: '+226', code: 'BF' },
  { name: 'Burundi', dialCode: '+257', code: 'BI' },
  { name: 'Cambodia', dialCode: '+855', code: 'KH' },
  { name: 'Cameroon', dialCode: '+237', code: 'CM' },
  { name: 'Canada', dialCode: '+1', code: 'CA' },
  { name: 'Cape Verde', dialCode: '+238', code: 'CV' },
  { name: 'Cayman Islands', dialCode: '+1345', code: 'KY' },
  { name: 'Central African Republic', dialCode: '+236', code: 'CF' },
  { name: 'Chad', dialCode: '+235', code: 'TD' },
  { name: 'Chile', dialCode: '+56', code: 'CL' },
  { name: 'China', dialCode: '+86', code: 'CN' },
  { name: 'Christmas Island', dialCode: '+61', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', dialCode: '+61', code: 'CC' },
  { name: 'Colombia', dialCode: '+57', code: 'CO' },
  { name: 'Comoros', dialCode: '+269', code: 'KM' },
  { name: 'Congo', dialCode: '+242', code: 'CG' },
  { name: 'Democratic Republic of the Congo', dialCode: '+243', code: 'CD' },
  { name: 'Cook Islands', dialCode: '+682', code: 'CK' },
  { name: 'Costa Rica', dialCode: '+506', code: 'CR' },
  { name: "Cote d'Ivoire", dialCode: '+225', code: 'CI' },
  { name: 'Croatia', dialCode: '+385', code: 'HR' },
  { name: 'Cuba', dialCode: '+53', code: 'CU' },
  { name: 'Cyprus', dialCode: '+357', code: 'CY' },
  { name: 'Czech Republic', dialCode: '+420', code: 'CZ' },
  { name: 'Denmark', dialCode: '+45', code: 'DK' },
  { name: 'Djibouti', dialCode: '+253', code: 'DJ' },
  { name: 'Dominica', dialCode: '+1767', code: 'DM' },
  { name: 'Dominican Republic', dialCode: '+1849', code: 'DO' },
  { name: 'Ecuador', dialCode: '+593', code: 'EC' },
  { name: 'Egypt', dialCode: '+20', code: 'EG' },
  { name: 'El Salvador', dialCode: '+503', code: 'SV' },
  { name: 'Equatorial Guinea', dialCode: '+240', code: 'GQ' },
  { name: 'Eritrea', dialCode: '+291', code: 'ER' },
  { name: 'Estonia', dialCode: '+372', code: 'EE' },
  { name: 'Ethiopia', dialCode: '+251', code: 'ET' },
  { name: 'Falkland Islands', dialCode: '+500', code: 'FK' },
  { name: 'Faroe Islands', dialCode: '+298', code: 'FO' },
  { name: 'Fiji', dialCode: '+679', code: 'FJ' },
  { name: 'Finland', dialCode: '+358', code: 'FI' },
  { name: 'France', dialCode: '+33', code: 'FR' },
  { name: 'French Guiana', dialCode: '+594', code: 'GF' },
  { name: 'French Polynesia', dialCode: '+689', code: 'PF' },
  { name: 'Gabon', dialCode: '+241', code: 'GA' },
  { name: 'Gambia', dialCode: '+220', code: 'GM' },
  { name: 'Georgia', dialCode: '+995', code: 'GE' },
  { name: 'Germany', dialCode: '+49', code: 'DE' },
  { name: 'Ghana', dialCode: '+233', code: 'GH' },
  { name: 'Gibraltar', dialCode: '+350', code: 'GI' },
  { name: 'Greece', dialCode: '+30', code: 'GR' },
  { name: 'Greenland', dialCode: '+299', code: 'GL' },
  { name: 'Grenada', dialCode: '+1473', code: 'GD' },
  { name: 'Guadeloupe', dialCode: '+590', code: 'GP' },
  { name: 'Guam', dialCode: '+1671', code: 'GU' },
  { name: 'Guatemala', dialCode: '+502', code: 'GT' },
  { name: 'Guernsey', dialCode: '+44', code: 'GG' },
  { name: 'Guinea', dialCode: '+224', code: 'GN' },
  { name: 'Guinea-Bissau', dialCode: '+245', code: 'GW' },
  { name: 'Guyana', dialCode: '+592', code: 'GY' },
  { name: 'Haiti', dialCode: '+509', code: 'HT' },
  { name: 'Holy See', dialCode: '+379', code: 'VA' },
  { name: 'Honduras', dialCode: '+504', code: 'HN' },
  { name: 'Hong Kong', dialCode: '+852', code: 'HK' },
  { name: 'Hungary', dialCode: '+36', code: 'HU' },
  { name: 'Iceland', dialCode: '+354', code: 'IS' },
  { name: 'India', dialCode: '+91', code: 'IN' },
  { name: 'Indonesia', dialCode: '+62', code: 'ID' },
  { name: 'Iran', dialCode: '+98', code: 'IR' },
  { name: 'Iraq', dialCode: '+964', code: 'IQ' },
  { name: 'Ireland', dialCode: '+353', code: 'IE' },
  { name: 'Isle of Man', dialCode: '+44', code: 'IM' },
  { name: 'Israel', dialCode: '+972', code: 'IL' },
  { name: 'Italy', dialCode: '+39', code: 'IT' },
  { name: 'Jamaica', dialCode: '+1876', code: 'JM' },
  { name: 'Japan', dialCode: '+81', code: 'JP' },
  { name: 'Jersey', dialCode: '+44', code: 'JE' },
  { name: 'Jordan', dialCode: '+962', code: 'JO' },
  { name: 'Kazakhstan', dialCode: '+77', code: 'KZ' },
  { name: 'Kenya', dialCode: '+254', code: 'KE' },
  { name: 'Kiribati', dialCode: '+686', code: 'KI' },
  { name: "Korea (North)", dialCode: '+850', code: 'KP' },
  { name: "Korea (South)", dialCode: '+82', code: 'KR' },
  { name: 'Kuwait', dialCode: '+965', code: 'KW' },
  { name: 'Kyrgyzstan', dialCode: '+996', code: 'KG' },
  { name: 'Laos', dialCode: '+856', code: 'LA' },
  { name: 'Latvia', dialCode: '+371', code: 'LV' },
  { name: 'Lebanon', dialCode: '+961', code: 'LB' },
  { name: 'Lesotho', dialCode: '+266', code: 'LS' },
  { name: 'Liberia', dialCode: '+231', code: 'LR' },
  { name: 'Libya', dialCode: '+218', code: 'LY' },
  { name: 'Liechtenstein', dialCode: '+423', code: 'LI' },
  { name: 'Lithuania', dialCode: '+370', code: 'LT' },
  { name: 'Luxembourg', dialCode: '+352', code: 'LU' },
  { name: 'Macao', dialCode: '+853', code: 'MO' },
  { name: 'Macedonia', dialCode: '+389', code: 'MK' },
  { name: 'Madagascar', dialCode: '+261', code: 'MG' },
  { name: 'Malawi', dialCode: '+265', code: 'MW' },
  { name: 'Malaysia', dialCode: '+60', code: 'MY' },
  { name: 'Maldives', dialCode: '+960', code: 'MV' },
  { name: 'Mali', dialCode: '+223', code: 'ML' },
  { name: 'Malta', dialCode: '+356', code: 'MT' },
  { name: 'Marshall Islands', dialCode: '+692', code: 'MH' },
  { name: 'Martinique', dialCode: '+596', code: 'MQ' },
  { name: 'Mauritania', dialCode: '+222', code: 'MR' },
  { name: 'Mauritius', dialCode: '+230', code: 'MU' },
  { name: 'Mayotte', dialCode: '+262', code: 'YT' },
  { name: 'Mexico', dialCode: '+52', code: 'MX' },
  { name: 'Micronesia', dialCode: '+691', code: 'FM' },
  { name: 'Moldova', dialCode: '+373', code: 'MD' },
  { name: 'Monaco', dialCode: '+377', code: 'MC' },
  { name: 'Mongolia', dialCode: '+976', code: 'MN' },
  { name: 'Montenegro', dialCode: '+382', code: 'ME' },
  { name: 'Montserrat', dialCode: '+1664', code: 'MS' },
  { name: 'Morocco', dialCode: '+212', code: 'MA' },
  { name: 'Mozambique', dialCode: '+258', code: 'MZ' },
  { name: 'Myanmar', dialCode: '+95', code: 'MM' },
  { name: 'Namibia', dialCode: '+264', code: 'NA' },
  { name: 'Nauru', dialCode: '+674', code: 'NR' },
  { name: 'Nepal', dialCode: '+977', code: 'NP' },
  { name: 'Netherlands', dialCode: '+31', code: 'NL' },
  { name: 'Netherlands Antilles', dialCode: '+599', code: 'AN' },
  { name: 'New Caledonia', dialCode: '+687', code: 'NC' },
  { name: 'New Zealand', dialCode: '+64', code: 'NZ' },
  { name: 'Nicaragua', dialCode: '+505', code: 'NI' },
  { name: 'Niger', dialCode: '+227', code: 'NE' },
  { name: 'Nigeria', dialCode: '+234', code: 'NG' },
  { name: 'Niue', dialCode: '+683', code: 'NU' },
  { name: 'Norfolk Island', dialCode: '+672', code: 'NF' },
  { name: 'Northern Mariana Islands', dialCode: '+1670', code: 'MP' },
  { name: 'Norway', dialCode: '+47', code: 'NO' },
  { name: 'Oman', dialCode: '+968', code: 'OM' },
  { name: 'Pakistan', dialCode: '+92', code: 'PK' },
  { name: 'Palau', dialCode: '+680', code: 'PW' },
  { name: 'Palestine', dialCode: '+970', code: 'PS' },
  { name: 'Panama', dialCode: '+507', code: 'PA' },
  { name: 'Papua New Guinea', dialCode: '+675', code: 'PG' },
  { name: 'Paraguay', dialCode: '+595', code: 'PY' },
  { name: 'Peru', dialCode: '+51', code: 'PE' },
  { name: 'Philippines', dialCode: '+63', code: 'PH' },
  { name: 'Pitcairn', dialCode: '+872', code: 'PN' },
  { name: 'Poland', dialCode: '+48', code: 'PL' },
  { name: 'Portugal', dialCode: '+351', code: 'PT' },
  { name: 'Puerto Rico', dialCode: '+1939', code: 'PR' },
  { name: 'Qatar', dialCode: '+974', code: 'QA' },
  { name: 'Romania', dialCode: '+40', code: 'RO' },
  { name: 'Russia', dialCode: '+7', code: 'RU' },
  { name: 'Rwanda', dialCode: '+250', code: 'RW' },
  { name: 'Reunion', dialCode: '+262', code: 'RE' },
  { name: 'Saint Barthelemy', dialCode: '+590', code: 'BL' },
  { name: 'Saint Helena', dialCode: '+290', code: 'SH' },
  { name: 'Saint Kitts and Nevis', dialCode: '+1869', code: 'KN' },
  { name: 'Saint Lucia', dialCode: '+1758', code: 'LC' },
  { name: 'Saint Martin', dialCode: '+590', code: 'MF' },
  { name: 'Saint Pierre and Miquelon', dialCode: '+508', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', dialCode: '+1784', code: 'VC' },
  { name: 'Samoa', dialCode: '+685', code: 'WS' },
  { name: 'San Marino', dialCode: '+378', code: 'SM' },
  { name: 'Sao Tome and Principe', dialCode: '+239', code: 'ST' },
  { name: 'Saudi Arabia', dialCode: '+966', code: 'SA' },
  { name: 'Senegal', dialCode: '+221', code: 'SN' },
  { name: 'Serbia', dialCode: '+381', code: 'RS' },
  { name: 'Seychelles', dialCode: '+248', code: 'SC' },
  { name: 'Sierra Leone', dialCode: '+232', code: 'SL' },
  { name: 'Singapore', dialCode: '+65', code: 'SG' },
  { name: 'Slovakia', dialCode: '+421', code: 'SK' },
  { name: 'Slovenia', dialCode: '+386', code: 'SI' },
  { name: 'Solomon Islands', dialCode: '+677', code: 'SB' },
  { name: 'Somalia', dialCode: '+252', code: 'SO' },
  { name: 'South Africa', dialCode: '+27', code: 'ZA' },
  { name: 'South Sudan', dialCode: '+211', code: 'SS' },
  { name: 'Spain', dialCode: '+34', code: 'ES' },
  { name: 'Sri Lanka', dialCode: '+94', code: 'LK' },
  { name: 'Sudan', dialCode: '+249', code: 'SD' },
  { name: 'Suriname', dialCode: '+597', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', dialCode: '+47', code: 'SJ' },
  { name: 'Swaziland', dialCode: '+268', code: 'SZ' },
  { name: 'Sweden', dialCode: '+46', code: 'SE' },
  { name: 'Switzerland', dialCode: '+41', code: 'CH' },
  { name: 'Syria', dialCode: '+963', code: 'SY' },
  { name: 'Taiwan', dialCode: '+886', code: 'TW' },
  { name: 'Tajikistan', dialCode: '+992', code: 'TJ' },
  { name: 'Tanzania', dialCode: '+255', code: 'TZ' },
  { name: 'Thailand', dialCode: '+66', code: 'TH' },
  { name: 'Timor-Leste', dialCode: '+670', code: 'TL' },
  { name: 'Togo', dialCode: '+228', code: 'TG' },
  { name: 'Tokelau', dialCode: '+690', code: 'TK' },
  { name: 'Tonga', dialCode: '+676', code: 'TO' },
  { name: 'Trinidad and Tobago', dialCode: '+1868', code: 'TT' },
  { name: 'Tunisia', dialCode: '+216', code: 'TN' },
  { name: 'Turkey', dialCode: '+90', code: 'TR' },
  { name: 'Turkmenistan', dialCode: '+993', code: 'TM' },
  { name: 'Turks and Caicos Islands', dialCode: '+1649', code: 'TC' },
  { name: 'Tuvalu', dialCode: '+688', code: 'TV' },
  { name: 'Uganda', dialCode: '+256', code: 'UG' },
  { name: 'Ukraine', dialCode: '+380', code: 'UA' },
  { name: 'United Arab Emirates', dialCode: '+971', code: 'AE' },
  { name: 'United Kingdom', dialCode: '+44', code: 'GB' },
  { name: 'United States', dialCode: '+1', code: 'US' },
  { name: 'Uruguay', dialCode: '+598', code: 'UY' },
  { name: 'Uzbekistan', dialCode: '+998', code: 'UZ' },
  { name: 'Vanuatu', dialCode: '+678', code: 'VU' },
  { name: 'Venezuela', dialCode: '+58', code: 'VE' },
  { name: 'Vietnam', dialCode: '+84', code: 'VN' },
  { name: 'Virgin Islands (British)', dialCode: '+1284', code: 'VG' },
  { name: 'Virgin Islands (U.S.)', dialCode: '+1340', code: 'VI' },
  { name: 'Wallis and Futuna', dialCode: '+681', code: 'WF' },
  { name: 'Yemen', dialCode: '+967', code: 'YE' },
  { name: 'Zambia', dialCode: '+260', code: 'ZM' },
  { name: 'Zimbabwe', dialCode: '+263', code: 'ZW' }
] as const;

const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const SnapchatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="-7 0 32 32" fill="currentColor" {...props}>
    <path d="M17.52 20.2c-2.72-1.48-3.36-2.96-3.52-3.6l1.88-.92c.36-.2.52-.64.36-1-.2-.36-.64-.52-1-.36l-1.24.6v-3.32c0-2.32-2.24-4.2-5-4.2s-5.08 1.92-5.08 4.24v3.32l-1.24-.6c-.36-.2-.84-.04-1 .36-.2.36-.04.84.36 1l1.88.92c-.16.68-.8 2.12-3.48 3.6-.28.16-.44.48-.36.8s.32.56.64.6c.68.08 2.6.56 2.76 1.64.04.24.16.44.4.56.2.12.48.12.68 0 1-.48 1.56-.24 2.36.16.6.28 1.24.6 2.08.6s1.52-.32 2.08-.6c.84-.4 1.36-.64 2.36-.16.2.12.48.12.68 0s.36-.32.4-.56c.16-1.08 2.08-1.56 2.76-1.64.32-.04.6-.28.64-.6.04-.36-.12-.68-.4-.84zM13.28 22.2c-1.24-.32-2.12.08-2.88.44-.52.24-.92.44-1.44.44s-.96-.2-1.44-.44c-.56-.28-1.2-.56-2-.56-.28 0-.56.04-.88.12-.44-.8-1.24-1.28-2-1.6 2.84-2.08 2.88-4.04 2.84-4.44v-4.52c0-1.48 1.56-2.72 3.52-2.72s3.52 1.2 3.52 2.72v4.48c-.04.44 0 2.4 2.84 4.44-.84.32-1.64.84-2.08 1.64z" />
  </svg>
);

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
    countryCode: '+966',
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
    if (!formData.countryCode.trim()) newErrors.countryCode = 'رمز الدولة مطلوب';
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
        whatsapp: `${formData.countryCode}${formData.whatsapp}`,
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
          countryCode: '+966',
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
                  alt="TikTok Logo"
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
                  <div className="w-32 md:w-40">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange('countryCode', e.target.value)}
                      className={`form-input text-white ${errors.countryCode ? 'border-red-400' : ''}`}
                      dir="ltr"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.dialCode} className="text-black">
                          {country.name} ({country.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className={`form-input flex-1 ${errors.whatsapp ? 'border-red-400' : ''}`}
                    placeholder="5xxxxxxxx"
                    dir="ltr"
                  />
                </div>
                <p className="mt-2 text-xs text-sky-200">
                  سيتم إرسال رمز التحقق عبر الواتساب
                </p>
                {errors.countryCode && <p className="form-error">{errors.countryCode}</p>}
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
                      <TikTokIcon className="w-4 h-4" />
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
                      <SnapchatIcon className="w-4 h-4" />
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
