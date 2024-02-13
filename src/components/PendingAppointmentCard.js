import React, { useState, Component } from 'react';
import {Box, Card, CardActions, CardContent, Typography, Button} from '@mui/material';
import '../App.css'

export default function PendingAppointmentCard (props) {
  return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography gutterBottom variant='h5'>
                    {props.name}
                </Typography>
                <Typography variant='body3'>
                    {props.date}
                </Typography>
                <Typography variant='body2'>
                    {props.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size='small'>Accept</Button>
                <Button size='small'>Decline</Button>
            </CardActions>
        </Card>
  )
}
