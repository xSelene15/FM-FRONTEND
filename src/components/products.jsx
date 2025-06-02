import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


export default function IntroDivider({ nombre, marca, precioActual, descripcion, stock }) {
    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>
                <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        {nombre}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {marca}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        ${precioActual}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {descripcion}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Stock: {stock}
                </Typography>
            </Box>
            {/* ...rest of your card... */}
        </Card>
    );
}