import { describe, expect, it } from "vitest";

const url = "https://qdhzhluhjxtuklddzhle.supabase.co";
const publishableKey = "sb_publishable_sOZonJgMNSqTP4e7px_Y0Q_IwDyzZKM";

describe("Supabase configuration", () => {
  it("uses the supplied project URL and a publishable client key", () => {
    expect(new URL(url).hostname).toBe("qdhzhluhjxtuklddzhle.supabase.co");
    expect(publishableKey.startsWith("sb_publishable_")).toBe(true);
    expect(publishableKey.length).toBeGreaterThan(20);
  });

  it("can reach Supabase Auth settings with the publishable key", async () => {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: publishableKey },
    });
    expect(response.ok).toBe(true);
    const settings = await response.json();
    expect(settings).toHaveProperty("external");
  }, 15000);
});
