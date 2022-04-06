import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
    position: 'absolute',
    borderRadius: theme.shape.borderRadius,
    right: 25,
    width: '150px',
    backgroundColor: 'white',
    border: '1px solid lightBlue'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(3)})`
    }
}));

export const AppHeader = (props) => {
    return (
        <Box>
            <AppBar style={{ backgroundColor: '#fff4e2' }}>
                <Toolbar>
                    <Search>
                        <IconButton
                            style={{
                                height: '100%',
                                position: 'absolute',
                                visibility: 'visible'
                            }}
                        >
                            <SearchIcon style={{ color: 'black' }} />
                        </IconButton>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => {
                                props.searchByKey(e.target.value);
                            }}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
