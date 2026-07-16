"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { addContact } from "@/lib/firestoreActions";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formElement = event.currentTarget; // Save reference before await
  setLoading(true);

  const form = new FormData(formElement);

  try {
    await addContact({
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message")
    });

    formElement.reset(); // Use saved reference here
    toast.success("Message sent to RailVision.");
  } catch (error) {
    console.error("Contact form error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Could not send message. Please try again."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <>
      <section className="subhero">
        <span className="eyebrow">Contact RailVision</span>
        <h1>Talk to us about railway AI, STEM kits, partnerships, or demos.</h1>
        <p>Contact submissions are saved to Firestore for the RailVision team.</p>
      </section>

      <section className="section contact-layout">
        <form className="panel form-grid" onSubmit={submit}>
          <label>
            Name
            <input required name="name" placeholder="Your name" />
          </label>
          <label>
            Email
            <input required type="email" name="email" placeholder="you@example.com" />
          </label>
          <label className="full">
            Subject
            <input required name="subject" placeholder="How can we help?" />
          </label>
          <label className="full">
            Message
            <textarea required name="message" placeholder="Write your message" />
          </label>
          <button className="button primary full" disabled={loading}>
            <Send size={18} /> {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <aside className="contact-card">
          <div>
            <Mail size={20} />
            <span>parthshrivastavai09@gmail.com</span>
          </div>
          <div>
            <Phone size={20} />
            <span>+91 9310374505</span>
          </div>
          <div>
            <MapPin size={20} />
            <span>India | Global railway innovation</span>
          </div>
          <div className="social-links">
            <a
              href="https://x.com/railvisionpro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </a>

            <a
              href="https://instagram.com/railvisionpro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </a>
          </div>
                    
        </aside>
      </section>
    </>
  );
}
