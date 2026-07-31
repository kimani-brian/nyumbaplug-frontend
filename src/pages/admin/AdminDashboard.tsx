import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Building2, Flag, History, Clock, AlertTriangle, FileCheck } from 'lucide-react';
import { VerificationQueue } from '../../components/admin/VerificationQueue';
import { RevokeModal } from '../../components/admin/RevokeModal';
import { AuditLogView } from '../../components/admin/AuditLogView';
import { ReportsQueue } from '../../components/admin/ReportsQueue';
import { CustomersList } from '../../components/admin/CustomersList';
import { AgentsList } from '../../components/admin/AgentsList';
import { LandlordProfile, AgentView, CustomerView, AdminAuditLog, PropertyReport } from '../../types';
import { api } from '../../services/api';

type Tab = 'verifications' | 'agents' | 'customers' | 'reports' | 'audit';

type RevokeTarget = LandlordProfile | AgentView | { id: string; full_name?: string; national_id_number?: string };

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('verifications');
  const [pending, setPending] = useState<LandlordProfile[]>([]);
  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [agents, setAgents] = useState<AgentView[]>([]);
  const [selectedRevokeLandlord, setSelectedRevokeLandlord] = useState<RevokeTarget | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [p, r, l, c, a] = await Promise.all([
        api.getPendingVerifications(),
        api.getReports(),
        api.getAuditLogs(),
        api.getCustomers(),
        api.getAllAgents(),
      ]);
      setPending(p);
      setReports(r);
      setLogs(l);
      setCustomers(c);
      setAgents(a);
    } catch (e) {
      console.error('Failed to load admin data', e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleResolveReport = async (reportId: string) => {
    await api.resolveReport(reportId);
    loadData();
  };

  const handleVerifyAgent = async (agentId: string) => {
    if (!window.confirm('Verify this agent? They will regain access to list properties.')) return;
    try {
      await api.approveLandlord(agentId);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to verify agent');
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number; alert?: boolean }[] = [
    { key: 'verifications', label: 'Verifications', icon: <Shield size={15} />, count: pending.length, alert: pending.length > 0 },
    { key: 'agents', label: 'Agents', icon: <Building2 size={15} />, count: agents.length },
    { key: 'customers', label: 'Customers', icon: <Users size={15} />, count: customers.length },
    { key: 'reports', label: 'Reports', icon: <Flag size={15} />, count: reports.filter(r => !r.resolved).length, alert: reports.some(r => !r.resolved) },
    { key: 'audit', label: 'Audit Log', icon: <History size={15} /> },
  ];

  const stats = [
    { label: 'Pending verifications', value: pending.length, icon: <Clock size={16} className="text-amber-600" />, tint: 'bg-amber-50 border-amber-100' },
    { label: 'Verified agents', value: agents.filter(a => a.verification_status === 'verified').length, icon: <FileCheck size={16} className="text-nyumba-emerald" />, tint: 'bg-emerald-50 border-emerald-100' },
    { label: 'Open reports', value: reports.filter(r => !r.resolved).length, icon: <AlertTriangle size={16} className="text-red-600" />, tint: 'bg-red-50 border-red-100' },
    { label: 'Total customers', value: customers.length, icon: <Users size={16} className="text-nyumba-navy" />, tint: 'bg-slate-100 border-slate-200' },
  ];

  const activeTab = tabs.find(t => t.key === tab)!;

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-nyumba-terracotta mb-1">Admin Console</p>
          <h1 className="display font-semibold text-3xl text-nyumba-ink">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Manage verifications, agents, customers, reports, and the audit trail.</p>
        </div>
        <button
          onClick={loadData}
          className="btn-outline !py-2 self-start sm:self-auto"
        >
          <History size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.tint} p-4 flex items-center gap-3`}>
            <div className="bg-white rounded-xl p-2.5 shadow-sm shrink-0">{s.icon}</div>
            <div>
              <div className="display font-bold text-2xl text-nyumba-ink leading-none">{s.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-1 bg-white border border-nyumba-line rounded-2xl p-1.5 shadow-soft">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              tab === t.key
                ? 'bg-nyumba-navy text-white shadow'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                t.alert ? 'bg-red-500 text-white' : tab === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
          {activeTab.label}
        </h2>
        <span className="text-xs text-slate-400">{activeTab.alert ? 'Action needed' : 'All clear'}</span>
      </div>

      <div>
        {tab === 'verifications' && (
          <VerificationQueue
            pendingList={pending}
            onRefresh={loadData}
            onOpenRevoke={profile => setSelectedRevokeLandlord(profile)}
          />
        )}
        {tab === 'agents' && (
          <AgentsList
            agents={agents}
            onViewProperties={id => navigate(`/admin/agents/${id}/properties`)}
            onViewProfile={id => navigate(`/admin/agents/${id}/profile`)}
            onOpenRevoke={agent => setSelectedRevokeLandlord(agent)}
            onVerifyAgent={handleVerifyAgent}
          />
        )}
        {tab === 'customers' && <CustomersList customers={customers} />}
        {tab === 'reports' && (
          <ReportsQueue
            reports={reports}
            onResolve={handleResolveReport}
            onRevokeAgent={rep =>
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
