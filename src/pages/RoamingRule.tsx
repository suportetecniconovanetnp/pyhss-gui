/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, RoamingRuleItem, RoamingRuleAddModal} from '@components';
import {RoamingRuleApi, RoamingNetworkApi} from "../services/pyhss"
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
import {RoamingNetwork, RoamingRule} from '@app/types/pyhss';

const roamingRuleTemplate = {
  "roaming_rule_id": null,
  "roaming_network_id": null,
  "allow": true,
  "enabled": true
}

const RoamingRule = () => {
  const [items, setItems] = useState<RoamingRule[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogData, setDialogData] = useState<RoamingRule>(roamingRuleTemplate);
  const [editMode, setEditMode] = useState(false);
  const [network, setNetwork] = useState<RoamingNetwork[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(-1);

  const getSearchText = React.useCallback((row: RoamingRule, allNetworks: RoamingNetwork[]) => {
    const currentNetwork = allNetworks.find((item) => item.roaming_network_id === row.roaming_network_id);
    return `${String(row.roaming_rule_id ?? '')} ${String(row.allow)} ${String(row.enabled)} ${String(currentNetwork?.name ?? '')} ${String(currentNetwork?.mcc ?? '')}${String(currentNetwork?.mnc ?? '')}`.toLowerCase();
  }, []);

  const loadNetworks = React.useCallback(() => {
    fetchAllPages<RoamingNetwork>((params) => RoamingNetworkApi.getAll(params)).then(setNetwork);
  }, []);

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    RoamingRuleApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data => {
      const nextItems = data.data as RoamingRule[];
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

    Promise.all([
      fetchAllPages<RoamingRule>((params) => RoamingRuleApi.getAll(params)),
      fetchAllPages<RoamingNetwork>((params) => RoamingNetworkApi.getAll(params))
    ]).then(([allRules, allNetworks]) => {
      setNetwork(allNetworks);
      const filteredItems = allRules.filter((item) => getSearchText(item, allNetworks).includes(normalized));
      setItems(filteredItems);
      setCount(filteredItems.length);
      setPage(0);
    });
  }, [getSearchText, loadPage, page, rowsPerPage]);

  React.useEffect(() => {
    loadNetworks();
  }, [loadNetworks]);

  React.useEffect(() => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }, [loadPage, page, rowsPerPage, runSearch, search]);

  const refresh = () => {
    loadNetworks();
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }

  const handleDelete = (id: number) => {
    RoamingRuleApi.delete(id).then((data) => {
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setDialogData(roamingRuleTemplate);
    setOpenAdd(false);
    refresh();
  }
  const openEdit = (row: RoamingRule) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Roaming Rules" />
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
                        <TableCell>{i18n.t('inputFields.header.id')}</TableCell>
                        <TableCell>{i18n.t('generic.network')}</TableCell>
                        <TableCell>{i18n.t('generic.allowed')}</TableCell>
                        <TableCell>{i18n.t('generic.enabled')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row) => (
                        <RoamingRuleItem checked={false} key={row.roaming_rule_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} network={network} />
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
        <RoamingRuleAddModal open={openAdd} handleClose={handleAddClose}  data={dialogData} edit={editMode} onError={() => {}} />
      </section>
    </div>
  );
};

export default RoamingRule;
