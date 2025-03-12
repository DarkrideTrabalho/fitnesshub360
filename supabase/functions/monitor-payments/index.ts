
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Find payments that are due today or were due in the past but not marked as overdue yet
    const { data: overduePayments, error: paymentsError } = await supabase
      .from('student_payments')
      .select(`
        id,
        student_id,
        amount,
        due_date,
        status
      `)
      .lte('due_date', today) // Less than or equal to today
      .eq('status', 'pending'); // Still pending
      
    if (paymentsError) {
      throw new Error(`Error fetching payments: ${paymentsError.message}`);
    }
    
    console.log(`Found ${overduePayments?.length || 0} overdue payments`);
    
    // Process each overdue payment
    const processed = [];
    for (const payment of overduePayments || []) {
      console.log(`Processing overdue payment for student ID ${payment.student_id}`);
      
      // Update payment status to overdue
      const { error: updateError } = await supabase
        .from('student_payments')
        .update({ status: 'overdue' })
        .eq('id', payment.id);
        
      if (updateError) {
        console.error(`Error updating payment status: ${updateError.message}`);
        continue;
      }
      
      // Get student information
      const { data: student, error: studentError } = await supabase
        .from('student_profiles')
        .select('name')
        .eq('id', payment.student_id)
        .single();
        
      if (studentError) {
        console.error(`Error fetching student: ${studentError.message}`);
        continue;
      }
      
      // Create notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: `Overdue Payment for ${student?.name || 'Student'}`,
          message: `Payment of ${payment.amount.toFixed(2)}€ was due on ${payment.due_date}.`,
          type: 'payment_overdue',
          read: false
        });
        
      if (notifError) {
        console.error(`Error creating notification: ${notifError.message}`);
      } else {
        processed.push(payment.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: processed.length,
        totalOverdue: overduePayments?.length || 0
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing payment monitor:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
