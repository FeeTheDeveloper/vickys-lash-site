"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="admin-login">
      <h1>Studio login</h1>
      <p className="sub">Enter the admin password to view bookings.</p>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
        />
      </div>
      {state.error && <div className="form-err">{state.error}</div>}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
