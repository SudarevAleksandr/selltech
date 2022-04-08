import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import Virtualize from './components/autocompleteReact.js';
import CustomAutocomplete from './components/CustomAutocomplete.js';
import './App.css';

async function getDataFromSelltech(type, f){
    const reqType = {
        сompanyRelations: 'applicantIndividualCompanyRelations',
        сompanyPositions: 'applicantIndividualCompanyPositions'
    };
    const filter = f ? `(where:{column:NAME, operator:LIKE, value:"${f}"})` : '';
    const query = `{ ${reqType[type]} ${filter} {data {id name}}}`; 
    let response = await fetch('https://imperiasexa.ru/api.php?query='+query);
    response = await response.json();
    return response.data[(reqType[type])].data;
}



class App extends React.Component {
 
  constructor(props) {
      super(props);
      this.state = {
        entity: '', 
        сompanyRelations:'',
        сompanyPositions:'', 
        сompanyRelationsList:[], 
        сompanyPositionsList:[]
      };
      this.field = {
          '':[],
          'Individual':['firstName','lastName'],
          'Company':['companyName'],
      }
      this.getCompanyRelationsList();
      this.getCompanyPositionsList();
  }
 
  getCompanyRelationsList = () => {
      getDataFromSelltech('сompanyRelations').then(data => {
        this.setState({сompanyRelationsList: data});
      });
  }
  
  getCompanyPositionsList = () => {
      getDataFromSelltech('сompanyPositions', this.state.сompanyRelations).then(data => {
          this.setState({сompanyPositionsList: data});
      });
  }
 
  onChangeForm = (elem) => {
      this.setState({[elem.name]: elem.state.value}, () => {
        switch(elem.name){
          case 'сompanyRelations': this.getCompanyPositionsList(); break; 
          }
     });
  }
 
  selectEntity = (e) =>{
     this.setState({entity: e.target.value});
  }

  render() {
    return (
    <div className="App">
      <div className='formWrap'> 
      
       <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Entity</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Entity"
              onChange={this.selectEntity}
              value={this.state.entity}
            >
              <MenuItem value={'Individual'}>Individual</MenuItem>
              <MenuItem value={'Company'}>Company</MenuItem>
            </Select>
          </FormControl>

              
          <Virtualize/>
          
          
          {~this.field[this.state.entity].indexOf('firstName') ? <TextField id="outlined-basic" sx={{ width: 1 }} label="First Name" variant="outlined" /> : null}
          {~this.field[this.state.entity].indexOf('lastName') ? <TextField id="outlined-basic" sx={{ width: 1 }} label="Last Name" variant="outlined" /> : null}
          {~this.field[this.state.entity].indexOf('companyName') ? <TextField id="outlined-basic" sx={{ width: 1 }} label="Company Name" variant="outlined" /> : null}


          <CustomAutocomplete onChange={this.onChangeForm} name={'сompanyRelations'} data={this.state.сompanyRelationsList} label="Relation to the Company" />
          <CustomAutocomplete onChange={this.onChangeForm} name={'сompanyPositions'} data={this.state.сompanyPositionsList} label="Position to the Company" />
          <Stack direction="row-reverse" spacing={2}> 
              <Button variant="contained">Add</Button>
              <Button variant="outlined">Cancel</Button>
          </Stack>
        </Stack>
      </div>
    </div>
    )
  }
}


export default App;
