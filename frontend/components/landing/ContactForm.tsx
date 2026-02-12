'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/.test(value)) return 'Please enter a valid phone number';
        return undefined;
      
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must be less than 1000 characters';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormData];
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        hasErrors = true;
      }
    });

    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    setTouched({});
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@roofmanager.com' },
    { icon: Phone, label: 'Phone', value: '+233 30 000 0000' },
    { icon: MapPin, label: 'Location', value: 'Accra, Ghana' },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(0, 158, 73, 0.1), transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(239, 43, 45, 0.05), transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghana-green/10 border border-ghana-green/20 text-ghana-green text-sm font-medium mb-6">
              <Send className="w-4 h-4" />
              Get In Touch
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Let us discuss your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-green to-teal-400">
                roofing needs
              </span>
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Have questions about our platform? Our team is here to help you find the right 
              solution for your business.
            </p>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-ghana-green/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-ghana-green" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">{item.label}</div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              {submitStatus === 'success' ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-ghana-green/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-ghana-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 mb-6">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="px-6 py-3 rounded-xl font-medium text-white bg-ghana-green/20 border border-ghana-green/30 hover:bg-ghana-green/30 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300">
                        Full Name <span className="text-ghana-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border transition-all ${
                            touched.name && errors.name
                              ? 'border-ghana-red focus:border-ghana-red focus:ring-2 focus:ring-ghana-red/20'
                              : 'border-slate-700/50 focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20'
                          } text-white placeholder:text-slate-500 focus:outline-none`}
                          aria-invalid={Boolean(touched.name && errors.name)}
                          aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                        />
                        {touched.name && errors.name && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ghana-red" />
                        )}
                      </div>
                      {touched.name && errors.name && (
                        <p id="name-error" className="text-sm text-ghana-red flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300">
                        Email Address <span className="text-ghana-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="john@company.com"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border transition-all ${
                            touched.email && errors.email
                              ? 'border-ghana-red focus:border-ghana-red focus:ring-2 focus:ring-ghana-red/20'
                              : 'border-slate-700/50 focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20'
                          } text-white placeholder:text-slate-500 focus:outline-none`}
                          aria-invalid={Boolean(touched.email && errors.email)}
                          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                        />
                        {touched.email && errors.email && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ghana-red" />
                        )}
                      </div>
                      {touched.email && errors.email && (
                        <p id="email-error" className="text-sm text-ghana-red flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-300">
                        Phone Number <span className="text-ghana-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+233 50 000 0000"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border transition-all ${
                            touched.phone && errors.phone
                              ? 'border-ghana-red focus:border-ghana-red focus:ring-2 focus:ring-ghana-red/20'
                              : 'border-slate-700/50 focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20'
                          } text-white placeholder:text-slate-500 focus:outline-none`}
                          aria-invalid={Boolean(touched.phone && errors.phone)}
                          aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                        />
                        {touched.phone && errors.phone && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ghana-red" />
                        )}
                      </div>
                      {touched.phone && errors.phone && (
                        <p id="phone-error" className="text-sm text-ghana-red flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Company Field */}
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-slate-300">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Ltd."
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20 text-white placeholder:text-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">
                      Message <span className="text-ghana-red">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={5}
                        placeholder="Tell us about your roofing management needs..."
                        className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border transition-all resize-none ${
                          touched.message && errors.message
                            ? 'border-ghana-red focus:border-ghana-red focus:ring-2 focus:ring-ghana-red/20'
                            : 'border-slate-700/50 focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20'
                        } text-white placeholder:text-slate-500 focus:outline-none`}
                        aria-invalid={Boolean(touched.message && errors.message)}
                        aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                      />
                      {touched.message && errors.message && (
                        <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-ghana-red" />
                      )}
                    </div>
                    {touched.message && errors.message ? (
                      <p id="message-error" className="text-sm text-ghana-red flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 text-right">
                        {formData.message.length}/1000 characters
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-ghana-green to-ghana-green/80 hover:from-ghana-green/90 hover:to-ghana-green/70 transition-all hover:scale-[1.02] shadow-lg shadow-ghana-green/25 focus:outline-none focus:ring-2 focus:ring-ghana-green/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
