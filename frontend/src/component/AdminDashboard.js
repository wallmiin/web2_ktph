import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  AppBar, Toolbar, Divider, Alert
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel, Logout, Coffee, Favorite } from '@mui/icons-material';
import '../styles/global.css';

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

const FormComponent = ({ title, fields, onSubmit, onCancel, buttonLabel, buttonIcon }) => (
    <Box sx={{ mb: 4, p: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-color)' }}>
        {title}
      </Typography>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((field, index) => (
            field.type === 'select' ? (
                <FormControl key={index} fullWidth variant="outlined">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                      value={field.value}
                      label={field.label}
                      onChange={field.onChange}
                      variant="outlined"
                  >
                    {field.options.map((option, idx) => (
                        <MenuItem key={idx} value={option.value}>
                          {option.label}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            ) : (
                <TextField
                    key={index}
                    label={field.label}
                    type={field.type || 'text'}
                    value={field.value}
                    onChange={field.onChange}
                    required={field.required || false}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { color: 'var(--text-color)' } }}
                />
            )
        ))}
        <Box display="flex" gap={2}>
          <Button
              variant="contained"
              sx={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', py: 1.5 }}
              startIcon={buttonIcon}
              type="submit"
          >
            {buttonLabel}
          </Button>
          {onCancel && (
              <Button
                  variant="outlined"
                  sx={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', py: 1.5 }}
                  startIcon={<Cancel />}
                  onClick={onCancel}
              >
                Hủy
              </Button>
          )}
        </Box>
      </form>
    </Box>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' });
  const [newTable, setNewTable] = useState({ tableNumber: '', content: '', status: 'AVAILABLE', bookedBy: '' });
  const [editUser, setEditUser] = useState(null);
  const [editTable, setEditTable] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchTables()]);
      } catch (err) {
        console.error('Fetch data failed:', err);
      }
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    const data = await apiCall('get', 'http://localhost:8080/api/admin/users', null, setError);
    setUsers(data);
  };

  const fetchTables = async () => {
    const data = await apiCall('get', 'http://localhost:8080/api/admin/tables', null, setError);
    setTables(data);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await apiCall('post', 'http://localhost:8080/api/admin/users', newUser, setError);
    await fetchUsers();
    setNewUser({ username: '', password: '', role: 'USER' });
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    await apiCall('post', 'http://localhost:8080/api/admin/tables', newTable, setError);
    await fetchTables();
    setNewTable({ tableNumber: '', content: '', status: 'AVAILABLE', bookedBy: '' });
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user, password: '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await apiCall('put', `http://localhost:8080/api/admin/users/${editUser.id}`, editUser, setError);
    await fetchUsers();
    setEditUser(null);
  };

  const handleEditTable = (table) => {
    setEditTable({ ...table });
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    await apiCall('put', `http://localhost:8080/api/admin/tables/${editTable.id}`, editTable, setError);
    await fetchTables();
    setEditTable(null);
  };

  const handleDeleteUser = async (id) => {
    await apiCall('delete', `http://localhost:8080/api/admin/users/${id}`, null, setError);
    await fetchUsers();
  };

  const handleDeleteTable = async (id) => {
    await apiCall('delete', `http://localhost:8080/api/admin/tables/${id}`, null, setError);
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
              Trang Quản Trị
            </Typography>
            <IconButton onClick={handleLogout} title="Đăng Xuất">
              <Logout />
            </IconButton>
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
              <Favorite sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
              Quản Lý Người Dùng
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormComponent
                title="Tạo Người Dùng"
                fields={[
                  {
                    label: 'Tên Người Dùng',
                    value: newUser.username,
                    onChange: (e) => setNewUser({ ...newUser, username: e.target.value }),
                    required: true,
                  },
                  {
                    label: 'Mật Khẩu',
                    type: 'password',
                    value: newUser.password,
                    onChange: (e) => setNewUser({ ...newUser, password: e.target.value }),
                    required: true,
                  },
                  {
                    type: 'select',
                    label: 'Vai Trò',
                    value: newUser.role,
                    onChange: (e) => setNewUser({ ...newUser, role: e.target.value }),
                    options: [
                      { value: 'USER', label: 'Người Dùng' },
                      { value: 'ADMIN', label: 'Quản Trị' },
                    ],
                  },
                ]}
                onSubmit={handleCreateUser}
                buttonLabel="Tạo Người Dùng"
                buttonIcon={<Add />}
            />

            {editUser && (
                <FormComponent
                    title="Sửa Người Dùng"
                    fields={[
                      {
                        label: 'Tên Người Dùng',
                        value: editUser.username,
                        onChange: (e) => setEditUser({ ...editUser, username: e.target.value }),
                        required: true,
                      },
                      {
                        label: 'Mật Khẩu Mới (tùy chọn)',
                        type: 'password',
                        value: editUser.password,
                        onChange: (e) => setEditUser({ ...editUser, password: e.target.value }),
                      },
                      {
                        type: 'select',
                        label: 'Vai Trò',
                        value: editUser.role,
                        onChange: (e) => setEditUser({ ...editUser, role: e.target.value }),
                        options: [
                          { value: 'USER', label: 'Người Dùng' },
                          { value: 'ADMIN', label: 'Quản Trị' },
                        ],
                      },
                    ]}
                    onSubmit={handleUpdateUser}
                    onCancel={() => setEditUser(null)}
                    buttonLabel="Cập Nhật"
                    buttonIcon={<Save />}
                />
            )}

            <Box sx={{ mb: 4, p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-color)' }}>
                Danh Sách Người Dùng
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên Người Dùng</TableCell>
                      <TableCell>Vai Trò</TableCell>
                      <TableCell align="right">Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.role === 'USER' ? 'Người Dùng' : 'Quản Trị'}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleEditUser(user)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteUser(user.id)} sx={{ color: 'var(--error-color)' }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4, color: 'var(--text-color)' }}>
              <Coffee sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
              Quản Lý Bàn
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormComponent
                title="Tạo Bàn"
                fields={[
                  {
                    label: 'Số Bàn',
                    value: newTable.tableNumber,
                    onChange: (e) => setNewTable({ ...newTable, tableNumber: e.target.value }),
                    required: true,
                  },
                  {
                    label: 'Nội Dung',
                    value: newTable.content,
                    onChange: (e) => setNewTable({ ...newTable, content: e.target.value }),
                  },
                  {
                    type: 'select',
                    label: 'Trạng Thái',
                    value: newTable.status,
                    onChange: (e) => setNewTable({ ...newTable, status: e.target.value }),
                    options: [
                      { value: 'AVAILABLE', label: 'Trống' },
                      { value: 'OCCUPIED', label: 'Đã Đặt' },
                    ],
                  },
                  {
                    label: 'Người Đặt (tùy chọn)',
                    value: newTable.bookedBy,
                    onChange: (e) => setNewTable({ ...newTable, bookedBy: e.target.value }),
                  },
                ]}
                onSubmit={handleCreateTable}
                buttonLabel="Tạo Bàn"
                buttonIcon={<Add />}
            />

            {editTable && (
                <FormComponent
                    title="Sửa Bàn"
                    fields={[
                      {
                        label: 'Số Bàn',
                        value: editTable.tableNumber,
                        onChange: (e) => setEditTable({ ...editTable, tableNumber: e.target.value }),
                        required: true,
                      },
                      {
                        label: 'Nội Dung',
                        value: editTable.content,
                        onChange: (e) => setEditTable({ ...editTable, content: e.target.value }),
                      },
                      {
                        type: 'select',
                        label: 'Trạng Thái',
                        value: editTable.status,
                        onChange: (e) => setEditTable({ ...editTable, status: e.target.value }),
                        options: [
                          { value: 'AVAILABLE', label: 'Trống' },
                          { value: 'OCCUPIED', label: 'Đã Đặt' },
                        ],
                      },
                      {
                        label: 'Người Đặt (tùy chọn)',
                        value: editTable.bookedBy || '',
                        onChange: (e) => setEditTable({ ...editTable, bookedBy: e.target.value }),
                      },
                    ]}
                    onSubmit={handleUpdateTable}
                    onCancel={() => setEditTable(null)}
                    buttonLabel="Cập Nhật"
                    buttonIcon={<Save />}
                />
            )}

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
                            <IconButton onClick={() => handleEditTable(table)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteTable(table.id)} sx={{ color: 'var(--error-color)' }}>
                              <Delete />
                            </IconButton>
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

export default AdminDashboard;