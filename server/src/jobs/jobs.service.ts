import SupabaseService from "../services/supabase.service";

export const getAllJobs = async () => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("jobs").select(`
  *,
  org:orgs(id,name)
  `);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data;
};
