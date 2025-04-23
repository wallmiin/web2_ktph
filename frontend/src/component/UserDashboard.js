import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Paper, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  AppBar, Toolbar, Divider, Button
} from '@mui/material';
import { Logout, Coffee } from '@mui/icons-material';
import '../styles/global.css';

// Utility function để xử lý API call
const apiCall = async (method, url, data = null, setError) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    const errorMessage = err.response
        ? `${method.toUpperCase()} thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : `${method.toUpperCase()} thất bại: Lỗi mạng`;
    setError(errorMessage);
    throw err;
  }
};

const UserDashboard = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin người dùng hiện tại
        const userData = await apiCall('get', 'http://localhost:8080/api/user/current-user', null, setError);
        setCurrentUser(userData.username);
        await fetchTables();
      } catch (err) {
        console.error('Fetch data failed:', err);
      }
    };
    fetchData();
  }, []);

  const fetchTables = async () => {
    const data = await apiCall('get', 'http://localhost:8080/api/user/tables', null, setError);
    setTables(data);
  };

  const handleBookTable = async (id, currentStatus) => {
    if (currentStatus === 'OCCUPIED') {
      setError('Bàn này đã được đặt, vui lòng chọn bàn khác!');
      return;
    }

    await apiCall('put', `http://localhost:8080/api/user/tables/${id}`, { status: 'OCCUPIED' }, setError);
    await fetchTables();
  };

  const handleCancelBooking = async (id) => {
    await apiCall('put', `http://localhost:8080/api/user/tables/${id}`, { status: 'AVAILABLE' }, setError);
    await fetchTables();
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
      alert('Đăng xuất thành công! ☕');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Đăng xuất thất bại, vui lòng thử lại.');
    }
  };

  return (
      <>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'var(--text-color)' }}>
              <Coffee sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
              Trang Người Dùng
            </Typography>
            <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ color: 'var(--secondary-color)', fontWeight: 500 }}
            >
              Đăng Xuất
            </Button>
          </Toolbar>
        </AppBar>

        <div className="container-overlay">
          <Container maxWidth="lg">
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                  {error}
                </Alert>
            )}

            <Typography variant="h5" gutterBottom sx={{ mt: 4, color: 'var(--text-color)' }}>
              <Coffee sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
              Quản Lý Bàn
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4, p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-color)' }}>
                Danh Sách Bàn
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Số Bàn</TableCell>
                      <TableCell>Trạng Thái</TableCell>
                      <TableCell>Người Đặt</TableCell>
                      <TableCell align="right">Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tables.map(table => (
                        <TableRow key={table.id}>
                          <TableCell>{table.tableNumber}</TableCell>
                          <TableCell>{table.status === 'AVAILABLE' ? 'Trống' : 'Đã Đặt'}</TableCell>
                          <TableCell>{table.bookedBy || 'Chưa có'}</TableCell>
                          <TableCell align="right">
                            {table.status === 'AVAILABLE' ? (
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', py: 1 }}
                                    onClick={() => handleBookTable(table.id, table.status)}
                                >
                                  Đặt Bàn
                                </Button>
                            ) : (
                                table.bookedBy === currentUser ? (
                                    <Button
                                        variant="outlined"
                                        sx={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', py: 1 }}
                                        onClick={() => handleCancelBooking(table.id)}
                                    >
                                      Hủy Đặt
                                    </Button>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                      Không thể đặt
                                    </Typography>
                                )
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </div>
      </>
  );
};

export default UserDashboard;