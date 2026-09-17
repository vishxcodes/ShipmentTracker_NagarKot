import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, AlertCircle, Package } from 'lucide-react';
import { createShipment } from '../services/api';

export default function CreateShipmentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    senderName: '',
    receiverName: '',
    origin: '',
    destination: '',
    packageDescription: '',
    weight: '',
    estimatedDeliveryDate: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Accessible Escape key listener & Body scroll lock
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

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        trackingNumber: '',
        senderName: '',
        receiverName: '',
        origin: '',
        destination: '',
        packageDescription: '',
        weight: '',
        estimatedDeliveryDate: '',
      });
      setFieldErrors({});
      setServerError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};

    if (!formData.trackingNumber.trim()) {
      errors.trackingNumber = 'Tracking number is required.';
    }
    if (!formData.senderName.trim()) {
      errors.senderName = 'Sender name is required.';
    }
    if (!formData.receiverName.trim()) {
      errors.receiverName = 'Receiver name is required.';
    }
    if (!formData.origin.trim()) {
      errors.origin = 'Origin city/hub is required.';
    }
    if (!formData.destination.trim()) {
      errors.destination = 'Destination city/hub is required.';
    }
    if (!formData.packageDescription.trim()) {
      errors.packageDescription = 'Package description is required.';
    }
    if (
      formData.weight === '' ||
      isNaN(formData.weight) ||
      Number(formData.weight) <= 0
    ) {
      errors.weight = 'Weight must be a positive number greater than 0.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        trackingNumber: formData.trackingNumber.trim().toUpperCase(),
        senderName: formData.senderName.trim(),
        receiverName: formData.receiverName.trim(),
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        packageDescription: formData.packageDescription.trim(),
        weight: parseFloat(formData.weight),
        estimatedDeliveryDate: formData.estimatedDeliveryDate
          ? new Date(formData.estimatedDeliveryDate).toISOString()
          : null,
      };

      const created = await createShipment(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to create shipment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#0d1117] border border-[#30363d] text-[#58a6ff]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 id="create-modal-title" className="text-sm font-semibold text-[#f0f6fc]">
                Create New Shipment
              </h2>
              <p className="text-xs text-[#8b949e]">
                Register cargo and dispatch under Nagarkot Forwarders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3 rounded-md bg-[#da3633]/15 border border-[#da3633]/40 text-xs text-[#f85149] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#f85149] flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Tracking Number */}
          <div>
            <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
              Tracking Number <span className="text-[#f85149]">*</span>
            </label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="e.g. NF20260005"
              className={`w-full bg-[#010409] border ${
                fieldErrors.trackingNumber ? 'border-[#f85149]' : 'border-[#30363d]'
              } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] uppercase font-mono`}
            />
            {fieldErrors.trackingNumber && (
              <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.trackingNumber}</p>
            )}
          </div>

          {/* Sender & Receiver (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Sender Name <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                placeholder="e.g. Amit Sharma"
                className={`w-full bg-[#010409] border ${
                  fieldErrors.senderName ? 'border-[#f85149]' : 'border-[#30363d]'
                } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]`}
              />
              {fieldErrors.senderName && (
                <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.senderName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Receiver Name <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className={`w-full bg-[#010409] border ${
                  fieldErrors.receiverName ? 'border-[#f85149]' : 'border-[#30363d]'
                } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]`}
              />
              {fieldErrors.receiverName && (
                <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.receiverName}</p>
              )}
            </div>
          </div>

          {/* Origin & Destination (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Origin <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Kathmandu Hub"
                className={`w-full bg-[#010409] border ${
                  fieldErrors.origin ? 'border-[#f85149]' : 'border-[#30363d]'
                } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]`}
              />
              {fieldErrors.origin && (
                <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.origin}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Destination <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Pokhara Station"
                className={`w-full bg-[#010409] border ${
                  fieldErrors.destination ? 'border-[#f85149]' : 'border-[#30363d]'
                } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]`}
              />
              {fieldErrors.destination && (
                <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.destination}</p>
              )}
            </div>
          </div>

          {/* Package Description */}
          <div>
            <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
              Package Description <span className="text-[#f85149]">*</span>
            </label>
            <textarea
              name="packageDescription"
              rows={2}
              value={formData.packageDescription}
              onChange={handleChange}
              placeholder="e.g. Industrial bearings and replacement parts"
              className={`w-full bg-[#010409] border ${
                fieldErrors.packageDescription ? 'border-[#f85149]' : 'border-[#30363d]'
              } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] resize-none`}
            />
            {fieldErrors.packageDescription && (
              <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.packageDescription}</p>
            )}
          </div>

          {/* Weight & Estimated Delivery Date (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Weight (kg) <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 5.5"
                className={`w-full bg-[#010409] border ${
                  fieldErrors.weight ? 'border-[#f85149]' : 'border-[#30363d]'
                } rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] font-mono`}
              />
              {fieldErrors.weight && (
                <p className="text-[11px] text-[#f85149] mt-1">{fieldErrors.weight}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                Estimated Delivery Date <span className="text-[#8b949e]">(Optional)</span>
              </label>
              <input
                type="date"
                name="estimatedDeliveryDate"
                value={formData.estimatedDeliveryDate}
                onChange={handleChange}
                className="w-full bg-[#010409] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
            </div>
          </div>

          <div className="p-3 rounded-md bg-[#1f6feb]/10 border border-[#1f6feb]/30 text-[11px] text-[#58a6ff]">
            ℹ️ New shipments are automatically initialized with <strong>BOOKED</strong> status and logged in status history.
          </div>

          {/* Modal Actions */}
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
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] rounded-md transition-colors shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#3fb950]/50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Shipment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
