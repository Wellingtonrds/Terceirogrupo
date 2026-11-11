import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  PlusCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApplyText: (newText: string) => void;
  onAppendText: (appendedText: string) => void;
}

type AIAction =
  | 'proofread'
  | 'tone'
  | 'summarize'
  | 'translate'
  | 'expand'
  | 'titles'
  | 'clarity'
  | 'custom';

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentText,
  onApplyText,
  onAppendText,
}) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>('proofread');
  const [tone, setTone] = useState('conciso e elegante');
  const [targetLanguage, setTargetLanguage] = useState('Inglês');
  const [customPrompt, setCustomPrompt] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!currentText.trim()) {
      setError('O texto do documento está vazio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          action: selectedAction,
          tone,
          targetLanguage,
          customPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar com IA.');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err?.message || 'Falha na conexão com o assistente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Assistente de Redação & Aprimoramento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action selection */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-stone-700 dark:text-stone-300">
              O que você deseja aprimorar no texto?
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setSelectedAction('proofread')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'proofread'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Revisão e Fluidez
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('clarity')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'clarity'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Clareza & Concisão
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('tone')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'tone'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Ajustar Tom
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('summarize')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'summarize'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Resumo / Síntese
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('translate')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'translate'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Tradução Estilística
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('expand')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'expand'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Expandir Ideia
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('titles')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'titles'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Gerar Títulos
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction('custom')}
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  selectedAction === 'custom'
                    ? 'border-amber-600 bg-amber-50/50 font-medium text-amber-950 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-100'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                Comando Livre
              </button>
            </div>
          </div>

          {/* Dynamic Action Options */}
          {selectedAction === 'tone' && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Selecione o tom desejado:
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-white p-2 text-xs text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="conciso e elegante">Conciso e Elegante</option>
                <option value="formal e executivo">Formal & Executivo</option>
                <option value="acadêmico e rigoroso">Acadêmico & Rigoroso</option>
                <option value="persuasivo e envolvente">Persuasivo & Envolvente</option>
                <option value="literário e poético">Literário & Poético</option>
                <option value="jornalístico e direto">Jornalístico & Direto</option>
                <option value="informal e coloquial">Informal & Amigável</option>
              </select>
            </div>
          )}

          {selectedAction === 'translate' && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Idioma de destino:
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-white p-2 text-xs text-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="Inglês">Inglês</option>
                <option value="Espanhol">Espanhol</option>
                <option value="Francês">Francês</option>
                <option value="Alemão">Alemão</option>
                <option value="Italiano">Italiano</option>
                <option value="Português Brasileiro">Português Brasileiro</option>
                <option value="Japonês">Japonês</option>
              </select>
            </div>
          )}

          {selectedAction === 'custom' && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Instrução personalizada:
              </label>
              <input
                type="text"
                placeholder="Ex: Reescreva como um prólogo dramático, simplifique para iniciantes..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-white p-2 text-xs text-stone-900 focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>
          )}

          {/* Trigger button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-800 disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processando texto...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Gerar Aprimoramento</span>
                </>
              )}
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result view */}
          {result && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Resultado Gerado
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>Copiar</span>
                </button>
              </div>

              <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-4 font-serif text-sm leading-relaxed whitespace-pre-wrap dark:border-stone-800 dark:bg-stone-950/50">
                {result}
              </div>

              {/* Action buttons on generated text */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    onAppendText(result);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Inserir no Final</span>
                </button>

                <button
                  onClick={() => {
                    onApplyText(result);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Substituir Texto do Editor</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
