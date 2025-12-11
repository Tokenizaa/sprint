import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, getAllUsers, getTeamPerformanceReport } from '../services/apiIntegrationService';

const APITestComponent: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [teamReport, setTeamReport] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus(result.message);
    } catch (error) {
      setConnectionStatus('Error: ' + (error as Error).message);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    }
    setLoading(false);
  };

  const fetchTeamReport = async () => {
    setLoading(true);
    try {
      const result = await getTeamPerformanceReport();
      if (result.success && result.data) {
        setTeamReport(result.data);
      } else {
        setTeamReport([]);
      }
    } catch (error) {
      setTeamReport([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">API Integration Test</h2>
      
      <div className="mb-6">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        <p className="mt-2">{connectionStatus}</p>
      </div>

      <div className="mb-6">
        <button 
          onClick={fetchUsers}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Fetching...' : 'Fetch Users'}
        </button>
        <ul className="mt-2">
          {users.map(user => (
            <li key={user.id} className="border-b py-1">
              {user.name} - {user.role}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button 
          onClick={fetchTeamReport}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Team Report'}
        </button>
        <ul className="mt-2">
          {teamReport.map(member => (
            <li key={member.id} className="border-b py-1">
              {member.name}: {member.totalOfficialSales} official sales, {member.selfReportedSales} self-reported
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default APITestComponent;