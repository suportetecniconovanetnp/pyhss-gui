/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, ApnItem, ApnAddItem} from '@components';
import {ApnApi, ChargingRuleApi} from "../services/pyhss"
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import i18n from '@app/utils/i18n';
import useTableSearchPagination from '@app/hooks/useTableSearchPagination';
  
const apnTemplate = {
  "apn": "",
  "ip_version": 0,
  "pgw_address": null,
  "sgw_address": null,
  "charging_characteristics": "0800",
  "apn_ambr_dl": 0,
  "apn_ambr_ul": 0,
  "qci": 9,
  "arp_priority": 8,
  "arp_preemption_capability": false,
  "arp_preemption_vulnerability": false,
  "charging_rule_list": null,
  "nbiot": false
}

const Apn = () => {
  const [apns, setAPNS] = useState<any[]>([]);
  const [dialogData, setDialogData] = useState(apnTemplate);
  const [openAdd, setOpenAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [chargingRules, setChargingRules] = useState<any[]>([]);
  const {
    search,
    page,
    rowsPerPage,
    filteredItems,
    paginatedItems,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange
  } = useTableSearchPagination(apns);

  React.useEffect(() => {
    ApnApi.getAll().then((data => {
        setAPNS(data.data)
    }))
    ChargingRuleApi.getAll().then((data => {
        setChargingRules(data.data)
    }))
  }, []);

  const refresh = () => {
    ApnApi.getAll().then((data => {
        setAPNS(data.data)
    }))
    ChargingRuleApi.getAll().then((data => {
        setChargingRules(data.data)
    }))
  }

  const handleDelete = (id: number) => {
    ApnApi.delete(id).then((data) => {
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setOpenAdd(false);
    setDialogData(apnTemplate);
    refresh();
  }
  const openEdit = (row: any) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Access Point Name" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <TextField
                fullWidth
                id="search-field"
                label={i18n.t('generic.search')}
                onChange={handleSearchChange}
                size="small"
                value={search}
                variant="outlined"
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell/>
                        <TableCell>{i18n.t('inputFields.header.id')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.apn')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.nbiot')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.ipVersion')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.qci')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.sgw')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.pgw')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedItems.map((row) => (
                        <ApnItem key={row.apn_id} row={row} chargingRules={chargingRules} deleteCallback={handleDelete} openEditCallback={openEdit} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredItems.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                />
            </div>
          </div>
        </div>
        <SpeedDial
          ariaLabel={i18n.t('generic.add')}
          sx={{ position: 'absolute', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={() => handleAdd()}
          open={openAdd}
        />
        <ApnAddItem open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default Apn;
