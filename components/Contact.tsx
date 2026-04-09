"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SERVICE_ID = "service_8e42l4x";
const TEMPLATE_ID = "template_z3kzpvs";
const PUBLIC_KEY = "iIh2-Vd6UoSmItl3-";
const RECEIVER_EMAIL = "ashrafulislamashik960@gmail.com";

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const openMailtoFallback = (data: ContactFormData) => {
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    );

    window.location.href = `mailto:${RECEIVER_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        PUBLIC_KEY,
      );

      console.log("EmailJS success:", response);

      setIsSuccess(true);
      reset();

      toast.success("Message sent successfully", {
        description: "Thank you for reaching out. I will get back to you soon.",
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("EmailJS failed, switching to mailto fallback:", error);

      toast.error("Direct send failed", {
        description:
          "Opening your email app now so the message can still be sent manually.",
      });

      setTimeout(() => {
        openMailtoFallback(data);
      }, 700);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-[280px] w-[280px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Let’s Connect
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Contact Me
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            Have a project, collaboration idea, or just want to connect? Send me
            a message and I will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
          >
            <h3 className="text-2xl font-semibold text-white">
              Contact Information
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              I am open to DevOps, cloud, and software engineering
              opportunities, as well as collaboration on impactful technical
              projects.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="mt-1 text-white">
                    ashrafulislamashik960@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Phone</p>
                  <p className="mt-1 text-white">+880 1735407128</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Location</p>
                  <p className="mt-1 text-white">Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="relative">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl border border-emerald-400/20 bg-black/70 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ scale: 0.5, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 14,
                      }}
                      className="mb-4"
                    >
                      <CheckCircle2 className="h-20 w-20 text-emerald-400" />
                    </motion.div>
                    <p className="text-lg font-semibold text-white">
                      Message Sent Successfully
                    </p>
                    <p className="mt-2 text-sm text-white/65">
                      Thank you for reaching out.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.06]"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.06]"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.06]"
                    placeholder="Enter message subject"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    {...register("message", {
                      required: "Message is required",
                    })}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.06]"
                    placeholder="Write your message..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
