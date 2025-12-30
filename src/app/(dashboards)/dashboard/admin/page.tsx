"use client";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState, type ElementType } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const patientRegData = [] as patientRegData[];

type patientRegData = {
  id: string;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};

const COLORS = ["#309effff", "#35fdd9ff", "#ffc13bff", "#ff6f27ff"];

type UpcomingAppointment = {
  id: string;
  scheduledAt: string;
  patient: {
    id: string;
    user: {
      name: string | null;
    };
  };
  doctor: {
    id: string;
    user: {
      name: string | null;
    };
  };
};

type TopDoctor = {
  id: string;
  user: {
    name: string | null;
  };
  _count: {
    appointments: number;
  };
};

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  appointmentsByDept: { name: string | null; appointments: number }[];
  appointmentsByStatus: { name: string | null; value: number }[];
  upcomingAppointments: UpcomingAppointment[];
  topDoctors: TopDoctor[];
};

type SummaryCard = {
  title: string;
  value: number | string;
  icon: ElementType;
  accent: string;
  gradient: string;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/admin");
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="warning">No dashboard data available.</Alert>;
  }

  const theme = useTheme();

  const summaryData: SummaryCard[] = [
    {
      title: "Total Patients",
      value: data.totalPatients,
      icon: PeopleIcon,
      accent: "#22c55e",
      gradient:
        "linear-gradient(135deg, rgba(34, 197, 94, 0.22), rgba(16, 185, 129, 0.15))",
    },
    {
      title: "Total Doctors",
      value: data.totalDoctors,
      icon: MedicalServicesIcon,
      accent: "#38bdf8",
      gradient:
        "linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(59, 130, 246, 0.16))",
    },
    {
      title: "Appointments Today",
      value: data.appointmentsToday,
      icon: EventAvailableIcon,
      accent: "#f59e0b",
      gradient:
        "linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.18))",
    },
    {
      title: "Bed Occupancy",
      value: "78%", // Static for now
      icon: AirlineSeatIndividualSuiteIcon,
      accent: "#f97316",
      gradient:
        "linear-gradient(135deg, rgba(249, 115, 22, 0.22), rgba(244, 63, 94, 0.18))",
    },
  ];
  const gridStroke = alpha(
    theme.palette.text.primary,
    theme.palette.mode === "dark" ? 0.08 : 0.12,
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 800 }}>
        Admin Dashboard
      </Typography>
      <Stack spacing={3}>
        {/* Summary Cards */}
        <Grid container spacing={3}>
          {summaryData.map((item) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} lg={3} key={item.title}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    p: 2.5,
                    backgroundImage: item.gradient,
                    borderColor: alpha(item.accent, 0.2),
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 55%)",
                      opacity: theme.palette.mode === "dark" ? 0.5 : 0.7,
                      pointerEvents: "none",
                    }}
                  />
                  <Stack spacing={2} sx={{ position: "relative" }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          item.accent,
                          theme.palette.mode === "dark" ? 0.2 : 0.12,
                        ),
                        color: item.accent,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Charts and Lists */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Patient Registrations (Last 6 Months)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientRegData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Appointments by Department
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.appointmentsByDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="appointments"
                      fill={theme.palette.secondary.main}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointments by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.appointmentsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Performing Doctors
              </Typography>
              <List>
                {data.topDoctors.map((doctor) => (
                  <ListItem key={doctor.id}>
                    <ListItemAvatar>
                      <Avatar>{doctor.user?.name?.charAt(0) || "D"}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doctor.user?.name || "Doctor"}
                      secondary={`${doctor._count.appointments} appointments`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.upcomingAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.patient.user.name}</TableCell>
                      <TableCell>{appt.doctor.user.name}</TableCell>
                      <TableCell>
                        {new Date(appt.scheduledAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(appt.scheduledAt).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
