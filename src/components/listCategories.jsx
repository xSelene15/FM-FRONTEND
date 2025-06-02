import * as React from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { ClickAwayListener, Menu } from '@mui/material';

export default function VirtualizedList({ handleCloseNavMenu }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://34.204.114.72:8080/api/categorias') // Use proxy if set up, or full URL if not
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    // Render each row
    const renderRow = ({ index, style }) => {
        const categoria = categories[index];
        if (!categoria) return null;
        return (
            <ListItem style={style} key={categoria.id} component="div" disablePadding>
                <ListItemButton onClick={handleCloseNavMenu}>
                    <ListItemText primary={categoria.nombre} />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <ClickAwayListener onClickAway={handleCloseNavMenu}>
            <Box

                sx={{
                    position: 'fixed',      // or 'absolute'
                    top: 80,                // adjust as needed (e.g., below your AppBar)
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1300,           // higher than most elements
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 2,
                }}
            >
                <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={categories.length}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
        </ClickAwayListener>
    );
}

