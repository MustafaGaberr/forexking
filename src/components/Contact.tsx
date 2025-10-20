import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import axios from 'axios';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t('contact.validation.required'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('contact.validation.email'));
      return;
    }
    setIsSubmitting(true);
    try {
      const body = { name, email, message };
      const response = await axios.post('https://forex-orcin.vercel.app/contact', body);
      if (response.status === 200) {
        toast.success(t('contact.success'));
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      toast.error(t('contact.error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-4 bg-background text-foreground">
      {/* Section Heading */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight">{t('contact.title')}</h2>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Form + Info stacked */}
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-10">
        {/* Form Section */}
        <Card className="w-full rounded-2xl shadow-lg border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('contact.getInTouch')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('contact.formDescription')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('contact.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('contact.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('contact.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t('contact.message')}</Label>
                <Textarea
                  id="message"
                  placeholder={t('contact.messagePlaceholder')}
                  className="min-h-[120px] bg-background border-border"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-center">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('contact.sending') : t('contact.submit')}
              </Button>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {t('contact.responseTime')}
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Contact Info */}
        <Card className="w-full bg-card border border-border rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center gap-5 md:gap-6 p-6 text-foreground">
            {/* Line 1: Email */}
            <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:contact@forexking.info" className="hover:text-primary">contact@forexking.info</a>
            </div>

            {/* Line 2: Phone | WhatsApp */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+15075288062" className="hover:text-primary" dir="ltr">+1 507 528 8062</a>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                {/* WhatsApp Icon (brand) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true" focusable="false" fill="currentColor">
                  <path d="M20.52 3.48A11.91 11.91 0 0 0 12 0C5.39 0 .02 5.37.02 12c0 2.11.55 4.18 1.6 6.01L0 24l6.14-1.6A12 12 0 0 0 12 24c6.61 0 12-5.39 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22.06c-1.84 0-3.64-.49-5.22-1.41l-.37-.22-3.65.95.98-3.56-.24-.37A9.97 9.97 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.97 9.97 0 0 1 22 12c0 5.52-4.48 10.06-10 10.06Zm5.73-7.56c-.32-.16-1.87-.92-2.16-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.02-1.01 1.23-.19.21-.37.24-.69.08-.32-.16-1.33-.49-2.54-1.57-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.5.14-.66.14-.14.32-.37.47-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.63-.53-.54-.72-.54-.19 0-.4-.03-.61-.03-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.56 1.15 3.06 1.31 3.27.16.21 2.26 3.45 5.46 4.83.76.33 1.35.53 1.81.68.76.24 1.46.21 2.01.13.61-.09 1.87-.76 2.14-1.49.26-.74.26-1.37.18-1.49-.08-.11-.29-.18-.61-.34Z" />
                </svg>
                <a href="https://wa.me/+4367846433933" target="_blank" rel="noopener noreferrer" className="hover:text-primary" dir="ltr">+43 678 464 33933</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
