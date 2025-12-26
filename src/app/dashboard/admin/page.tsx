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
import { useEffect, useState } from "react";
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

  const summaryData = [
    {
      title: "Total Patients",
      value: data.totalPatients,
      icon: <PeopleIcon fontSize="large" color="primary" />,
    },
    {
      title: "Total Doctors",
      value: data.totalDoctors,
      icon: <MedicalServicesIcon fontSize="large" color="info" />,
    },
    {
      title: "Appointments Today",
      value: data.appointmentsToday,
      icon: <EventAvailableIcon fontSize="large" color="secondary" />,
    },
    {
      title: "Bed Occupancy",
      value: "78%", // Static for now
      icon: <AirlineSeatIndividualSuiteIcon fontSize="large" color="error" />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>
      <Stack spacing={3}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryData.map((item) => (
            <Stack spacing={2} key={item.title}>
              <Grid
                spacing={2}
                sx={{ height: "100%", display: "flex", alignItems: "center" }}
              >
                <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                  <Box sx={{ mr: 2 }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h6">{item.value}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.title}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Stack>
          ))}
        </Grid>

        {/* Charts and Lists */}
        <Grid sx={{ height: "100%", xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Registrations (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientRegData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointments by Department
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.appointmentsByDept}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Stack>
      <Stack spacing={2}>
        <Grid sx={{ height: "100%", xs: 12, md: 6 }}>
          <Card>
            <CardContent>
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
                    outerRadius={80}
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

        <Grid sx={{ height: "100%", xs: 12, md: 6 }}>
          <Card>
            <CardContent>
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

        <Grid sx={{ height: "100%", xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              <Table>
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
      </Stack>
    </Box>
  );
}
