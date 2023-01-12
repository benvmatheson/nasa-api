import { TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import './App.css';
import useNEOs from './useNEOs';

function App() {
  const {
    closestObject = {},
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchError,
    dateOrderError,
    dateLimitError
  } = useNEOs();
  const {
    name,
    close_approach_data: [
      {
        close_approach_date,
        miss_distance: {kilometers},
        is_potentially_hazardous_asteroid
      }
    ]
  } = closestObject

  return (
      <div className="App">
        <Typography variant='h1'>Skip it?</Typography>
        <p><Typography variant='subtitle'>
          Need to visit the in-laws? Thinking about exercising? 
          Probably not worth it if the world's ending that day. 
          Enter the dates in question to see the Near Earth Object most likely to get you out of trouble.
        </Typography></p>
        <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
        <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={endDate}
            onChange={setEndDate}
            renderInput={(params) => <TextField 
              {...params}
              error={dateOrderError}
              helperText={dateOrderError ? 'Start date must be before end date.' : null}
            />}
          />
        <div>
            {fetchError && <Typography className="error">{fetchError.message}</Typography>}
        </div>
        <div>
            {dateLimitError && <Typography className="error">{dateLimitError}</Typography>}
        </div>
        <div className='message-description'>
          {name && <Typography>{`The object that will pass the closest for this 
            date range is ${name} on ${close_approach_date}. It will miss the earth by 
            ${kilometers} kilometers. This ${is_potentially_hazardous_asteroid ? 'is' : 'is not'} 
            considered to be a potentially hazerdous asteroid.
            `}</Typography>}
        </div>
      </div>
  );
}

export default App;
