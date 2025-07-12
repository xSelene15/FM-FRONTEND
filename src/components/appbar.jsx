import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const pages = [
    { label: 'Consultas', path: '/consultas' },
];

function ResponsiveAppBar(props) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    // Estado para el dólar
    const [dolar, setDolar] = useState({ value: null, date: null });

    const navigate = useNavigate();
    const user = props.user;

    useEffect(() => {
        fetch('http://34.204.114.72:8080/api/divisas/dolar')
            .then(res => res.json())
            .then(data => {
                const obs = data?.Series?.Obs?.[0]; 
                if (obs.value) {
                    setDolar({ value: obs.value, date: obs.indexDateString });
                }
                else {
                    const today = new Date();
                    const defaultDate = today.toISOString().split('T')[0];
                    setDolar({ value: 950, date: defaultDate });
                }
            })
            .catch(() => setDolar({ value: 950, date: new Date().toISOString().split('T')[0] }));
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <SquareFootIcon sx={{ fontSize: 30 , mr: 2 }}/>
                        FERREMAS
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuItem
                                onClick={() => {
                                    props.onCategoryClick();
                                    handleCloseNavMenu();
                                }}
                                sx={{ textAlign: 'center' }}
                            >
                                <Typography sx={{ textAlign: 'center' }}>Categorias</Typography>
                            </MenuItem>
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.label}
                                    onClick={() => {
                                        navigate(page.path);
                                        handleCloseNavMenu();
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                        }}
                    >
                        <SquareFootIcon sx={{ fontSize: 30 , mr: 2 }}/>
                        FERREMAS
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={props.onCategoryClick}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Categorias
                        </Button>
                        {/* Si está logueado, muestra Consultas */}
                        {user && (
                            <Button
                                key="Consultas"
                                onClick={() => navigate('/consultas')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Consultas
                            </Button>
                        )}
                        {/* Si NO está logueado, muestra Registro */}
                        {!user && pages
                            .filter(p => p.label === 'Registro')
                            .map((page) => (
                                <Button
                                    key={page.label}
                                    onClick={() => navigate(page.path)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.label}
                                </Button>
                            ))}
                    </Box>
                    {/* Dólar a la izquierda del carrito */}
                    {dolar.value && dolar.date && (
                        <Typography sx={{ color: 'white', mr: 3 }}>
                            Precio Dólar al día {dolar.date}: ${dolar.value}
                        </Typography>
                    )}
                    {/* Carrito solo si hay usuario logueado */}
                    {user && (
                        <Link to="/carrito/">
                            <ShoppingCartIcon sx={{ fontSize: 30 , mr: 3 }} />       
                        </Link>
                    )}
                    {/* Iniciar sesión al final de la AppBar si NO está logueado */}
                    {!user && (
                        <Button
                            key="Iniciar sesión"
                            onClick={() => navigate('/login')}
                            sx={{ my: 2, color: 'white', display: 'block', ml: 2 }}
                        >
                            Iniciar sesión
                        </Button>
                    )}
                    {/* Avatar solo si hay usuario logueado */}
                    {user && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user.nombre || user.correo} src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>Perfil</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { props.onLogout(); handleCloseUserMenu(); }}>
                                    <Typography sx={{ textAlign: 'center' }}>Cerrar sesión</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
