
import { useState } from 'react';
import axios from 'axios';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      
      const url = 'http://localhost:5000/api/create'; 
      await axios.post(url, formData, { headers: { 'Content-Type': 'application/json' } });

      setSuccessMsg('Message sent. Thank you!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      let serverMsg = '';
      if (axios.isAxiosError(err)) {
        serverMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message;
      }
      setErrorMsg(serverMsg || 'Failed to send message. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in touch</h2>
          <p className="mb-2">📍 Kigali, Rwanda</p>
          <p className="mb-2">📞 +250 787 065 734</p>
          <p className="mb-6">✉️ jenn6@.com</p>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.664!2d30.0587!3d-1.9441!2m3!1f0!2f0!3f0!"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            className="rounded-lg shadow"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          {successMsg && <div className="bg-green-100 p-2 rounded text-green-800">{successMsg}</div>}
          {errorMsg && <div className="bg-red-100 p-2 rounded text-red-800">{errorMsg}</div>}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
