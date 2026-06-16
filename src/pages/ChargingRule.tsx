/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, ChargingRuleItem, ChargingRuleAddItem} from '@components';
import {ChargingRuleApi} from "../services/pyhss"
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
import {ChargingRule as ChargingRuleModel} from '@app/types/pyhss';

const charging_ruleTemplate = {
  "rule_name": "",
  "qci": 0,
  "arp_priority": 0,
  "arp_preemption_capability": false,
  "arp_preemption_vulnerability": false,
  "mbr_dl": 0,
  "mbr_ul": 0,
  "gbr_dl": 0,
  "gbr_ul": 0,
  "tft_group_id": 0,
  "precedence": 0,
  "rating_group": 0
}

const ChargingRule = () => {
  const [items, setItems] = useState<ChargingRuleModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogData, setDialogData] = useState<ChargingRuleModel>(charging_ruleTemplate);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(-1);

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    ChargingRuleApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data => {
      const nextItems = data.data as ChargingRuleModel[];
      setItems(nextItems);
      setCount(nextItems.length < currentRowsPerPage
        ? currentPage * currentRowsPerPage + nextItems.length
        : currentPage * currentRowsPerPage + nextItems.length + 1);
    }));
  }, []);

  const runSearch = React.useCallback((term: string) => {
    const normalized = term.trim().toLowerCase();

    if (normalized === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    fetchAllPages<ChargingRuleModel>((params) => ChargingRuleApi.getAll(params)).then((allItems) => {
      const filteredItems = allItems.filter((item) =>
        [
          item.charging_rule_id,
          item.rule_name,
          item.qci,
          item.tft_group_id,
          item.precedence,
          item.rating_group
        ].some((value) => String(value ?? '').toLowerCase().includes(normalized))
      );

      setItems(filteredItems);
      setCount(filteredItems.length);
      setPage(0);
    });
  }, [loadPage, page, rowsPerPage]);

  React.useEffect(() => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }, [loadPage, page, rowsPerPage, runSearch, search]);

  const refresh = () => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }

  const handleDelete = (id: number) => {
    ChargingRuleApi.delete(id).then((data) => {
      console.log(id, data);
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setOpenAdd(false);
    setDialogData(charging_ruleTemplate);
    refresh();
  }
  const openEdit = (row: ChargingRuleModel) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Charging Rules" />
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
                        <TableCell>{i18n.t('inputFields.header.name')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.id')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.qci')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.tftGroup')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.mbr_dl')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.mbr_ul')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.gbr_dl')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.gbr_ul')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.arpPriority')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.arpPreemptionCapability')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.arpPreemptionVulnerability')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.precedence')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.ratingGroup')}</TableCell>
                        <TableCell>{i18n.t('generic.lastModified')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row) => (
                        <ChargingRuleItem key={row.charging_rule_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} />
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
          ariaLabel="Add"
          sx={{ position: 'absolute', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={() => handleAdd()}
          open={openAdd}
        />
        <ChargingRuleAddItem open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default ChargingRule;
