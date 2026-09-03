import { getCurrentAdmin } from "@/lib/currentAdmin";
import { Topbar } from "@/components/admin/Topbar";
import AdminAvatarUpload from "@/components/AdminAvatarUpload";

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  return (
    <div>
      <Topbar admin={admin} title="Profile" />
      <div className="max-w-xl space-y-4 p-5 sm:p-8">
        <AdminAvatarUpload admin={admin} />
      </div>
    </div>
  );
}
