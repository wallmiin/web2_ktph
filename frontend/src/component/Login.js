import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Coffee, Login as LoginIcon } from '@mui/icons-material';
import '../styles/global.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            await axios.post(
                'http://localhost:8080/api/auth/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true,
                }
            );

            const response = await axios.get('http://localhost:8080/api/auth/current-user', {
                withCredentials: true,
            });
            const role = response.data.role;

            if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'USER') {
                navigate('/user');
            } else {
                setError('Vai trò không hợp lệ!');
            }
        } catch (err) {
            const errorMessage = err.response?.data || 'Đăng nhập thất bại, vui lòng thử lại!';
            setError(errorMessage);
        }
    };

    return (
        <div className="container-overlay">
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'var(--secondary-color)' }}>
                        <Coffee sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--secondary-color)' }} />
                        Đăng Nhập
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', py: 1.5 }}
                            startIcon={<LoginIcon />}
                            type="submit"
                            fullWidth
                        >
                            Đăng Nhập
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', py: 1.5 }}
                            onClick={() => navigate('/register')}
                            fullWidth
                        >
                            Đăng Ký
                        </Button>
                    </form>
                </Box>
            </Container>
        </div>
    );
};

export default Login;