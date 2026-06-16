/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, RoamingNetworkAddModal, RoamingNetworkItem, RoamingNetworkAddItem} from '@components';
import {RoamingNetworkApi} from "../services/pyhss"
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

const roamingNetworkTemplate = {
  "roaming_network_id": null,
  "name": "",
  "preference": 0,
  "mcc": "",
  "mnc": ""
}

const RoamingNetwork = () => {
  const [items, setItems] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogData, setDialogData] = useState(roamingNetworkTemplate);
  const [editMode, setEditMode] = useState(false);
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

  React.useEffect(() => {
    RoamingNetworkApi.getAll().then((data => {
      setItems(data.data)
    }));
  }, []);

  const refresh = () => {
    RoamingNetworkApi.getAll().then((data => {
      setItems(data.data)
    }));
  }

  const handleDelete = (id: number) => {
    RoamingNetworkApi.delete(id).then((data) => {
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setDialogData(roamingNetworkTemplate);
    setOpenAdd(false);
    refresh();
  }
  const openEdit = (row: any) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Roaming Networks" />
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
                        <TableCell>{i18n.t('inputFields.header.name')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.mcc')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.mnc')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.preference')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedItems.map((row) => (
                        <RoamingNetworkItem checked={false} checkboxCallback={undefined} key={row.roaming_network_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} />
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
          sx={{ position: 'absolute', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={() => handleAdd()}
          open={openAdd}
        />
        <RoamingNetworkAddModal open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} onError={() => {}} />
      </section>
    </div>
  );
};

export default RoamingNetwork;
