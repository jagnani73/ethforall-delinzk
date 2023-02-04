import { createClient, SupabaseClient } from "@supabase/supabase-js";
class SupabaseService {
  private static db: SupabaseClient | null = null;
  private constructor() {}
  public static async initSupabase() {
    SupabaseService.db = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    console.log("Supabase initiated successfully!");
  }
  public static async getSupabase() {
    if (this.db) {
      return this.db;
    } else {
      await this.initSupabase();
      return this.db;
    }
  }
}

export default SupabaseService;
