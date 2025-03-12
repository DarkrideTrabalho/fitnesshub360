
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
    
    // Check for vacations starting today
    const { data: startingVacations, error: startError } = await supabase
      .from('vacations')
      .select(`
        id,
        teacher_id,
        teacher_name,
        start_date,
        end_date
      `)
      .eq('start_date', today)
      .eq('approved', true);
      
    if (startError) {
      throw new Error(`Error fetching starting vacations: ${startError.message}`);
    }
    
    // Check for vacations ending today
    const { data: endingVacations, error: endError } = await supabase
      .from('vacations')
      .select(`
        id,
        teacher_id,
        teacher_name,
        start_date,
        end_date
      `)
      .eq('end_date', today)
      .eq('approved', true);
      
    if (endError) {
      throw new Error(`Error fetching ending vacations: ${endError.message}`);
    }
    
    // Process starting vacations
    for (const vacation of startingVacations || []) {
      console.log(`Processing vacation start for teacher ${vacation.teacher_name}`);
      
      // Update teacher profile
      const { error: updateError } = await supabase
        .from('teacher_profiles')
        .update({ on_vacation: true })
        .eq('id', vacation.teacher_id);
        
      if (updateError) {
        console.error(`Error updating teacher vacation status: ${updateError.message}`);
        continue;
      }
      
      // Create notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: `${vacation.teacher_name} Started Vacation`,
          message: `${vacation.teacher_name} is on vacation from ${vacation.start_date} to ${vacation.end_date}.`,
          type: 'vacation_start',
          read: false
        });
        
      if (notifError) {
        console.error(`Error creating notification: ${notifError.message}`);
      }
    }
    
    // Process ending vacations
    for (const vacation of endingVacations || []) {
      console.log(`Processing vacation end for teacher ${vacation.teacher_name}`);
      
      // Update teacher profile
      const { error: updateError } = await supabase
        .from('teacher_profiles')
        .update({ on_vacation: false })
        .eq('id', vacation.teacher_id);
        
      if (updateError) {
        console.error(`Error updating teacher vacation status: ${updateError.message}`);
        continue;
      }
      
      // Create notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: `${vacation.teacher_name} Returned from Vacation`,
          message: `${vacation.teacher_name} has returned from vacation and is now available.`,
          type: 'vacation_end',
          read: false
        });
        
      if (notifError) {
        console.error(`Error creating notification: ${notifError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: {
          starting: startingVacations?.length || 0,
          ending: endingVacations?.length || 0
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing vacation monitor:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
