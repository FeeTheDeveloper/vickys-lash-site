import type { Metadata } from "next";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { checkAdmin } from "@/lib/admin";
import { listUpcoming, type UpcomingBooking } from "@/lib/bookings";
import { MO, WD, label, money } from "@/lib/schedule";
import { BOOKING_MODE, SITE } from "@/lib/site";
import { cancelAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Vicky's Lash Lab",
  robots: { index: false, follow: false },
};

async function getUpcoming(): Promise<{ rows: UpcomingBooking[]; error: string | null }> {
  try {
    return { rows: await listUpcoming(), error: null };
  } catch {
    return { rows: [], error: "Couldn't reach the database. Is Supabase connected?" };
  }
}

function LogOut() {
  return (
    <SignOutButton>
      <button className="btn btn-ghost" type="button">
        Log out
      </button>
    </SignOutButton>
  );
}

function longDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return `${WD[d.getDay()]}, ${MO[d.getMonth()]} ${d.getDate()}`;
}

export default async function AdminPage() {
  const admin = await checkAdmin();

  if (!admin.ok) {
    return (
      <main className="admin-wrap">
        <div className="admin-note">
          <h1>No studio access</h1>
          <p className="sub">
            This account isn&apos;t on the studio allowlist. Ask the owner to add your
            email to <code>ADMIN_EMAILS</code>.
          </p>
          <div style={{ marginTop: 20 }}>
            <LogOut />
          </div>
        </div>
      </main>
    );
  }

  if (BOOKING_MODE === "acuity") {
    return (
      <main className="admin-wrap">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Studio</span>
            <h1>Welcome back</h1>
            <p className="sub">Signed in as {admin.email}</p>
          </div>
          <div className="admin-actions">
            <UserButton />
            <LogOut />
          </div>
        </div>
        <div className="admin-hub">
          <a className="admin-tile" href={SITE.acuityUrl} target="_blank" rel="noopener">
            <strong>Appointments</strong>
            <span>Bookings and ${SITE.depositUsd} deposits live in Acuity →</span>
          </a>
          <a className="admin-tile" href={SITE.instagramUrl} target="_blank" rel="noopener">
            <strong>Instagram</strong>
            <span>@{SITE.instagramHandle} →</span>
          </a>
          <a className="admin-tile" href="/">
            <strong>View site</strong>
            <span>See what clients see →</span>
          </a>
        </div>
      </main>
    );
  }

  const { rows, error } = await getUpcoming();

  // Group by date for a calendar-style read.
  const groups = new Map<string, UpcomingBooking[]>();
  for (const r of rows) {
    const list = groups.get(r.date) ?? [];
    list.push(r);
    groups.set(r.date, list);
  }

  return (
    <main className="admin-wrap">
      <div className="admin-head">
        <div>
          <span className="eyebrow">Studio</span>
          <h1>Upcoming bookings</h1>
          <p className="sub">
            {rows.length} appointment{rows.length === 1 ? "" : "s"} from today onward.
          </p>
        </div>
        <div className="admin-actions">
          <UserButton />
          <LogOut />
        </div>
      </div>

      {error ? (
        <div className="admin-note">
          <p className="form-err">{error}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-note">
          <p className="sub">No upcoming bookings yet.</p>
        </div>
      ) : (
        <div className="admin-groups">
          {[...groups.entries()].map(([date, list]) => (
            <section key={date} className="admin-day">
              <h2>{longDate(date)}</h2>
              <div className="admin-rows">
                {list.map((b) => (
                  <div key={b.id} className="admin-card">
                    <div className="admin-time">
                      {label(b.start)}
                      <span>{label(b.end)}</span>
                    </div>
                    <div className="admin-info">
                      <div className="admin-svc">{b.service}</div>
                      <div className="admin-client">{b.name}</div>
                      <div className="admin-contact">
                        {b.email && <a href={`mailto:${b.email}`}>{b.email}</a>}
                        {b.phone && <a href={`tel:${b.phone}`}>{b.phone}</a>}
                      </div>
                    </div>
                    <div className="admin-side">
                      <div className="admin-price">{money(b.price)}</div>
                      <form action={cancelAction}>
                        <input type="hidden" name="id" value={b.id} />
                        <button className="admin-cancel" type="submit">
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
