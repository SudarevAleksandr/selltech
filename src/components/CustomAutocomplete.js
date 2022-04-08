import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button, TextField, Stack, MenuItem } from '@mui/material';


const Listbox = styled('ul')(
  ({ theme }) => `
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 130px;
  border-radius: 4px;
  z-index: 3;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);


class CustomAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          focus: false, 
          value:'', 
          searchValue:'', 
          userItem:'', 
          filteredList: this.getFilteredList(''), 
          listPosition:'down'
        };
        this.name = this.props.name;
    } 

    getFilteredList = (val) => { 
        return val ? this.props.data.filter(item => ~item.name.toLowerCase().indexOf(val.toLowerCase())) : this.props.data;
    }
    
    onChange = (e) => {
        this.setState({searchValue: e.target.value, filteredList: this.getFilteredList(e.target.value)});
    }
    
    changeUserItem  = (e) => {
       this.setState({userItem: e.target.value});
    }

    selectItem = (item) => {
        this.setState({searchValue: item.name, value: item.name, filteredList: this.getFilteredList(item.name)}, () => this.close(true));
    }
     
    deleteItem = (e, item) => {
        e.stopPropagation();
        this.props.data.forEach((elem, index, arr) => {
            if(elem == item) arr.splice(index, 1); 
        });
        this.clear();
    }

    clear = () => {
        this.setState({value: '', searchValue: '', filteredList: this.getFilteredList('')}, () => this.props.onChange(this));
    }
     
    addItem = () => {
        this.setState({value: this.state.userItem, searchValue: this.state.userItem});
        this.props.data.push({name: this.state.userItem, removable:true, id: new Date().valueOf() });
        this.setState({filteredList: this.getFilteredList(this.state.userItem), userItem: ''}, () => this.close(true));
    }
     
    open = ()=> {
      const item = this.сustomAutocompleteRef.current.getBoundingClientRect();
      const listPosition = document.documentElement.clientHeight / 2 > item.top + item.height / 2 ? 'down' : 'up';
      this.setState({focus:true, filteredList: this.getFilteredList(this.state.searchValue), listPosition: listPosition});
    } 
     
    close = (comlete)=> {
        comlete === true ? this.props.onChange(this) : this.setState({searchValue: this.state.value});
        this.setState({focus:false});
        document.removeEventListener( "click" , this.close);
    }

    сustomAutocompleteRef = React.createRef();

    render() {
      return (
      <div className='CustomAutocomplete'
          ref={this.сustomAutocompleteRef}
          onMouseEnter ={() => document.removeEventListener( "click" , this.close)} 
          onMouseLeave={() => document.addEventListener("click", this.close)}
      >      
              <div>
                  <TextField 
                    label = {this.props.label} 
                    sx = {{ width: 1 }}
                    onFocus = {this.open}
                    onChange={this.onChange}
                    value={this.state.searchValue}
                  />
                  <button className={'deleteButton CustomAutocomplete-clearButton' + (this.state.searchValue == '' ? '-none' : '')} onClick={this.clear}>
                      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                  </button>
              </div>
              {this.state.focus ? (
                  <div className={'CustomAutocomplete-listWrap CustomAutocomplete-listWrap-'+this.state.listPosition}>
                      <Listbox> 
                          {this.state.filteredList.map((item) => ( 
                              <MenuItem key={item.id} onClick={() => this.selectItem(item)}> 
                                    {item.name}
                                    {item.removable ? 
                                        <button className='deleteButton CustomAutocomplete-listWrap-deleteButton' onClick={(e) => this.deleteItem(e, item)}>
                                            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                        </button>
                                    : null}
                              </MenuItem>
                          ))}
                      </Listbox>
                      
                      <Stack className='CustomAutocomplete-footer' spacing={2}>
                          <TextField  sx={{ width: 1 }}  label={this.props.label} variant="outlined" value={this.state.userItem} onChange={this.changeUserItem}/>
                          <Stack direction="row-reverse" spacing={2}> 
                              <Button variant="contained" onClick={this.addItem}>Add</Button>
                          </Stack>
                      </Stack>
                  </div>
              ) : null}
          </div>
       )
    }
}



export default CustomAutocomplete;
