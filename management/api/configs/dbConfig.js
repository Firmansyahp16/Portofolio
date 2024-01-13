require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.URL, process.env.KEY);

module.exports = supabase;
