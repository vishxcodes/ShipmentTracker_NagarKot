import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Check, 
  X, 
  Server, 
  Database, 
  Activity 
} from 'lucide-react';
import MetricCard from './MetricCard';
import ShipmentFilters from './ShipmentFilters';
import ShipmentTable from './ShipmentTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import CreateShipmentModal from './CreateShipmentModal';
import ShipmentDetails from './ShipmentDetails';
import { fetchShipmentSummary, fetchShipments } from '../services/api';

export default function Dashboard({ health }) {
  // Summary KPI State
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Shipments List & Filter State
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  // Modals & Active Selections
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState(null);

  // Toast / Feedback State
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const data = await fetchShipmentSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load shipment summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Load Shipments
  const loadShipments = useCallback(async (pageToLoad = 1, currentSearch = search, currentStatus = statusFilter) => {
    setLoadingList(true);
    setListError('');
    try {
      const data = await fetchShipments({
        search: currentSearch,
        status: currentStatus,
        page: pageToLoad,
        limit: 10,
      });
      setShipments(data.shipments);
      setPagination(data.pagination);
    } catch (err) {
      setListError(err.message || 'Failed to load shipment records.');
    } finally {
      setLoadingList(false);
    }
  }, [search, statusFilter]);

  // Initial Load
  useEffect(() => {
    loadSummary();
    loadShipments(1, search, statusFilter);
  }, []);

  // Search handler: triggers search and auto-resets page to 1
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    loadShipments(1, newSearch, statusFilter);
  };

  // Status Filter handler: auto-resets page to 1
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    loadShipments(1, search, newStatus);
  };

  // Pagination Change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadShipments(newPage, search, statusFilter);
    }
  };

  // Callback on successful creation
  const handleShipmentCreated = (newShipment) => {
    showToast(`Shipment ${newShipment.trackingNumber} created successfully!`, 'success');
    loadSummary();
    loadShipments(1, search, statusFilter);
    // Optionally open details view for newly created shipment
    setSelectedTrackingNumber(newShipment.trackingNumber);
  };

  // Callback on successful status update
  const handleStatusUpdated = (updatedShipment) => {
    showToast(`Status for ${updatedShipment.trackingNumber} updated to ${updatedShipment.status}!`, 'success');
    loadSummary();
    loadShipments(pagination.page, search, statusFilter);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    loadShipments(1, '', '');
  };

  const isConnected = health?.status === 'ok' && health?.database?.status === 'connected';

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-medium shadow-md transition-all animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-[#161b22] text-[#3fb950] border-[#238636]/60 shadow-black/60'
              : 'bg-[#161b22] text-[#f85149] border-[#da3633]/60 shadow-black/60'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-[#3fb950]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#f85149]" />
            )}
            <span className="text-[#f0f6fc]">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:opacity-70 rounded text-[#8b949e] hover:text-[#f0f6fc]"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <MetricCard
          label="Total Shipments"
          value={summary ? summary.total : '—'}
          icon={Package}
          description="All logged records"
          accentColor="text-[#58a6ff]"
          badgeColor="bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/35"
          onClick={() => handleStatusChange('')}
          active={statusFilter === ''}
        />
        <MetricCard
          label="Booked"
          value={summary ? summary.booked : '—'}
          icon={Clock}
          description="Pending pickup"
          accentColor="text-[#79c0ff]"
          badgeColor="bg-[#1f6feb]/15 text-[#79c0ff] border-[#1f6feb]/35"
          onClick={() => handleStatusChange('BOOKED')}
          active={statusFilter === 'BOOKED'}
        />
        <MetricCard
          label="In Transit"
          value={summary ? summary.inTransit : '—'}
          icon={Truck}
          description="Active freight on road"
          accentColor="text-[#d29922]"
          badgeColor="bg-[#d29922]/15 text-[#d29922] border-[#d29922]/35"
          onClick={() => handleStatusChange('IN_TRANSIT')}
          active={statusFilter === 'IN_TRANSIT'}
        />
        <MetricCard
          label="Delivered"
          value={summary ? summary.delivered : '—'}
          icon={CheckCircle2}
          description="Successfully completed"
          accentColor="text-[#3fb950]"
          badgeColor="bg-[#238636]/15 text-[#3fb950] border-[#238636]/35"
          onClick={() => handleStatusChange('DELIVERED')}
          active={statusFilter === 'DELIVERED'}
        />
        <MetricCard
          label="Exceptions"
          value={summary ? summary.exceptions : '—'}
          icon={AlertTriangle}
          description="Delivery delays & holds"
          accentColor="text-[#f85149]"
          badgeColor="bg-[#da3633]/15 text-[#f85149] border-[#da3633]/35"
          onClick={() => handleStatusChange('EXCEPTION')}
          active={statusFilter === 'EXCEPTION'}
        />
      </div>

      {/* Shipment Filters & Action Bar */}
      <ShipmentFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={statusFilter}
        onStatusChange={handleStatusChange}
        onCreateClick={() => setIsCreateOpen(true)}
        onRefresh={() => {
          loadSummary();
          loadShipments(pagination.page, search, statusFilter);
        }}
        loading={loadingList || loadingSummary}
        totalCount={summary?.total || 0}
      />

      {/* Shipment Records Table / States */}
      <section aria-label="Shipments List">
        {loadingList ? (
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117]">
            <LoadingState message="Fetching live shipments..." />
          </div>
        ) : listError ? (
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117]">
            <ErrorState
              title="Unable to load shipments"
              message={listError}
              onRetry={() => loadShipments(pagination.page, search, statusFilter)}
            />
          </div>
        ) : shipments.length === 0 ? (
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117]">
            <EmptyState
              title={search || statusFilter ? 'No matching shipments' : 'No shipments registered yet'}
              message={
                search || statusFilter
                  ? 'Try modifying your search reference or clearing the status filter.'
                  : 'Start by creating your first logistics shipment record.'
              }
              isFiltered={Boolean(search || statusFilter)}
              onClearFilters={handleClearFilters}
              onCreateShipment={() => setIsCreateOpen(true)}
            />
          </div>
        ) : (
          <ShipmentTable
            shipments={shipments}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSelectDetails={(trackingNum) => setSelectedTrackingNumber(trackingNum)}
          />
        )}
      </section>

      {/* Create Shipment Modal */}
      {isCreateOpen && (
        <CreateShipmentModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleShipmentCreated}
        />
      )}

      {/* Shipment Details & Timeline Modal */}
      {selectedTrackingNumber && (
        <ShipmentDetails
          trackingNumber={selectedTrackingNumber}
          isOpen={Boolean(selectedTrackingNumber)}
          onClose={() => setSelectedTrackingNumber(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
