"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
  Sparkles,
  ArrowUpRight,
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

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: 6 + (i % 4) * 6,
        left: `${6 + i * 6.5}%`,
        duration: 8 + (i % 5),
        delay: i * 0.45,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/15 blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            bottom: "-30px",
          }}
          animate={{
            y: [-10, -260],
            x: [0, particle.id % 2 === 0 ? 18 : -18, 0],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.15, 0.7],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0px 0px", "42px 42px"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(16,185,129,0.16), transparent 55%)",
          backgroundSize: "500px 500px",
        }}
      />
    </div>
  );
}

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const smoothX = useSpring(glowX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(glowY, { stiffness: 120, damping: 20 });

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
      await emailjs.send(
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <AnimatedGrid />
      <FloatingParticles />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-[8%] top-[10%] h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[14%] h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{
            y: [0, 22, 0],
            x: [0, -16, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[8%] left-[22%] h-40 w-40 rounded-full bg-violet-500/20 blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 18, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Let’s Build Something Great
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Contact Me
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            Have a project, collaboration idea, or an opportunity? Reach out and
            let’s create something impactful together.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />
            <motion.div
              className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 25, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl"
              animate={{ scale: [1, 1.12, 1], rotate: [0, -25, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Contact Information
                  </h3>
                  <p className="text-sm text-white/55">
                    Available for collaboration
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-white/65 sm:text-base">
                I am open to DevOps, cloud, and software engineering
                opportunities, along with meaningful technical collaborations
                and product-focused work.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "ashrafulislamashik960@gmail.com",
                    color:
                      "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+880 1735407128",
                    color:
                      "bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "Bangladesh",
                    color:
                      "bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white/50">{item.label}</p>
                          <p className="mt-1 break-words text-white">
                            {item.value}
                          </p>
                        </div>

                        <ArrowUpRight className="mt-1 h-4 w-4 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
            onMouseMove={handleMouseMove}
          >
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
              <motion.div
                className="pointer-events-none absolute h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl"
                style={{
                  left: smoothX,
                  top: smoothY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent" />

              <motion.div
                className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl"
                animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -left-20 bottom-10 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl"
                animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      Send a Message
                    </h3>
                    <p className="text-sm text-white/55">
                      Fast, simple, and professional
                    </p>
                  </div>
                </div>

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
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                          Your Name
                        </label>
                        <input
                          type="text"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
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
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
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
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
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
                        className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                        placeholder="Write your message..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.015, y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 font-medium text-white shadow-[0_10px_30px_rgba(16,185,129,0.28)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
