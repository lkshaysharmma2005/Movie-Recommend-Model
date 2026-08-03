import React, { useState } from 'react';
import { X, Key, Check, Server } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, omdbKey, onSaveOmdbKey }) {
  const [inputKey, setInputKey] = useState(omdbKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveOmdbKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">API & Data Sources</h3>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex gap-3 text-xs text-slate-300">
            <Server className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-1">Default Data Providers: Active</strong>
              <p>
                The app automatically aggregates data from <strong>TVMaze API</strong> and <strong>iTunes Search API</strong> for 100% free, keyless searches with high-res posters and metadata.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-sm font-bold text-white">
              Optional Custom OMDb API Key
            </label>
            <p className="text-xs text-slate-400">
              If you have a personal OMDb API key (e.g. from omdbapi.com), enter it below to prioritize OMDb search results.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-cyan-400"
                placeholder="Enter OMDb API key (e.g. 7b3a9c1d)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 cursor-pointer">
                {savedSuccess ? <Check className="w-4 h-4" /> : 'Save Key'}
              </button>
            </div>

            {savedSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> API Key saved successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
