import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {FormChangeHandler, FormValue} from '@app/types/pyhss';

const SelectField = (props: {
  children: React.ReactNode,
  id: string, 
  value: FormValue,
  label: string,
  helper: string,
  onChange: FormChangeHandler,
  required?: boolean, 
  error?: string 
}) => {
  const {value, onChange, helper, label, id, children, error='', required=false} = props;
  const reqT = ((value === ''||String(value) === "0")  && required)
  const err = (error !== '' || reqT)
  const errValue = (reqT?'Field is required!':(err?error:''))
  const normalizedValue = typeof value === 'boolean' ? String(value) : (value ?? '');

  const onChangeLocal = (e: any) => { 
    const {name, value: nextValue} = e.target;

    if (typeof value === 'boolean') {
      onChange(name, nextValue === 'true');
      return;
    }

    if (typeof value === 'number') {
      onChange(name, Number(nextValue));
      return;
    }

    onChange(name, nextValue);
  } 

  return (
    <FormControl fullWidth>
      <InputLabel id={`${id}_label`}>{label}{err&&` ${errValue}`}</InputLabel>
      <Select
        required={required}
        error={err} 
        labelId={`${id}_label`}
        value={normalizedValue}
        onChange={onChangeLocal}
        name={id}
        aria-describedby={`${id}-helper`}
      >
        {children}
      </Select>
      <FormHelperText id={`${id}}-helper`}>{helper}</FormHelperText>
    </FormControl>

  )
}

export default SelectField;

