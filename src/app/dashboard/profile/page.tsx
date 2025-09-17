"use client";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (e: any) {
      setErr(e.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!profile) return;

    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to update profile");
      }
      setMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (e: any) {
      setErr(e.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (err) {
    return <Alert severity="error">{err}</Alert>;
  }

  if (!profile) {
    return <Alert severity="warning">Could not load profile.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Card>
        <CardHeader
          title="Profile Details"
          action={
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <form onSubmit={handleSave}>
            <Stack spacing={3} sx={{ maxWidth: 600 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  {profile.name.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Typography variant="h6">{profile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.role}
                  </Typography>
                </div>
              </Box>
              <TextField
                label="Full Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, name: e.target.value } : null))
                }
                disabled={!isEditing}
                fullWidth
              />
              <TextField
                label="Email Address"
                value={profile.email ?? "N/A"}
                disabled
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={profile.phone ?? "N/A"}
                onChange={(e) =>
                  setProfile((p) =>
                    p ? { ...p, phone: e.target.value } : null,
                  )
                }
                disabled={!isEditing}
                fullWidth
              />
              {isEditing && (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Save Changes
                </Button>
              )}
              {msg && (
                <Alert severity="success" onClose={() => setMsg(null)}>
                  {msg}
                </Alert>
              )}
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
