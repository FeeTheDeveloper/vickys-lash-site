"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin";
import { cancelBooking } from "@/lib/bookings";

export async function cancelAction(formData: FormData) {
  const admin = await checkAdmin();
  if (!admin.ok) throw new Error("Not authorized");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await cancelBooking(id, admin.email);
  revalidatePath("/admin");
}
