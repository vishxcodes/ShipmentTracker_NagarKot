import React, { useState, useEffect } from 'react';
import { X, Loader2, RefreshCw, AlertCircle, MapPin } from 'lucide-react';
import { SHIPMENT_STATUSES, getStatusConfig } from '../constants/shipmentStatus';
import StatusBadge from './StatusBadge';
import { updateShipmentStatus } from '../services/api';

export default function UpdateStatusModal({
  isOpen,
  onClose,
  shipment,
  onSuccess,
}) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (shipment) {
      const currentIndex = SHIPMENT_STATUSES.indexOf(shipment.status);
      const nextStatus =
        currentIndex >= 0 && currentIndex < SHIPMENT_STATUSES.length - 1
          ? SHIPMENT_STATUSES[currentIndex + 1]
          : shipment.status;

      setSelectedStatus(nextStatus !== shipment.status ? nextStatus : '');
      setLocation('');
      setNote('');
      setError('');
    }
  }, [shipment, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !shipment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStatus) {
      setError('Please select a new shipment status.');
      return;
    }

    if (selectedStatus === shipment.status) {
      setError(`Shipment is already in '${getStatusConfig(shipment.status).label}' status. Please select a new status.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        status: selectedStatus,
        location: location.trim() || undefined,
        note: note.trim() || undefined,
      };

      const updated = await updateShipmentStatus(shipment.trackingNumber, payload);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update shipment status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#30363d] bg-[#0d1117]">
          <div>
            <h2 id="update-modal-title" className="text-sm font-semibold text-[#f0f6fc]">
              Update Shipment Status
            </h2>
            <p className="text-xs text-[#8b949e] font-mono mt-0.5">
              Ref: <span className="text-[#58a6ff] font-medium">{shipment.trackingNumber}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Status Pill */}
          <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <span className="text-xs text-[#8b949e] font-medium">Current Status:</span>
            <StatusBadge status={shipment.status} size="md" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-[#da3633]/15 border border-[#da3633]/40 text-xs text-[#f85149] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#f85149] flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* New Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
              New Status <span className="text-[#f85149]">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-[#010409] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] cursor-pointer"
            >
              <option value="" disabled>Select target status...</option>
              {SHIPMENT_STATUSES.map((st) => {
                const isCurrent = st === shipment.status;
                return (
                  <option key={st} value={st} disabled={isCurrent}>
                    {getStatusConfig(st).label} {isCurrent ? '(Current)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
              Current Location <span className="text-[#8b949e]">(Optional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8b949e] absolute left-3 top-2 pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Narayanghat Sorting Hub, Highway Checkpoint"
                className="w-full bg-[#010409] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
            </div>
          </div>

          {/* Operational Note */}
          <div>
            <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
              Status Change Note <span className="text-[#8b949e]">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Scanned at outbound dock, transferred to regional carrier truck"
              className="w-full bg-[#010409] border border-[#30363d] rounded-md p-2.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] resize-none"
            />
          </div>

          <p className="text-[11px] text-[#8b949e]">
            🔒 Status transition will be permanently recorded in the audit history.
          </p>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#30363d]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedStatus === shipment.status}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] rounded-md transition-colors shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#3fb950]/50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Confirm Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
