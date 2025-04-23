import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import '../styles/global.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
                role,
            });
            setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Đăng ký thất bại, vui lòng thử lại!');
        }
    };

    return (
        <div className="container-overlay">
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'var(--secondary-color)' }}>
                        <PersonAdd sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
                        Đăng Ký
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            label="Tên Người Dùng"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ style: { color: 'var(--text-color)' } }}
                        />
                        <TextField
                            label="Mật Khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ style: { color: 'var(--text-color)' } }}
                        />
                        <TextField
                            label="Vai Trò"
                            select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            fullWidth
                            variant="outlined"
                            SelectProps={{ native: true }}
                            InputLabelProps={{ style: { color: 'var(--text-color)' } }}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </TextField>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', py: 1.5 }}
                            type="submit"
                            fullWidth
                        >
                            Đăng Ký
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', py: 1.5 }}
                            onClick={() => navigate('/login')}
                            fullWidth
                        >
                            Đã có tài khoản? Đăng Nhập
                        </Button>
                    </form>
                </Box>
            </Container>
        </div>
    );
};

export default Register;