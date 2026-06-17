/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, TftItem, TftAddItem} from '@components';
import {TftApi} from "../services/pyhss"
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
import {Tft as TftModel} from '@app/types/pyhss';

const tftTemplate = {
  "tft_group_id": 1,
  "tft_string": "",
  "direction": 0
}

const Tft = () => {
  const [items, setItems] = useState<TftModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogData, setDialogData] = useState<TftModel>(tftTemplate);
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
    fetchAllPages<TftModel>((params) => TftApi.getAll(params))
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
    TftApi.delete(id).then(() => {
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setDialogData(tftTemplate);
    setOpenAdd(false);
    refresh();
  }
  const openEdit = (row: TftModel) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  if (isLoading) {
    return <LoadingPage title="Traffic Flow Template" />;
  }

  return (
    <div>
      <ContentHeader title="Traffic Flow Template" />
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
                        <TableCell>{i18n.t('inputFields.header.tftGroup')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.rule')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.direction')}</TableCell>
                        <TableCell>{i18n.t('generic.lastModified')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedItems.map((row) => (
                        <TftItem key={row.tft_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit} />
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
        <TftAddItem open={openAdd} handleClose={handleAddClose}  data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default Tft;
