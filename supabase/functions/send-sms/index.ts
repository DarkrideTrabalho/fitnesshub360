
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSMSRequest {
  phoneNumber: string;
  message: string;
}

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
    // Get request body
    const { phoneNumber, message }: SendSMSRequest = await req.json();

    if (!phoneNumber || !message) {
      return new Response(
        JSON.stringify({ error: "Phone number and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending SMS to ${phoneNumber}: ${message}`);

    // In a real implementation, you would use a service like Twilio, MessageBird, etc.
    // Example with Twilio (if credentials were provided):
    /*
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: twilioNumber,
          Body: message,
        }),
      }
    );

    const twilioData = await twilioResponse.json();
    */

    // For now, simulate a successful response
    const simulatedResponse = {
      success: true,
      messageId: crypto.randomUUID(),
      phoneNumber,
      message: "SMS sent successfully",
    };

    // Create a registration record in the database
    const registrationId = crypto.randomUUID();
    const { error: dbError } = await supabase
      .from("student_registrations")
      .insert({
        id: registrationId,
        phone_number: phoneNumber,
        registration_link: `https://fitnesshub.com/register/${registrationId}`,
        status: "pending",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

    if (dbError) {
      console.error("Error creating registration record:", dbError);
    }

    return new Response(
      JSON.stringify(simulatedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing SMS request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
