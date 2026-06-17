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
import LoadingPage from '@app/components/LoadingPage';
import useTableSearchPagination from '@app/hooks/useTableSearchPagination';
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
  const [isLoading, setIsLoading] = useState(true);
  const {
    search,
    page,
    rowsPerPage,
    filteredItems,
    paginatedItems,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange
  } = useTableSearchPagination(items);

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    fetchAllPages<ChargingRuleModel>((params) => ChargingRuleApi.getAll(params))
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = () => {
    loadData();
  };

  const handleDelete = (id: number) => {
    ChargingRuleApi.delete(id).then(() => {
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

  if (isLoading) {
    return <LoadingPage title="Charging Rules" />;
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
                      {paginatedItems.map((row) => (
                        <ChargingRuleItem key={row.charging_rule_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} />
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
        <ChargingRuleAddItem open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default ChargingRule;
