import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MealFoodItem from './MealFoodItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ConfirmPopup from './ConfirmPopup'
import AlertToast from './AlertToast'
import { RemoveMeal, GetUser } from '../DataProvider'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 30,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  table: {
    minWidth: 650,
  },
  imageColumn: {
    width: 200,
  },
});

// Function to Format date string for meal
const formatDate = (date) => {
    let time = new Date(Date.parse(date));
    let minutes = time.getMinutes();
    if(`${minutes}`.length < 2) {
        minutes = `0${time.getMinutes()}`;
    }
    return `${time.getMonth()+1}/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${minutes}`;
};

export default function Meal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(false);
    const [alertType, setAlertType] = React.useState(false);

    const removeMealCallback = (id) => {
        RemoveMeal(id).then(res => {
            if(res.status === 200) {
                console.log(`DELETE RemoveMeal(${id}) 200: `, res);
                handleAlert('success', 'Meal removed.');
                props.refreshTrigger();
            }
            else {
                handleAlert('error', 'Error removing meal.');
            }
        });
    };

    const handleAlert = (aType, message) => {
        setMessage(message);
        setAlertType(aType);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // Calculate Total Calories for Meal
    var tc = 0;
    props.mealData.food.forEach(foodItem => {
        tc += foodItem.calories;
    });

    // map array of food for meal to MealFoodItem component
    var i = 0;
    let foodObjects = props.mealData.food.map(function(food){
        return <MealFoodItem
            food={food} 
            key={i++}
        />
    });

    // Define table for meal food items
    let foodTable = <p>No food found for meal.</p>;
    if(props.mealData.food.length && props.mealData.food.length > 0) {
        foodTable = 
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell align="left" className={classes.imageColumn}>Image</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Calories</TableCell>
                <TableCell align="left">Serving Size</TableCell>
                <TableCell align="left">Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {foodObjects}
            </TableBody>
            </Table>
            </TableContainer>
        ;
    }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Total Calories: {tc}
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {formatDate(props.mealData.date)}
        </Typography>

        {/* food items for meal */}
        {foodTable}

      </CardContent>

      {/* bottom card action buttons */}
      <CardActions>
        <Button size="small">Add Food</Button>
        {/* <Button size="small">Remove Meal</Button> */}
        <ConfirmPopup 
            message = "Do you really want to remove this meal?"
            actionCallback = {removeMealCallback}
            id = {props.mealData.id}
        />
      </CardActions>

        <AlertToast 
            open={open}
            handleClose={handleClose}
            alertType={alertType}
            message={message}
        />

    </Card>
  );
}