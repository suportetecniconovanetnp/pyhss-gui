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
import LoadingPage from '@app/components/LoadingPage';
import useTableSearchPagination from '@app/hooks/useTableSearchPagination';
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
  const [isLoading, setIsLoading] = useState(true);

  const getSearchText = React.useCallback((row: RoamingRule, allNetworks: RoamingNetwork[]) => {
    const currentNetwork = allNetworks.find((item) => item.roaming_network_id === row.roaming_network_id);
    return `${String(row.roaming_rule_id ?? '')} ${String(row.allow)} ${String(row.enabled)} ${String(currentNetwork?.name ?? '')} ${String(currentNetwork?.mcc ?? '')}${String(currentNetwork?.mnc ?? '')}`.toLowerCase();
  }, []);

  const {
    search,
    page,
    rowsPerPage,
    filteredItems,
    paginatedItems,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange
  } = useTableSearchPagination(items, (item) => getSearchText(item, network));

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    Promise.all([
      fetchAllPages<RoamingRule>((params) => RoamingRuleApi.getAll(params)),
      fetchAllPages<RoamingNetwork>((params) => RoamingNetworkApi.getAll(params))
    ]).then(([allRules, allNetworks]) => {
      setItems(allRules);
      setNetwork(allNetworks);
    }).finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = () => {
    loadData();
  };

  const handleDelete = (id: number) => {
    RoamingRuleApi.delete(id).then(() => {
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

  if (isLoading) {
    return <LoadingPage title="Roaming Rules" />;
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
                        <TableCell>{i18n.t('inputFields.header.id')}</TableCell>
                        <TableCell>{i18n.t('generic.network')}</TableCell>
                        <TableCell>{i18n.t('generic.allowed')}</TableCell>
                        <TableCell>{i18n.t('generic.enabled')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedItems.map((row) => (
                        <RoamingRuleItem checked={false} key={row.roaming_rule_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} network={network} />
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
          ariaLabel="Add"
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
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
