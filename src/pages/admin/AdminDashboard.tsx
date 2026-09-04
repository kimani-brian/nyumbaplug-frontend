import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldIcon, UsersIcon, Building2Icon, FlagIcon, HistoryIcon, ClockIcon, AlertTriangleIcon, FileCheckIcon } from '../../utils/icons';
import { VerificationQueue } from '../../components/admin/VerificationQueue';
import { RevokeModal } from '../../components/admin/RevokeModal';
import { AuditLogView } from '../../components/admin/AuditLogView';
import { ReportsQueue } from '../../components/admin/ReportsQueue';
import { CustomersList } from '../../components/admin/CustomersList';
import { PropertyManagersList } from '../../components/admin/PropertyManagersList';
import { LandlordProfile, PropertyManagerView, CustomerView, AdminAuditLog, PropertyReport } from '../../types';
import { api } from '../../services/api';

type Tab = 'verifications' | 'managers' | 'customers' | 'reports' | 'audit';

type RevokeTarget = LandlordProfile | PropertyManagerView | { id: string; full_name?: string; national_id_number?: string };

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('verifications');
  const [pending, setPending] = useState<LandlordProfile[]>([]);
  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [managers, setManagers] = useState<PropertyManagerView[]>([]);
  const [selectedRevokeLandlord, setSelectedRevokeLandlord] = useState<RevokeTarget | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [p, r, l, c, a] = await Promise.all([
        api.getPendingVerifications(),
        api.getReports(),
        api.getAuditLogs(),
        api.getCustomers(),
        api.getAllPropertyManagers(),
      ]);
      setPending(p);
      setReports(r);
      setLogs(l);
      setCustomers(c);
      setManagers(a);
    } catch (e) {
      console.error('Failed to load admin data', e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleResolveReport = async (reportId: string) => {
    await api.resolveReport(reportId);
    loadData();
  };

  const handleVerifyManager = async (managerId: string) => {
    if (!window.confirm('Verify this property manager? They will regain access to list properties.')) return;
    try {
      await api.approveLandlord(managerId);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to verify property manager');
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number; alert?: boolean }[] = [
    { key: 'verifications', label: 'Verifications', icon: <ShieldIcon size={15} />, count: pending.length, alert: pending.length > 0 },
    { key: 'managers', label: 'Property Managers', icon: <Building2Icon size={15} />, count: managers.length },
    { key: 'customers', label: 'Customers', icon: <UsersIcon size={15} />, count: customers.length },
    { key: 'reports', label: 'Reports', icon: <FlagIcon size={15} />, count: reports.filter(r => !r.resolved).length, alert: reports.some(r => !r.resolved) },
    { key: 'audit', label: 'Audit Log', icon: <HistoryIcon size={15} /> },
  ];

  const stats = [
    { label: 'Pending verifications', value: pending.length, icon: <ClockIcon size={16} className="text-amber-400" />, tint: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Verified property managers', value: managers.filter(m => m.verification_status === 'verified').length, icon: <FileCheckIcon size={16} className="text-primary" />, tint: 'bg-primary-light border-primary/20' },
    { label: 'Open reports', value: reports.filter(r => !r.resolved).length, icon: <AlertTriangleIcon size={16} className="text-red-400" />, tint: 'bg-red-500/10 border-red-500/20' },
    { label: 'Total customers', value: customers.length, icon: <UsersIcon size={16} className="text-primary" />, tint: 'bg-panel-strong border-line' },
  ];

  const activeTab = tabs.find(t => t.key === tab)!;

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Admin Console</p>
          <h1 className="display font-semibold text-3xl text-fg">Welcome back</h1>
          <p className="text-sm text-fg/60 mt-1">Manage verifications, property managers, customers, reports, and the audit trail.</p>
        </div>
        <button
          onClick={loadData}
          className="btn-outline !py-2 self-start sm:self-auto"
        >
          <HistoryIcon size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-panel rounded-2xl border border-line p-4 flex items-center gap-3`}>
            <div className="bg-panel-strong rounded-xl p-2.5 shadow-sm shrink-0">{s.icon}</div>
            <div>
              <div className="display font-bold text-2xl text-fg leading-none">{s.value}</div>
              <div className="text-[11px] text-fg/50 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-1 bg-panel border border-line rounded-2xl p-1.5 shadow-soft">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              tab === t.key
                ? 'bg-primary text-white shadow'
                : 'text-fg/60 hover:text-fg hover:bg-panel-strong'
            }`}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                t.alert ? 'bg-red-500 text-white' : tab === t.key ? 'bg-white/20 text-white' : 'bg-panel-strong text-fg/60'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-fg/80 uppercase tracking-wider">
          {activeTab.label}
        </h2>
        <span className="text-xs text-fg/40">{activeTab.alert ? 'Action needed' : 'All clear'}</span>
      </div>

      <div>
        {tab === 'verifications' && (
          <VerificationQueue
            pendingList={pending}
            onRefresh={loadData}
            onOpenRevoke={profile => setSelectedRevokeLandlord(profile)}
          />
        )}
        {/* managers tab */}
        {tab === 'managers' && (
          <PropertyManagersList
            managers={managers}
            onViewProperties={id => navigate(`/admin/property-managers/${id}/properties`)}
            onViewProfile={id => navigate(`/admin/property-managers/${id}/profile`)}
            onOpenRevoke={manager => setSelectedRevokeLandlord(manager)}
            onVerifyManager={handleVerifyManager}
          />
        )}
        {tab === 'customers' && (
          <CustomersList
            customers={customers}
            onViewProfile={id => navigate(`/admin/customers/${id}/profile`)}
          />
        )}
        {tab === 'reports' && (
          <ReportsQueue
            reports={reports}
            onResolve={handleResolveReport}
            onRevokeManager={rep =>
              setSelectedRevokeLandlord({
                id: rep.landlord_id!,
                full_name: rep.landlord_name,
              })
            }
          />
        )}
        {tab === 'audit' && <AuditLogView logs={logs} />}
      </div>

      <RevokeModal
        isOpen={!!selectedRevokeLandlord}
        onClose={() => setSelectedRevokeLandlord(null)}
        landlord={selectedRevokeLandlord}
        onSuccess={loadData}
      />
    </main>
  );
};
