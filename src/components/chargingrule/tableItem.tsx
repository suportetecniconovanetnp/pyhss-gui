import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { DeleteDialog, NetworkBandwidthFormatter } from '@components';
import {ChargingRule} from '@app/types/pyhss';

const ChargingRuleItem = (props: {
  row: ChargingRule,
  deleteCallback: (id: number) => void,
  openEditCallback: (row: ChargingRule) => void
}) => {
  const { row, deleteCallback, openEditCallback } = props;

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.rule_name}
        </TableCell>
        <TableCell>{row.charging_rule_id}</TableCell>
        <TableCell>{row.qci}</TableCell>
        <TableCell>{row.tft_group_id}</TableCell>
        <TableCell><NetworkBandwidthFormatter data={row.mbr_dl} /></TableCell>
        <TableCell><NetworkBandwidthFormatter data={row.mbr_ul} /></TableCell>
        <TableCell><NetworkBandwidthFormatter data={row.gbr_dl} /></TableCell>
        <TableCell><NetworkBandwidthFormatter data={row.gbr_ul} /></TableCell>
        <TableCell>{row.arp_priority}</TableCell>
        <TableCell>{(row.arp_preemption_capability?'Yes':'No')}</TableCell>
        <TableCell>{(row.arp_preemption_vulnerability?'Yes':'No')}</TableCell>
        <TableCell>{row.precedence}</TableCell>
        <TableCell>{row.rating_group}</TableCell>
        <TableCell>{row.last_modified}</TableCell>
        <TableCell>
          <Button onClick={() => openEditCallback(row)}><i className="fas fa-edit"></i></Button>
          <DeleteDialog id={row.charging_rule_id!} callback={deleteCallback}/>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ChargingRuleItem;
