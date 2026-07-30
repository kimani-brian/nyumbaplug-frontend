import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Building2, Flag, History } from 'lucide-react';
import { VerificationQueue } from '../../components/admin/VerificationQueue';
import { RevokeModal } from '../../components/admin/RevokeModal';
import { AuditLogView } from '../../components/admin/AuditLogView';
import { ReportsQueue } from '../../components/admin/ReportsQueue';
import { CustomersList } from '../../components/admin/CustomersList';
import { AgentsList } from '../../components/admin/AgentsList';
import { LandlordProfile, AgentView, CustomerView, AdminAuditLog, PropertyReport } from '../../types';
import { api } from '../../services/api';

type Tab = 'verifications' | 'agents' | 'customers' | 'reports' | 'audit';

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('verifications');
  const [pending, setPending] = useState<LandlordProfile[]>([]);
  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [agents, setAgents] = useState<AgentView[]>([]);
  const [selectedRevokeLandlord, setSelectedRevokeLandlord] = useState<LandlordProfile | AgentView | null>(null);
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

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'verifications', label: 'Verifications', icon: <Shield size={16} /> },
    { key: 'agents', label: 'Agents', icon: <Building2 size={16} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={16} /> },
    { key: 'reports', label: 'Reports', icon: <Flag size={16} /> },
    { key: 'audit', label: 'Audit Log', icon: <History size={16} /> },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-nyumba-navy">Admin Console</h1>
        <p className="text-xs text-slate-500">Manage agents, customers, verification queue, reports, and audit trail</p>
      </div>

      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              tab === t.key
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'verifications' && (
          <VerificationQueue
            pendingList={pending}
            onRefresh={loadData}
            onOpenRevoke={profile => setSelectedRevokeLandlord(profile)}
          />
        )}
        {tab === 'agents' && <AgentsList agents={agents} onViewProperties={id => navigate(`/admin/agents/${id}/properties`)} onViewProfile={id => navigate(`/admin/agents/${id}/profile`)} onOpenRevoke={agent => setSelectedRevokeLandlord(agent)} onVerifyAgent={handleVerifyAgent} />}
        {tab === 'customers' && <CustomersList customers={customers} />}
        {tab === 'reports' && <ReportsQueue reports={reports} onResolve={handleResolveReport} />}
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
