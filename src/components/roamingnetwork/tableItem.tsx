import React from 'react';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { DeleteDialog } from '@components';
import i18n from '@app/utils/i18n';
import {RoamingNetwork} from '@app/types/pyhss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';

const RoamingNetworkItem = (props: {
  row: RoamingNetwork,
  deleteCallback: (id: number) => void,
  openEditCallback: (row: RoamingNetwork) => void,
  checkboxCallback?: unknown,
  checked: boolean
}) => {
  const { row, deleteCallback, openEditCallback } = props;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {row.roaming_network_id}
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.mcc}</TableCell>
        <TableCell>{row.mnc}</TableCell>
        <TableCell>{row.preference}</TableCell>
        <TableCell>
          <Button onClick={() => openEditCallback(row)}><FontAwesomeIcon icon={faEdit} /></Button>
          <DeleteDialog id={row.roaming_network_id!} callback={deleteCallback}/>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default RoamingNetworkItem;
