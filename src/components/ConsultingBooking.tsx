/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Booking } from "../types";
import { Calendar, Clock, User, Mail, Phone, RefreshCw, FileText, CheckCircle, ClipboardCheck } from "lucide-react";

interface ConsultingBookingProps {
  currentStyleProfile?: string;
  userName?: string;
  userEmail?: string;
}

const CONSTANT_SERVICES = [
  "Ambientação Geral de Ambientes 🏡",
  "Consultoria Personalizada de Iluminação 💡",
  "Projeto para Cozinhas Executivas 🍳",
  "Retrofit e Revestimento de Banheiros 🚿",
  "Curadoria de Peças e Mobiliário 🏷️"
];

const TIME_SLOTS = [
  "09:30", "11:00", "14:00", "15:30", "17:00"
];

export default function ConsultingBooking({ currentStyleProfile, userName = "", userEmail = "" }: ConsultingBookingProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formName, setFormName] = useState(userName);
  const [formEmail, setFormEmail] = useState(userEmail);
  const [formPhone, setFormPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formService, setFormService] = useState(CONSTANT_SERVICES[0]);
  const [formNotes, setFormNotes] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Sync with quiz results
  useEffect(() => {
    if (userName) setFormName(userName);
    if (userEmail) setFormEmail(userEmail);
  }, [userName, userEmail]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const resp = await fetch("/api/bookings");
      if (resp.ok) {
        const data = await resp.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formDate || !formTime) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    
    const payload = {
      userName: formName,
      userEmail: formEmail,
      phone: formPhone,
      date: formDate,
      time: formTime,
      serviceType: formService,
      styleProfile: currentStyleProfile || "Japandi",
      notes: formNotes
    };

    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        setFormPhone("");
        setFormDate("");
        setFormTime("");
        setFormNotes("");
        fetchBookings();
        alert("Agendamento pré-reservado com sucesso! A equipe UPLar enviará confirmação via e-mail.");
      } else {
        throw new Error("Erro do servidor ao agendar");
      }
    } catch (err) {
      console.error(err);
      
      // Local fallback simulator setup
      const localFallback: Booking = {
        id: `bkg-${Math.random().toString(36).substring(2, 9)}`,
        status: "Pendente",
        ...payload
      };
      setBookings((prev) => [localFallback, ...prev]);
      setFormPhone("");
      setFormDate("");
      setFormTime("");
      setFormNotes("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="uPlar-booking-board" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Consulting Form */}
      <div className="bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-white shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2C2C2C]/10">
          <Calendar className="text-[#C68B77] w-5 h-5 animate-pulse" />
          <h3 className="text-base font-serif font-semibold text-[#2C2C2C] tracking-tight">
            Solicitar Agenda de Consultoria
          </h3>
        </div>

        <p className="text-xs text-[#525B56] leading-relaxed mb-6 font-sans">
          Nossa equipe arquiteta e parceiros credenciados agendam chamadas dedicadas de 45 minutos em vídeoconferência para alinhar as escolhas de revestimentos, compatibilizando seu estilo e orçamento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                Seu Nome *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#5B6347]/40">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  id="booking-name-input"
                  type="text"
                  required
                  placeholder="Seu Nome"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                E-mail *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#5B6347]/40">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  id="booking-email-input"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                Telefone/WhatsApp
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#5B6347]/40">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  id="booking-phone-input"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                Serviço Focado *
              </label>
              <select
                id="booking-service-select"
                value={formService}
                onChange={(e) => setFormService(e.target.value)}
                className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] appearance-none cursor-pointer"
              >
                {CONSTANT_SERVICES.map((serv, index) => (
                  <option key={index} value={serv}>
                    {serv}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                Data Consultoria *
              </label>
              <input
                id="booking-date-input"
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
                Horário Disponível *
              </label>
              <div className="grid grid-cols-5 gap-1">
                {TIME_SLOTS.map((time) => (
                  <button
                    id={`time-slot-${time}`}
                    key={time}
                    type="button"
                    onClick={() => setFormTime(time)}
                    className={`py-2 text-[10px] font-mono rounded-xl border transition-all cursor-pointer ${
                      formTime === time
                        ? "bg-[#5B6347] border-[#5B6347] text-white font-bold"
                        : "bg-white/60 border-[#2C2C2C]/10 text-[#2C2C2C]/80 hover:border-[#C68B77]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-[#5B6347] uppercase tracking-wider mb-2 font-bold">
              Orientações ou Detalhes do Imóvel
            </label>
            <textarea
              id="booking-notes-input"
              rows={2}
              placeholder="Ex: Gostaria de reformular o backsplash da pia usando a cerâmica terracota..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
            ></textarea>
          </div>

          {currentStyleProfile && (
            <div className="text-[10px] font-mono text-[#C68B77] bg-[#D1CCC2]/20 p-3 rounded-2xl border border-[#2C2C2C]/5 flex items-center gap-2 font-bold">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Sincronizando agendamento com o estilo calculado: {currentStyleProfile}</span>
            </div>
          )}

          <button
            id="btn-submit-booking"
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C68B77] hover:bg-[#B77D69] text-white font-semibold py-3.5 text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {submitting ? "Pré-reservando..." : "Solicitar Agendamento"}
          </button>
        </form>
      </div>

      {/* Right - Live Consultancies list */}
      <div className="bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-white shadow-sm flex flex-col justify-start space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2C2C2C]/10">
          <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] tracking-widest font-bold">
            📅 Solicitações de Consultoria Ativas
          </h4>
          <button
            id="btn-refresh-bookings"
            onClick={fetchBookings}
            disabled={loadingBookings}
            className="text-[10px] font-mono text-[#5B6347] flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider hover:text-[#C68B77] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loadingBookings ? "animate-spin" : ""}`} /> Atualizar
          </button>
        </div>

        {loadingBookings ? (
          <div className="text-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-[#C68B77] mx-auto mb-2" />
            <p className="text-xs text-[#5B6347]">Buscando agendamentos...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/40 p-12 text-center rounded-3xl border border-dashed border-[#2C2C2C]/20 shadow-sm">
            <FileText className="w-8 h-8 text-[#C68B77]/60 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#2C2C2C]/80 uppercase tracking-widest leading-loose">Ainda não há solicitações registradas.</p>
            <p className="text-xs text-[#515C56]">Preencha o formulário ao lado para iniciar seu projeto.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div
                id={`booking-card-${b.id}`}
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-[#2C2C2C]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-1.5 text-xs text-[#2C2C2C]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{b.serviceType.replace(/[🏡💡🍳🚿🏷️]/g, "")}</span>
                    <span className="bg-[#D1CCC2]/45 text-[#5B6347] font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      {b.styleProfile}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-sans text-[#2C2C2C]/70">
                    <p className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#C68B77]/80" /> {b.userName}
                    </p>
                    <p className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#5B6347]/85" /> {b.date}
                    </p>
                    <p className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#C68B77]/80" /> {b.userEmail}
                    </p>
                    <p className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#5B6347]/85" /> {b.time}
                    </p>
                  </div>
                  {b.notes && (
                    <p className="text-xs text-[#2C2C2C]/60 italic pt-2 border-t border-[#2C2C2C]/5 font-sans">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <span className="bg-[#5B6347]/10 text-[#5B6347] border border-[#5B6347]/20 rounded-full px-3 py-1 text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase">
                    <CheckCircle className="w-3 h-3" />
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
