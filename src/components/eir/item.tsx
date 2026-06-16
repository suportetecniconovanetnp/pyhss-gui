import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { DeleteDialog } from '@components';
import {Eir} from '@app/types/pyhss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';

const EirItem = (props: {
  row: Eir,
  deleteCallback: (id: number) => void,
  openEditCallback: (row: Eir) => void
}) => {
  const { row, deleteCallback, openEditCallback } = props;
  const regex_mode = ['exact matching','loose matching'];
  const match_response_code = ['Whitelist','Blacklist','Greylist'];

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
        </TableCell>
	<TableCell>{row.eir_id}</TableCell>
        <TableCell>{row.imei}</TableCell>
        <TableCell>{row.imsi}</TableCell>
        <TableCell>{regex_mode[Number(row.regex_mode ?? 0)]}</TableCell>
	<TableCell>{match_response_code[Number(row.match_response_code ?? 0)]}</TableCell>
        <TableCell>
          <Button onClick={() => openEditCallback(row)}><FontAwesomeIcon icon={faEdit} /></Button>
          <DeleteDialog id={row.eir_id!} callback={deleteCallback}/>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default EirItem;
