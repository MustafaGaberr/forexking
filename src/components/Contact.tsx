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

const Contact = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const body = { name, email, message };
      const response = await axios.post('https://forex-orcin.vercel.app/contact', body);
      if (response.status === 200) {
        toast.success('Message sent successfully 🎉');
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-4 bg-background text-foreground">
      {/* Section Heading */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight">Contact Us</h2>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          Questions, feedback, or just want to say hello? We’d love to hear from you.
        </p>
      </div>

      {/* Form + Info stacked */}
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-10">
        {/* Form Section */}
        <Card className="w-full rounded-2xl shadow-lg border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Get in Touch</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the form and we’ll get back to you shortly.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message..."
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
                {isSubmitting ? 'Sending...' : 'Submit'}
              </Button>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                We typically respond within 24 hours. Your message is safe with us.
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Contact Info */}
        <Card className="w-full bg-card border border-border rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center gap-6 p-6 text-foreground">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:contact@forexking.info" className="hover:text-accent">
                contact@forexking.info
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:+436789070335578" className="hover:text-accent">
                (43) 678-9070-335578
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
