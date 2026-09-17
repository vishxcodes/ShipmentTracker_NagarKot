import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ArrowRight, 
  Calendar, 
  Weight, 
  Package, 
  Clock, 
  User, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import StatusTimeline from './StatusTimeline';
import UpdateStatusModal from './UpdateStatusModal';
import { fetchShipmentDetails } from '../services/api';
import { formatDate, formatWeight, copyToClipboard } from '../utils/formatters';

export default function ShipmentDetails({
  trackingNumber,
  isOpen,
  onClose,
  onStatusUpdated,
}) {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const loadDetails = async () => {
    if (!trackingNumber) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchShipmentDetails(trackingNumber);
      setShipment(data);
    } catch (err) {
      setError(err.message || 'Failed to load shipment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && trackingNumber) {
      loadDetails();
    }
  }, [isOpen, trackingNumber]);

  // Accessible Escape key & Body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!isUpdateModalOpen) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isUpdateModalOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!shipment?.trackingNumber) return;
    const success = await copyToClipboard(shipment.trackingNumber);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusUpdateSuccess = (updatedData) => {
    setShipment(updatedData);
    if (onStatusUpdated) {
      onStatusUpdated(updatedData);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm transition-opacity"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#30363d] bg-[#0d1117]">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="details-modal-title" className="text-base font-bold text-[#f0f6fc] font-mono">
                    {trackingNumber}
                  </h2>
                  <button
                    onClick={handleCopy}
                    title="Copy tracking number"
                    aria-label={`Copy tracking number ${trackingNumber}`}
                    className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-1 focus:ring-[#58a6ff]/40"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#8b949e]">
                  Nagarkot Forwarders Shipment Dossier
                </p>
              </div>

              {shipment && <StatusBadge status={shipment.status} size="md" />}
            </div>

            <button
              onClick={onClose}
              aria-label="Close details dialog"
              className="p-1.5 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 space-y-5 flex-1">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-[#58a6ff] border-t-transparent animate-spin" />
                <p className="text-xs text-[#8b949e]">Loading shipment records...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center bg-[#da3633]/10 border border-[#da3633]/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#f85149] mx-auto mb-2" />
                <p className="text-xs text-[#f85149] font-medium">{error}</p>
                <button
                  onClick={loadDetails}
                  className="mt-3 px-3 py-1 text-xs rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]"
                >
                  Retry
                </button>
              </div>
            ) : shipment ? (
              <>
                {/* Route Banner */}
                <div className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#8b949e] tracking-wider">Origin</span>
                      <h3 className="text-sm font-semibold text-[#f0f6fc]">{shipment.origin || '—'}</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#58a6ff] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#8b949e] tracking-wider">Destination</span>
                      <h3 className="text-sm font-semibold text-[#f0f6fc]">{shipment.destination || '—'}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3fb950]/50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </button>
                </div>

                {/* Logistics Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  {/* Sender */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <User className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Sender</span>
                    </div>
                    <div className="font-medium text-[#f0f6fc] truncate">{shipment.senderName || '—'}</div>
                  </div>

                  {/* Receiver */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <User className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Receiver</span>
                    </div>
                    <div className="font-medium text-[#f0f6fc] truncate">{shipment.receiverName || '—'}</div>
                  </div>

                  {/* Weight */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <Weight className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Weight</span>
                    </div>
                    <div className="font-semibold text-[#f0f6fc] font-mono">{formatWeight(shipment.weight)}</div>
                  </div>

                  {/* Package Description */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <Package className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Package Description</span>
                    </div>
                    <div className="font-medium text-[#f0f6fc]">{shipment.packageDescription || '—'}</div>
                  </div>

                  {/* Estimated Delivery Date */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Expected Delivery</span>
                    </div>
                    <div className="font-medium text-[#f0f6fc] font-mono">
                      {formatDate(shipment.estimatedDeliveryDate, false)}
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Registered On</span>
                    </div>
                    <div className="font-mono text-[#c9d1d9] text-[11px]">
                      {formatDate(shipment.createdAt, true)}
                    </div>
                  </div>

                  {/* Updated At */}
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Last Status Change</span>
                    </div>
                    <div className="font-mono text-[#c9d1d9] text-[11px]">
                      {formatDate(shipment.updatedAt, true)}
                    </div>
                  </div>
                </div>

                {/* Chronological Status Timeline Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                      <span>Status History Timeline</span>
                      <span className="text-[11px] text-[#8b949e] font-mono font-normal">
                        ({shipment.statusHistory?.length || 0})
                      </span>
                    </h4>
                    <span className="text-[11px] text-[#8b949e]">Oldest to Newest</span>
                  </div>

                  <StatusTimeline history={shipment.statusHistory || []} />
                </div>
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between text-xs text-[#8b949e]">
            <span className="font-mono text-[11px]">
              ID: {shipment?.id || '—'}
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Nested Status Update Modal */}
      {isUpdateModalOpen && shipment && (
        <UpdateStatusModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          shipment={shipment}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}
    </>
  );
}
