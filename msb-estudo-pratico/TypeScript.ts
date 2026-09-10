'use client';

import React, { useState } from 'react';

type EtapaProcessamento = 'ocioso' | 'enviando' | 'extraindo' | 'organizando' | 'concluido';

export default function TelaUploadMSB() {
  const [etapa, setEtapa] = useState<EtapaProcessamento>('ocioso');
  const [arquivoNome, setArquivoNome] = useState<string>('');
  const [mensagemErro, setMensagemErro] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setArquivoNome(file.name);
    setEtapa('enviando');
    setMensagemErro('');

    try {
      setTimeout(() => setEtapa('extraindo'), 1500);
      setTimeout(() => setEtapa('organizando'), 3500);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/processar-material', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (!response.ok || !resultado.sucesso) {
        throw new Error(resultado.mensagem || 'Falha ao processar o documento.');
      }

      setTimeout(() => setEtapa('concluido'), 5500);
    } catch (error: any) {
      setMensagemErro(error.message);
      setEtapa('ocioso');
    }
  };

  return (
    <div className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wider text-emerald-400">ESTUDO PRÁTICO MSB</h1>
        <p className="text-sm text-slate-400 mt-1">Do PDF à aprovação, sem atalhos[cite: 6, 10].</p>
      </div>

      {etapa === 'ocioso' && (
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer relative bg-slate-900/50">
          <input 
            type="file" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-3">📁</span>
            <p className="font-semibold text-slate-200">Arraste seu PDF ou DOCX aqui</p>
            <p className="text-xs text-slate-400 mt-1">Leis, editais, apostilas ou resumos brutos</p>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-200 text-center">
          {mensagemErro}
        </div>
      )}

      {etapa !== 'ocioso' && etapa !== 'concluido' && (
        <div className="space-y-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span className="font-medium">Processando: {arquivoNome}</span>
            <span className="animate-pulse text-emerald-400">Motor Ativo...</span>
          </div>

          <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className={`flex items-center space-x-3 text-sm ${etapa === 'enviando' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
              <span>{etapa === 'enviando' ? '⏳' : '✓'}</span>
              <span>Documento recebido com segurança</span>
            </div>
            <div className={`flex items-center space-x-3 text-sm ${etapa === 'extraindo' ? 'text-emerald-400 font-semibold' : (etapa === 'organizando' ? 'text-slate-200' : 'text-slate-600')}`}>
              <span>{etapa === 'extraindo' ? '⏳' : (etapa === 'organizando' ? '✓' : '○')}</span>
              <span>Extraindo texto e limpando ruídos do arquivo</span>
            </div>
            <div className={`flex items-center space-x-3 text-sm ${etapa === 'organizando' ? 'text-emerald-400 font-semibold' : 'text-slate-600'}`}>
              <span>{etapa === 'organizando' ? '⏳' : '○'}</span>
              <span>Estruturando árvore de conhecimento (Matéria → Tema → Subtema)</span>
            </div>
          </div>
        </div>
      )}

      {etapa === 'concluido' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Seu material está pronto!</h2>
          <p className="text-sm text-slate-300">O conteúdo foi transformado em um centro de estudos integrado.</p>
          
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-left">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">📄 Resumo Estruturado[cite: 10]</div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">🧠 30 Flashcards Ativos</div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">❓ 20 Questões de Fixação</div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">🗺️ Mapa de Conhecimento</div>
          </div>

          <button 
            onClick={() => setEtapa('ocioso')}
            className="mt-4 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Começar Estudo Prático
          </button>
        </div>
      )}
    </div>
  );
}