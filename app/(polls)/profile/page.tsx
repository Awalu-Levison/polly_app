
import ProtectedRoute from "@/components/auth/protected-route";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>This is the profile page.</p>
      </div>
    </ProtectedRoute>
  );
}
