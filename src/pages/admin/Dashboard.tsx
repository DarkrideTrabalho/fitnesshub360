
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getPendingVacationRequests, handleVacationRequest, Vacation } from '@/services/vacationService';
import VacationApprovalCard from '@/components/VacationApprovalCard';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [pendingVacations, setPendingVacations] = useState<Vacation[]>([]);
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
        toast.error('Failed to load vacation requests');
      }
    } catch (error) {
      console.error('Error fetching vacations:', error);
      toast.error('Error loading vacation requests');
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
        toast.success(`Vacation request ${approved ? 'approved' : 'rejected'} successfully`);
      }
    } catch (error) {
      console.error('Error handling vacation approval:', error);
      toast.error('Error processing vacation request');
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard" role="admin">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Pending Vacation Approvals</h2>
          {loading ? (
            <p>Loading vacations...</p>
          ) : pendingVacations.length === 0 ? (
            <p>No pending vacation requests.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingVacations.map((vacation) => (
                <VacationApprovalCard
                  key={vacation.id}
                  vacation={{
                    id: vacation.id,
                    teacherName: vacation.teacher_name || 'Unknown Teacher',
                    startDate: vacation.start_date,
                    endDate: vacation.end_date,
                    reason: vacation.reason || 'No reason provided'
                  }}
                  onApprove={(id) => handleVacationApproval(id, true)}
                  onReject={(id) => handleVacationApproval(id, false)}
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
