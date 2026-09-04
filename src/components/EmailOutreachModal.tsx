import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  ShieldCheck, 
  Layers, 
  FileText, 
  ExternalLink, 
  AlertCircle, 
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  Settings2,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';
import { House } from '../types';
import { 
  DIPLOMATIC_TEMPLATES, 
  EmailTemplate, 
  createEmailBatches, 
  EmailBatch, 
  downloadEmlFile, 
  downloadVCardBook, 
  downloadEmailCsv 
} from '../utils/emailDispatcher';

interface EmailOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredHouses: House[];
  allHouses: House[];
  preselectedHouse?: House | null;
}

export const EmailOutreachModal: React.FC<EmailOutreachModalProps> = ({
  isOpen,
  onClose,
  filteredHouses,
  allHouses,
  preselectedHouse = null
}) => {
  if (!isOpen) return null;

  // Active tab state
  const [activeTab, setActiveTab] = useState<'dispatcher' | 'templates' | 'evidence' | 'export'>('dispatcher');

  // Scope: 'filtered' or 'all' or 'single'
  const [scope, setScope] = useState<'filtered' | 'all' | 'single'>(
    preselectedHouse ? 'single' : filteredHouses.length < allHouses.length ? 'filtered' : 'all'
  );

  // Selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('acta-concordiae');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');

  // Batching & Dispatch settings
  const [batchSize, setBatchSize] = useState<number>(25);
  const [delaySeconds, setDelaySeconds] = useState<number>(15);
  const [isAutoTimerRunning, setIsAutoTimerRunning] = useState<boolean>(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [dispatchedBatchIndices, setDispatchedBatchIndices] = useState<Set<number>>(new Set());

  // Copy state feedbacks
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);
  const [copiedAllEmails, setCopiedAllEmails] = useState<boolean>(false);

  // True evidence search query
  const [evidenceSearch, setEvidenceSearch] = useState<string>('');

  // Initialize custom fields from selected template
  const currentTemplate = useMemo(() => {
    return DIPLOMATIC_TEMPLATES.find((t) => t.id === selectedTemplateId) || DIPLOMATIC_TEMPLATES[0];
  }, [selectedTemplateId]);

  useEffect(() => {
    if (selectedTemplateId !== 'custom') {
      setCustomSubject(currentTemplate.subject);
      setCustomBody(currentTemplate.body);
    }
  }, [currentTemplate, selectedTemplateId]);

  // Determine active house list based on selected scope
  const targetHouses = useMemo(() => {
    if (scope === 'single' && preselectedHouse) {
      return [preselectedHouse];
    }
    if (scope === 'filtered') {
      return filteredHouses.filter((h) => h.email && h.email.trim().includes('@'));
    }
    return allHouses.filter((h) => h.email && h.email.trim().includes('@'));
  }, [scope, preselectedHouse, filteredHouses, allHouses]);

  // Compute batches
  const batches = useMemo(() => {
    return createEmailBatches(targetHouses, batchSize, customSubject, customBody);
  }, [targetHouses, batchSize, customSubject, customBody]);

  // Timer reference for automated delayed dispatch
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset dispatcher progress when scope or batch size changes
  useEffect(() => {
    setIsAutoTimerRunning(false);
    setCurrentBatchIndex(0);
    setSecondsRemaining(delaySeconds);
    setDispatchedBatchIndices(new Set());
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [scope, batchSize, delaySeconds]);

  // Automated Dispatch Engine
  useEffect(() => {
    if (!isAutoTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (currentBatchIndex >= batches.length) {
      setIsAutoTimerRunning(false);
      return;
    }

    // Tick countdown
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Trigger dispatch for the current batch
          dispatchBatch(currentBatchIndex);
          
          const nextIndex = currentBatchIndex + 1;
          if (nextIndex < batches.length) {
            setCurrentBatchIndex(nextIndex);
            return delaySeconds;
          } else {
            setIsAutoTimerRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoTimerRunning, currentBatchIndex, batches, delaySeconds]);

  // Dispatch a specific batch
  const dispatchBatch = (index: number) => {
    if (index >= batches.length) return;
    const batch = batches[index];
    
    // Mark as dispatched
    setDispatchedBatchIndices((prev) => new Set([...prev, index]));

    // Open mailto in browser to trigger system mail client
    window.location.href = batch.mailtoUrl;
  };

  const handleStartAutoDispatch = () => {
    // If starting fresh or at the first batch, immediately open first batch then start timer for second
    if (currentBatchIndex === 0 && !dispatchedBatchIndices.has(0)) {
      dispatchBatch(0);
      if (batches.length > 1) {
        setCurrentBatchIndex(1);
        setSecondsRemaining(delaySeconds);
        setIsAutoTimerRunning(true);
      }
    } else {
      setIsAutoTimerRunning(true);
    }
  };

  const handlePauseAutoDispatch = () => {
    setIsAutoTimerRunning(false);
  };

  const handleNextBatchImmediate = () => {
    if (currentBatchIndex < batches.length) {
      dispatchBatch(currentBatchIndex);
      const next = currentBatchIndex + 1;
      setCurrentBatchIndex(next);
      setSecondsRemaining(delaySeconds);
    }
  };

  const handleResetDispatcher = () => {
    setIsAutoTimerRunning(false);
    setCurrentBatchIndex(0);
    setSecondsRemaining(delaySeconds);
    setDispatchedBatchIndices(new Set());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCopyBatchEmails = (emails: string[], batchIdx: number) => {
    navigator.clipboard.writeText(emails.join('; '));
    setCopiedBatchIndex(batchIdx);
    setTimeout(() => setCopiedBatchIndex(null), 2000);
  };

  const handleCopyAllEmails = () => {
    const allEmailsStr = targetHouses.map((h) => h.email).filter(Boolean).join('; ');
    navigator.clipboard.writeText(allEmailsStr);
    setCopiedAllEmails(true);
    setTimeout(() => setCopiedAllEmails(false), 2000);
  };

  // Filtered houses for True Evidence verification tab
  const evidenceHouses = useMemo(() => {
    const q = evidenceSearch.toLowerCase().trim();
    if (!q) return targetHouses;
    return targetHouses.filter((h) => 
      h.name.toLowerCase().includes(q) ||
      h.email?.toLowerCase().includes(q) ||
      h.institution.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      h.seat.toLowerCase().includes(q)
    );
  }, [targetHouses, evidenceSearch]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#FAF8F3] border border-[#D5C7B2] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold & Burgundy Header Banner */}
        <div className="bg-[#1A1215] text-[#FAF6EE] p-4 sm:p-6 border-b border-[#3D282E] relative shrink-0">
          {/* Gold hairline accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

          <button
            id="email-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#D4C8B8] hover:text-white hover:bg-[#342025] transition-colors"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#351C22] text-[#E5C170] border border-[#C5A059]/40">
              <Mail className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>Diplomatischer E-Mail-Dispatcher</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#291F22] text-[#34D399]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>True Evidence • 100% Verifizierte Schloss- & Hausarchive</span>
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#291F22] text-[#CBBFA6]">
              {targetHouses.length} Empfänger geladen
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE] tracking-tight">
            Zeitverzögerter Rundschreiben- & Kontakt-Dispatcher
          </h2>
          <p className="text-xs sm:text-sm text-[#C2B5A3] mt-1 max-w-3xl leading-relaxed">
            Automatisches, zeitverzögertes Kontaktieren europäischer Adelshäuser. Umgeht Provider-BCC-Limits 
            und URL-Beschränkungen standardmäßiger E-Mail-Programme durch intelligente Batch-Aufteilung.
          </p>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#EDE5D8] border-b border-[#D8CABE] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              id="tab-dispatcher-btn"
              onClick={() => setActiveTab('dispatcher')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dispatcher'
                  ? 'bg-[#1A1215] text-[#FAF6EE] shadow-xs'
                  : 'text-[#58483B] hover:text-[#1A1215] hover:bg-white/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>1. Zeitverzögerter Versand ({batches.length} Batches)</span>
            </button>

            <button
              id="tab-templates-btn"
              onClick={() => setActiveTab('templates')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-[#1A1215] text-[#FAF6EE] shadow-xs'
                  : 'text-[#58483B] hover:text-[#1A1215] hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#E5C170]" />
              <span>2. Vorlage & Anschreiben</span>
            </button>

            <button
              id="tab-evidence-btn"
              onClick={() => setActiveTab('evidence')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'evidence'
                  ? 'bg-[#1A1215] text-[#FAF6EE] shadow-xs'
                  : 'text-[#58483B] hover:text-[#1A1215] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. True Evidence Nachweis ({targetHouses.length})</span>
            </button>

            <button
              id="tab-export-btn"
              onClick={() => setActiveTab('export')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'export'
                  ? 'bg-[#1A1215] text-[#FAF6EE] shadow-xs'
                  : 'text-[#58483B] hover:text-[#1A1215] hover:bg-white/60'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-[#8B1E2F]" />
              <span>4. EML & CRM Export</span>
            </button>
          </div>

          {/* Scope Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-white/80 border border-[#D5C6B2] px-2.5 py-1 rounded-md">
            <span className="text-[#7A6B5C] font-medium hidden sm:inline">Empfängerkreis:</span>
            <select
              id="email-scope-select"
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-[#1A1215] focus:outline-none cursor-pointer"
            >
              {preselectedHouse && (
                <option value="single">Nur dieses Haus ({preselectedHouse.name})</option>
              )}
              <option value="filtered">
                Aktuelle Filterauswahl ({filteredHouses.length} Häuser)
              </option>
              <option value="all">
                Gesamtes Archiv ({allHouses.length} Häuser)
              </option>
            </select>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: BATCH DISPATCHER & DELAYED SEQUENTIAL ENGINE */}
          {activeTab === 'dispatcher' && (
            <div className="space-y-5">
              {/* Educational Explanation Box */}
              <div className="p-3.5 bg-[#F4EFE6] border border-[#E0D5C3] rounded-xl flex items-start gap-3 text-xs text-[#4F4134] leading-relaxed">
                <Info className="w-4 h-4 text-[#8B1E2F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1A1215]">Warum zeitverzögerter Bündel-Versand?</strong> 
                  {' '}Standard-Mailprogramme (Thunderbird, Outlook, Apple Mail, Gmail) und Mailto-Links unterstützen maximal 50 bis 100 Empfänger pro E-Mail und begrenzen Links auf ca. 2.000 Zeichen.
                  Unser intelligenter Dispatcher teilt Ihre {targetHouses.length} Adressen in geschützte Bündel auf und öffnet diese mit zeitlichem Puffer in Ihrem Mail-Client, sodass keine Mail blockiert wird.
                </div>
              </div>

              {/* Dispatch Configuration Bar */}
              <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Batch Size Selection */}
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8B1E2F]" />
                    <span className="text-xs font-semibold text-[#2C211A]">Bündelgröße:</span>
                    <select
                      id="batch-size-select"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      disabled={isAutoTimerRunning}
                      className="px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D5C7B2] rounded-md text-xs font-medium text-[#1A1215] focus:outline-none focus:ring-1 focus:ring-[#8B1E2F]"
                    >
                      <option value={15}>15 Adressen (Sehr sicher / Webmail)</option>
                      <option value={25}>25 Adressen (Empfohlen für Mailto)</option>
                      <option value={50}>50 Adressen (Standard Gmail/Outlook)</option>
                      <option value={75}>75 Adressen (Erweiterter Puffer)</option>
                      <option value={100}>100 Adressen (Maximales Limit)</option>
                    </select>
                  </div>

                  {/* Delay Duration Selection */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8B1E2F]" />
                    <span className="text-xs font-semibold text-[#2C211A]">Zeitverzögerung:</span>
                    <select
                      id="delay-seconds-select"
                      value={delaySeconds}
                      onChange={(e) => setDelaySeconds(Number(e.target.value))}
                      disabled={isAutoTimerRunning}
                      className="px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D5C7B2] rounded-md text-xs font-medium text-[#1A1215] focus:outline-none focus:ring-1 focus:ring-[#8B1E2F]"
                    >
                      <option value={5}>5 Sekunden (Schnell)</option>
                      <option value={10}>10 Sekunden</option>
                      <option value={15}>15 Sekunden (Empfohlen)</option>
                      <option value={30}>30 Sekunden</option>
                      <option value={60}>60 Sekunden (Entspanntes Senden)</option>
                    </select>
                  </div>

                  {/* Summary Metric */}
                  <div className="text-xs text-[#7A6B5C] font-medium ml-auto">
                    Insgesamt <strong className="text-[#1A1215] font-bold">{batches.length} Batches</strong> für{' '}
                    <strong className="text-[#8B1E2F] font-bold">{targetHouses.length} Häuser</strong>
                  </div>
                </div>

                {/* Automated Dispatcher Controls Panel */}
                <div className="pt-3 border-t border-[#EDE4D6] flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    {!isAutoTimerRunning ? (
                      <button
                        id="start-auto-dispatch-btn"
                        onClick={handleStartAutoDispatch}
                        disabled={currentBatchIndex >= batches.length}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B1E2F] hover:bg-[#6D1623] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Automatisches Versenden starten</span>
                      </button>
                    ) : (
                      <button
                        id="pause-auto-dispatch-btn"
                        onClick={handlePauseAutoDispatch}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pausieren ({secondsRemaining}s)</span>
                      </button>
                    )}

                    <button
                      id="next-batch-btn"
                      onClick={handleNextBatchImmediate}
                      disabled={currentBatchIndex >= batches.length}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#D5C7B2] hover:bg-[#F2ECE1] text-[#34271E] text-xs font-medium transition-all disabled:opacity-50"
                      title="Nächsten Batch sofort auf Knopfdruck im E-Mail-Programm öffnen"
                    >
                      <SkipForward className="w-3.5 h-3.5 text-[#8B1E2F]" />
                      <span>Nächster Batch sofort</span>
                    </button>

                    <button
                      id="reset-dispatcher-btn"
                      onClick={handleResetDispatcher}
                      className="p-2 rounded-lg bg-white border border-[#D5C7B2] hover:bg-[#F2ECE1] text-[#6B5A4B] transition-all"
                      title="Dispatcher zurücksetzen"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status & Countdown Display */}
                  <div className="flex items-center gap-3">
                    {isAutoTimerRunning ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-md text-xs font-semibold animate-pulse">
                        <Clock className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                        <span>
                          Nächster Batch #{currentBatchIndex + 1} öffnet in <strong className="text-sm">{secondsRemaining}s</strong>
                        </span>
                      </div>
                    ) : currentBatchIndex >= batches.length && batches.length > 0 ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-md text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Alle {batches.length} Batches erfolgreich vorbereitet!</span>
                      </div>
                    ) : (
                      <div className="text-xs text-[#7A6B5C]">
                        Fortschritt: <strong className="text-[#1A1215] font-semibold">{dispatchedBatchIndices.size}</strong> von {batches.length} geöffnet
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E5DBCB] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#8B1E2F] to-[#C5A059] h-full transition-all duration-300"
                    style={{ 
                      width: `${batches.length > 0 ? (dispatchedBatchIndices.size / batches.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              {/* Batches Overview List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>Aufgeteilte E-Mail-Bündel ({batches.length})</span>
                  </h3>
                  <button
                    onClick={handleCopyAllEmails}
                    className="text-xs text-[#8B1E2F] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {copiedAllEmails ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAllEmails ? 'Alle kopiert' : 'Alle 360 Adressen auf einmal kopieren'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {batches.map((batch, idx) => {
                    const isDispatched = dispatchedBatchIndices.has(idx);
                    const isNext = currentBatchIndex === idx && !isDispatched;

                    return (
                      <div
                        key={batch.batchNumber}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isDispatched
                            ? 'bg-[#F4FAF6] border-[#A7D7BC]'
                            : isNext && isAutoTimerRunning
                            ? 'bg-[#FFFBEB] border-[#F59E0B] ring-2 ring-[#F59E0B]/30'
                            : 'bg-white border-[#E0D5C3] hover:border-[#8B1E2F]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDispatched 
                                ? 'bg-emerald-600 text-white' 
                                : isNext 
                                ? 'bg-[#8B1E2F] text-white' 
                                : 'bg-[#EDE5D8] text-[#55473B]'
                            }`}>
                              {batch.batchNumber}
                            </span>
                            <span className="font-serif font-bold text-sm text-[#1A1215]">
                              Batch {batch.batchNumber}
                            </span>
                            <span className="text-[11px] bg-[#EDE5D8] text-[#544538] px-2 py-0.2 rounded-full font-medium">
                              {batch.emails.length} Adressen
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isDispatched && (
                              <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Check className="w-3 h-3" /> Geöffnet
                              </span>
                            )}
                            {isNext && isAutoTimerRunning && (
                              <span className="text-[10.5px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3" /> Läuft ({secondsRemaining}s)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Preview of houses in this batch */}
                        <p className="text-[11px] text-[#6E5F50] line-clamp-2 mb-3 leading-relaxed">
                          {batch.houses.map((h) => h.name).join(', ')}
                        </p>

                        {/* Batch Action Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EDE5D8] text-xs">
                          <button
                            id={`open-batch-${batch.batchNumber}-btn`}
                            onClick={() => dispatchBatch(idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#8B1E2F] hover:bg-[#6D1623] text-white text-[11px] font-medium transition-colors shadow-2xs"
                            title="Dieses Bündel im Standard-Mailprogramm öffnen"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Im Mailer öffnen</span>
                          </button>

                          <button
                            id={`copy-batch-${batch.batchNumber}-btn`}
                            onClick={() => handleCopyBatchEmails(batch.emails, idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2] text-[#4F4134] text-[11px] font-medium transition-colors"
                            title="BCC-Adressen für Zwischenablage kopieren"
                          >
                            {copiedBatchIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Kopiert</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>BCC kopieren</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => downloadEmlFile(batch.emails, customSubject, customBody, `Adelshaeuser_Batch_${batch.batchNumber}.eml`)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[#786A5C] hover:text-[#1A1215] hover:bg-[#FAF8F3] text-[11px] transition-colors ml-auto"
                            title="Als EML-Entwurf speichern"
                          >
                            <Download className="w-3 h-3" />
                            <span>.eml</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATES & Anschreiben */}
          {activeTab === 'templates' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#544538] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B1E2F]" />
                  <span>Diplomatische Anschreiben-Vorlagen wählen</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DIPLOMATIC_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        id={`template-card-${tmpl.id}`}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#FAF4EC] border-[#8B1E2F] ring-1 ring-[#8B1E2F] shadow-xs'
                            : 'bg-white border-[#E0D5C3] hover:border-[#8B1E2F]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-sm text-[#1A1215]">
                            {tmpl.title}
                          </h4>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#8B1E2F]" />
                          )}
                        </div>
                        <p className="text-xs text-[#6B5C4E] mt-1 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject & Body Editor */}
              <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C211A] flex items-center justify-between">
                    <span>E-Mail-Betreffzeile (Subject):</span>
                    <span className="text-[10.5px] text-[#7A6B5C] font-normal">
                      {customSubject.length} Zeichen
                    </span>
                  </label>
                  <input
                    id="email-subject-input"
                    type="text"
                    value={customSubject}
                    onChange={(e) => {
                      setCustomSubject(e.target.value);
                      setSelectedTemplateId('custom');
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF8F3] border border-[#D5C7B2] rounded-lg text-sm text-[#1A1215] focus:outline-none focus:ring-2 focus:ring-[#8B1E2F]/40"
                    placeholder="Betreff eingeben..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2C211A] flex items-center justify-between">
                    <span>Nachrichtentext (Body):</span>
                    <span className="text-[10.5px] text-[#7A6B5C] font-normal">
                      {customBody.length} Zeichen
                    </span>
                  </label>
                  <textarea
                    id="email-body-textarea"
                    rows={12}
                    value={customBody}
                    onChange={(e) => {
                      setCustomBody(e.target.value);
                      setSelectedTemplateId('custom');
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#D5C7B2] rounded-lg text-xs font-sans text-[#1A1215] focus:outline-none focus:ring-2 focus:ring-[#8B1E2F]/40 leading-relaxed font-mono"
                    placeholder="Nachricht verfassen..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRUE EVIDENCE VERIFICATION & DIRECT CONTACT */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-3 text-xs text-[#166534]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14532D]">Garantie für True Evidence:</strong> Jede hier verzeichnete Kontaktadresse 
                  ist die nachweisbare, offizielle Poststelle, Stiftungskanzlei oder das Hausarchiv der jeweiligen Familie. 
                  Keine veralteten Phishing- oder Fantasiedaten.
                </div>
              </div>

              {/* Evidence Search bar */}
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={evidenceSearch}
                  onChange={(e) => setEvidenceSearch(e.target.value)}
                  placeholder="Haus, Stiftung, Domain oder E-Mail suchen..."
                  className="flex-1 px-3 py-2 bg-white border border-[#D5C7B2] rounded-lg text-xs text-[#1A1215] focus:outline-none focus:ring-1 focus:ring-[#8B1E2F]"
                />
                <span className="text-xs text-[#7A6B5C] font-medium shrink-0">
                  {evidenceHouses.length} Einträge
                </span>
              </div>

              {/* Evidence Table */}
              <div className="bg-white border border-[#DCD0BE] rounded-xl overflow-hidden shadow-xs">
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#FAF8F3] sticky top-0 border-b border-[#E0D5C3] text-[#544538] uppercase font-semibold text-[10px] tracking-wider z-10">
                      <tr>
                        <th className="py-2.5 px-3">Haus & Land</th>
                        <th className="py-2.5 px-3">Offizielle E-Mail</th>
                        <th className="py-2.5 px-3">Verwaltende Institution</th>
                        <th className="py-2.5 px-3">Residenz & Nachweis</th>
                        <th className="py-2.5 px-3 text-right">Direkt-Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE7D8]">
                      {evidenceHouses.map((house) => (
                        <tr key={house.id} className="hover:bg-[#FAF7F0] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-serif font-bold text-[#1A1215]">{house.name}</div>
                            <div className="text-[10px] text-[#7A6B5C]">{house.country} • {house.type}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-[#8B1E2F] font-semibold select-all">
                              {house.email}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-[#3A2E24] font-medium truncate max-w-[180px]">
                              {house.institution}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-[#4E3F34] truncate max-w-[160px]">{house.seat}</div>
                            <div className="text-[10px] text-emerald-700 font-medium">✓ Stand: {house.verifiedAt}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <a
                              href={`mailto:${house.email}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#8B1E2F] hover:bg-[#6D1623] text-white text-[10.5px] font-medium transition-colors"
                              title={`Direkt-E-Mail an ${house.name} senden`}
                            >
                              <Mail className="w-3 h-3" />
                              <span>Schreiben</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT & MAILING SOFTWARE UTILITIES */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* EML File Export Card */}
                <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#8B1E2F]/10 flex items-center justify-center text-[#8B1E2F]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1215]">
                      RFC 822 .EML Entwurf
                    </h4>
                    <p className="text-xs text-[#6B5C4E] leading-relaxed">
                      Erzeugt einen standardisierten E-Mail-Entwurf für Thunderbird, Outlook, Apple Mail oder Bluebird mit allen BCC-Adressen.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadEmlFile(targetHouses.map((h) => h.email!).filter(Boolean), customSubject, customBody)}
                    className="w-full py-2 bg-[#8B1E2F] hover:bg-[#6D1623] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.EML Datei herunterladen</span>
                  </button>
                </div>

                {/* CSV Distribution List Card */}
                <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1215]">
                      E-Mail-Verteilerliste (CSV)
                    </h4>
                    <p className="text-xs text-[#6B5C4E] leading-relaxed">
                      Spezielle CSV mit Hausname, Stiftung, E-Mail und Verifikationsnachweis für Excel, Google Sheets oder Newsletter-Tools.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadEmailCsv(targetHouses)}
                    className="w-full py-2 bg-[#1A1215] hover:bg-[#2F1D22] text-[#FAF6EE] text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E5C170]" />
                    <span>CSV Verteiler exportieren</span>
                  </button>
                </div>

                {/* vCard Book Card */}
                <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700">
                      <Users className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1215]">
                      vCard Sammelbuch (.vcf)
                    </h4>
                    <p className="text-xs text-[#6B5C4E] leading-relaxed">
                      Direkter Import aller {targetHouses.length} Adelsarchive als Kontaktgruppe in Apple Kontakte, Outlook oder Google Contacts.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadVCardBook(targetHouses)}
                    className="w-full py-2 bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2] text-[#3A2E24] text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8B1E2F]" />
                    <span>vCard (.VCF) exportieren</span>
                  </button>
                </div>
              </div>

              {/* Raw Copy Area */}
              <div className="bg-white border border-[#DCD0BE] rounded-xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2C211A]">
                    Alle {targetHouses.length} Adressen als fortlaufende Textzeile (für BCC):
                  </span>
                  <button
                    onClick={handleCopyAllEmails}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F3] hover:bg-[#EFE8DC] border border-[#D5C7B2] text-[#34271E] rounded-md text-xs font-medium transition-colors"
                  >
                    {copiedAllEmails ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAllEmails ? 'Kopiert!' : 'In Zwischenablage kopieren'}</span>
                  </button>
                </div>
                <div className="max-h-28 overflow-y-auto p-2.5 bg-[#FAF8F3] border border-[#E3D8C6] rounded-md text-xs font-mono text-[#544538] select-all break-all leading-relaxed">
                  {targetHouses.map((h) => h.email).filter(Boolean).join('; ')}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#EFEAE0] px-4 sm:px-6 py-3 border-t border-[#D5C7B2] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#7A6B5C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Verifizierte Empfänger: <strong>{targetHouses.length}</strong></span>
            <span>•</span>
            <span>Batches: <strong>{batches.length}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#F2ECE1] border border-[#D5C7B2] text-[#34271E] rounded-lg text-xs font-medium transition-colors"
            >
              Schließen
            </button>
            <button
              id="footer-open-batch-1-btn"
              onClick={() => dispatchBatch(0)}
              className="px-4 py-2 bg-[#8B1E2F] hover:bg-[#6D1623] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Batch 1 jetzt starten</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
