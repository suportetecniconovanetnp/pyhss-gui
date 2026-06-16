import React from 'react';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { DeleteDialog } from '@components';
import i18n from '@app/utils/i18n';
import {RoamingNetwork, RoamingRule} from '@app/types/pyhss';

const RoamingRuleItem = (props: {
  row: RoamingRule,
  deleteCallback: (id: number) => void,
  openEditCallback: (row: RoamingRule) => void,
  checked: boolean,
  network: RoamingNetwork[],
}) => {
  const { row, deleteCallback, openEditCallback, network } = props;
  const currentNetwork = network.find((a: RoamingNetwork) => a.roaming_network_id === row.roaming_network_id);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{row.roaming_rule_id}</TableCell>
        <TableCell component="th" scope="row">
          {(currentNetwork || {'name':''}).name}
          &nbsp;({(currentNetwork || {'mcc':''}).mcc}
          {(currentNetwork || {'mnc':''}).mnc})
        </TableCell>
        <TableCell>{(row.allow?i18n.t('generic.yes'):i18n.t('generic.no'))}</TableCell>
        <TableCell>{(row.enabled?i18n.t('generic.yes'):i18n.t('generic.no'))}</TableCell>
        <TableCell>
          <Button onClick={() => openEditCallback(row)}><i className="fas fa-edit"></i></Button>
          <DeleteDialog id={row.roaming_rule_id!} callback={deleteCallback}/>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default RoamingRuleItem;
