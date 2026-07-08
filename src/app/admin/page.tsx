import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MO, WD, iso, label, money } from "@/lib/schedule";
import LoginForm from "./LoginForm";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Vicky's Lash Lab",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  date: string;
  start: number;
  end: number;
  service: string;
  price: number;
  name: string;
  email: string | null;
  phone: string | null;
};

async function getUpcoming(): Promise<{ rows: Row[]; error: string | null }> {
  const today = iso(new Date());
  try {
    const rows = await prisma.booking.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: "asc" }, { start: "asc" }],
    });
    return { rows, error: null };
  } catch {
    return { rows: [], error: "Couldn't reach the database. Is DATABASE_URL set?" };
  }
}

function longDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return `${WD[d.getDay()]}, ${MO[d.getMonth()]} ${d.getDate()}`;
}

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="admin-wrap">
        <div className="admin-note">
          <h1>Admin isn&apos;t set up yet</h1>
          <p className="sub">
            Add an <code>ADMIN_PASSWORD</code> to your environment variables, then
            reload this page to sign in.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="admin-wrap">
        <LoginForm />
      </main>
    );
  }

  const { rows, error } = await getUpcoming();

  // Group by date for a calendar-style read.
  const groups = new Map<string, Row[]>();
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
        <form action={logoutAction}>
          <button className="btn btn-ghost" type="submit">
            Sign out
          </button>
        </form>
      </div>

      {error ? (
        <div className="admin-note">
          <p className="form-err">{error}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-note">
          <p className="sub">No upcoming bookings yet. New ones show up here instantly.</p>
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
                        {b.email && (
                          <a href={`mailto:${b.email}`}>{b.email}</a>
                        )}
                        {b.phone && (
                          <a href={`tel:${b.phone}`}>{b.phone}</a>
                        )}
                      </div>
                    </div>
                    <div className="admin-price">{money(b.price)}</div>
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
