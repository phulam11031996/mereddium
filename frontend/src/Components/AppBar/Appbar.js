import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';


const Search = styled('div')(({ theme }) => ({
  position: 'fixed',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 40,
  right: 25,
  width: '200px'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '80%',
  },
}));


export default function SearchAppBar(props) {
  return (
    <Box>
      <AppBar position="fixed" style = {{backgroundColor: "#fff4e2"}}>
        <Toolbar>

          <Search style = {{ backgroundColor: "white", border: "1px solid grey"}}>
            <IconButton
              style={{
              height: '100%',
              position: 'absolute',
              visibility: 'visible',
              }}
            >
            <SearchIcon style = {{color: "black"}}/>
            </IconButton>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => { props.searchByKey(e.target.value)}}
			        style = {{color: "black"}}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
