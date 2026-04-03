const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://sdljeynmrmumvqkjxzjw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbGpleW5tcm11bXZxa2p4emp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODI3MzAsImV4cCI6MjA4OTg1ODczMH0.IE7M4yDKvfhQEwWaC6ljAIlM3loFR9l-2ii3J7niWSU";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;