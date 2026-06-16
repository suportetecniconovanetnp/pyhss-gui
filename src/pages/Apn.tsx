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
import fetchAllPages from '@app/utils/fetchAllPages';
import {Apn as ApnModel, ChargingRule} from '@app/types/pyhss';
  
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
  const [apns, setAPNS] = useState<ApnModel[]>([]);
  const [dialogData, setDialogData] = useState<ApnModel>(apnTemplate);
  const [openAdd, setOpenAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [chargingRules, setChargingRules] = useState<ChargingRule[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(-1);

  const loadSupportingData = React.useCallback(() => {
    fetchAllPages<ChargingRule>((params) => ChargingRuleApi.getAll(params)).then(setChargingRules);
  }, []);

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    ApnApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data => {
      const items = data.data as ApnModel[];
      setAPNS(items);
      setCount(items.length < currentRowsPerPage
        ? currentPage * currentRowsPerPage + items.length
        : currentPage * currentRowsPerPage + items.length + 1);
    }))
  }, []);

  const runSearch = React.useCallback((term: string) => {
    const normalized = term.trim().toLowerCase();

    if (normalized === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    fetchAllPages<ApnModel>((params) => ApnApi.getAll(params)).then((allItems) => {
      const filteredItems = allItems.filter((item) =>
        [
          item.apn,
          item.apn_id,
          item.pgw_address,
          item.sgw_address,
          item.qci,
          item.ip_version
        ].some((value) => String(value ?? '').toLowerCase().includes(normalized))
      );

      setAPNS(filteredItems);
      setCount(filteredItems.length);
      setPage(0);
    });
  }, [loadPage, page, rowsPerPage]);

  React.useEffect(() => {
    loadSupportingData();
  }, [loadSupportingData]);

  React.useEffect(() => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }, [loadPage, page, rowsPerPage, runSearch, search]);

  const refresh = () => {
    loadSupportingData();
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
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
  const openEdit = (row: ApnModel) => {
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
                onChange={(event) => setSearch(event.target.value)}
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
                      {apns.map((row) => (
                        <ApnItem key={row.apn_id} row={row} chargingRules={chargingRules} deleteCallback={handleDelete} openEditCallback={openEdit} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={count}
                  onPageChange={(_event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                  }}
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
