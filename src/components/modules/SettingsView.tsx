import { useState, ChangeEvent } from 'react';
import { Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { PageHeader } from '../PageHeader';

interface SettingsViewProps {
  feeCategories: string[];
  feePresets: Record<string, number>;
  costCategories: string[];
  signatureDataUrl: string;
  onAddFeeCategory: (name: string) => void;
  onDeleteFeeCategory: (index: number) => void;
  onResetFeeCategories: () => void;
  onUpdateFeePreset: (cat: string, amount: number) => void;
  onAddCostCategory: (name: string) => void;
  onDeleteCostCategory: (index: number) => void;
  onResetCostCategories: () => void;
  onSignatureUpload: (dataUrl: string) => void;
  onClearSignature: () => void;
}

export function SettingsView({
  feeCategories,
  feePresets,
  costCategories,
  signatureDataUrl,
  onAddFeeCategory,
  onDeleteFeeCategory,
  onResetFeeCategories,
  onUpdateFeePreset,
  onAddCostCategory,
  onDeleteCostCategory,
  onResetCostCategories,
  onSignatureUpload,
  onClearSignature,
}: SettingsViewProps) {
  const [newFeeCat, setNewFeeCat] = useState('');
  const [newCostCat, setNewCostCat] = useState('');

  const handleAddFee = () => {
    const val = newFeeCat.trim();
    if (!val) return;
    onAddFeeCategory(val);
    setNewFeeCat('');
  };

  const handleAddCost = () => {
    const val = newCostCat.trim();
    if (!val) return;
    onAddCostCategory(val);
    setNewCostCat('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        onSignatureUpload(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Financial Categories"
        description="Manage system presets, custom fee heads, default fee schedules, and institutional expense categories."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Categories */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Fee Categories</h3>
            <button
              type="button"
              onClick={onResetFeeCategories}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFeeCat}
              onChange={(e) => setNewFeeCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFee()}
              placeholder="New Fee Head..."
              className="flex-1 min-w-0 px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleAddFee}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {feeCategories.map((cat, idx) => (
              <div
                key={cat}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <span className="truncate">{cat}</span>
                <button
                  type="button"
                  onClick={() => onDeleteFeeCategory(idx)}
                  aria-label={`Delete ${cat}`}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Default Fee Amounts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Default Fee Amounts (BDT)
            </h3>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {feeCategories.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 last:border-none"
              >
                <span className="text-xs font-medium text-slate-700 truncate">
                  {cat}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-mono text-slate-500">৳</span>
                  <input
                    type="number"
                    min={0}
                    value={feePresets[cat] ?? 0}
                    onChange={(e) =>
                      onUpdateFeePreset(cat, parseFloat(e.target.value) || 0)
                    }
                    className="w-24 px-2.5 py-1.5 border border-slate-300 bg-white rounded-lg text-xs font-mono tabular-nums font-semibold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost / Expense Heads */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Cost / Expense Heads
            </h3>
            <button
              type="button"
              onClick={onResetCostCategories}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCostCat}
              onChange={(e) => setNewCostCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCost()}
              placeholder="New Expense Head..."
              className="flex-1 min-w-0 px-3 py-2 border border-slate-300 bg-white rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleAddCost}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {costCategories.map((cat, idx) => (
              <div
                key={cat}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <span className="truncate">{cat}</span>
                <button
                  type="button"
                  onClick={() => onDeleteCostCategory(idx)}
                  aria-label={`Delete ${cat}`}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Digital Signature */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Authorized Digital Signature
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Automatically applied to generated ID cards and printed academic certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {signatureDataUrl ? (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <img
                src={signatureDataUrl}
                alt="Authorized signature preview"
                className="h-8 object-contain"
              />
              <button
                type="button"
                onClick={onClearSignature}
                className="text-xs font-semibold text-rose-600 hover:underline whitespace-nowrap shrink-0"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-500">No signature uploaded</span>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Signature Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
