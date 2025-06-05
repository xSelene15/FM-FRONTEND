import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';


const drawerWidth = 240;

const pages = [
    { label: 'Inicio', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Inbox', path: '/dashboard/inbox', icon: <MailIcon /> },
    { label: 'Pedidos', path: '/dashboard/pedidos', icon: <ShoppingCartIcon /> },
    { label: 'Productos', path: '/dashboard/productos', icon: <InventoryIcon /> },
];
const pages2 = [
    { label: 'Usuarios', path: '/dashboard/usuarios', icon: <PeopleIcon /> },

];

export default function ClippedDrawer() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        top: 64,
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {pages.map((page) => (
                            <ListItem key={page.label}  className="drawer-text" disablePadding>
                                <ListItemButton component={Link} to={page.path}>
                                    <ListItemIcon>
                                        {page.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={page.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {pages2.map((page) => (
                            <ListItem key={page.label}  className="drawer-text" disablePadding>
                                <ListItemButton component={Link} to={page.path}>
                                    <ListItemIcon>
                                         {page.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={page.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
