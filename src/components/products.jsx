import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CardContent, CardActions, Button } from '@mui/material';


export default function ProductCard({ codProducto, nombre, marca, precioActual, descripcion, stock, addToCart }) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent sx={{ p: 2 }}>
                <Typography gutterBottom variant='h6' component="div">
                    {codProducto}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {marca}
                    <Typography gutterBottom variant="h4" component="div">
                        {nombre}
                    </Typography>
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    ${precioActual}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {descripcion}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Stock: {stock}
                </Typography>
            </CardContent>
            {addToCart && (
                <CardActions>
                    <Button onClick={() => addToCart({ codProducto, nombre, marca, precioActual, descripcion, stock })}>
                        Agregar al carrito
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

