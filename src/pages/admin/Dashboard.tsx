
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getPendingVacationRequests, handleVacationRequest } from '@/services/vacationService';
import VacationApprovalCard from '@/components/VacationApprovalCard';

const AdminDashboard = () => {
  const [pendingVacations, setPendingVacations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVacations();
  }, []);

  const fetchPendingVacations = async () => {
    setLoading(true);
    try {
      const result = await getPendingVacationRequests();
      if (result.success) {
        setPendingVacations(result.vacations || []);
      } else {
        console.error('Failed to fetch pending vacations');
      }
    } catch (error) {
      console.error('Error fetching vacations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVacationApproval = async (vacationId: string, approved: boolean) => {
    try {
      const result = await handleVacationRequest(vacationId, approved);
      if (result.success) {
        // Refresh the list of pending vacations
        fetchPendingVacations();
      }
    } catch (error) {
      console.error('Error handling vacation approval:', error);
    }
  };

  const formatDateRange = (vacation: any) => {
    // Ensure both start_date and end_date exist before formatting
    if (!vacation?.start_date || !vacation?.end_date) {
      return 'Invalid date range';
    }
    
    const start = new Date(vacation.start_date);
    const end = new Date(vacation.end_date);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Pending Vacation Approvals</h2>
          {loading ? (
            <p>Loading vacations...</p>
          ) : pendingVacations.length === 0 ? (
            <p>No pending vacation requests.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingVacations.map((vacation: any) => (
                <VacationApprovalCard
                  key={vacation.id}
                  teacherName={vacation.teacher_name || 'Unknown Teacher'}
                  dateRange={formatDateRange(vacation)}
                  reason={vacation.reason || 'No reason provided'}
                  onApprove={() => handleVacationApproval(vacation.id, true)}
                  onReject={() => handleVacationApproval(vacation.id, false)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
