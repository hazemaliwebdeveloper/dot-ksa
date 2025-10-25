import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FormSubmission {
  id?: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  whatsapp_verified?: boolean;
  email: string;
  brand_name: string;
  representative_type: 'doctor' | 'clinic' | 'medical_center' | 'other';
  medical_specialty?: string;
  brand_field?: string;
  city: string;
  country: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  message_to_management?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const submitForm = async (data: FormSubmission) => {
  const { data: result, error } = await supabase
    .from('submissions')
    .insert([data])
    .select()
    .maybeSingle();

  if (error) throw error;
  return result;
};
