import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { DeleteDialog } from '@components';
import {Tft} from '@app/types/pyhss';

const TftItem = (props: {
  row: Tft,
  deleteCallback: (id: number) => void,
  openEditCallback: (row: Tft) => void
}) => {
  const { row, deleteCallback, openEditCallback } = props;

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.tft_group_id}
        </TableCell>
        <TableCell>{row.tft_string}</TableCell>
        <TableCell>{row.direction}</TableCell>
        <TableCell>{row.last_modified}</TableCell>
        <TableCell>
          <Button onClick={() => openEditCallback(row)}><i className="fas fa-edit"></i></Button>
          <DeleteDialog id={row.tft_id!} callback={deleteCallback}/>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default TftItem;
