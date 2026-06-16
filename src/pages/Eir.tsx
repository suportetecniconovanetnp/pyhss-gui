/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, EirItem, EirAddItem } from '@components';
import {EirApi} from "../services/pyhss"
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
import {Eir as EirModel} from '@app/types/pyhss';
  
const eirTemplate = {
  imei: '',
  imsi: '',
  regex_mode: '0',
  match_response_code: '0'
}

const Eir = () => {
  const [eirs, setEIRS] = useState<EirModel[]>([]);
  const [dialogData, setDialogData] = useState<EirModel>(eirTemplate);
  const [openAdd, setOpenAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(-1);

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    EirApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data) => {
      const items = data.data as EirModel[];
      setEIRS(items);
      setCount(items.length < currentRowsPerPage
        ? currentPage * currentRowsPerPage + items.length
        : currentPage * currentRowsPerPage + items.length + 1);
    });
  }, []);

  React.useEffect(() => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    EirApi.lookupByImei(search.trim()).then((data => {
      setEIRS([data.data]);
      setCount(1);
      setPage(0);
    })).catch(() => {
      setEIRS([]);
      setCount(0);
      setPage(0);
    });
  }, [loadPage, page, rowsPerPage, search]);

  const refresh = () => {
    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    EirApi.lookupByImei(search.trim()).then((data => {
      setEIRS([data.data]);
      setCount(1);
    })).catch(() => {
      setEIRS([]);
      setCount(0);
    });
  }

  const handleDelete = (id: number) => {
    EirApi.delete(id).then((data) => {
      refresh();
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    setOpenAdd(false);
    setDialogData(eirTemplate);
    refresh();
  }
  const openEdit = (row: EirModel) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Equipment Identity Register" />
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
                        <TableCell>{i18n.t('inputFields.header.imei')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.imsi')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.regex_mode')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.match_response_code')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {eirs.map((row) => (
                        <EirItem key={row.eir_id} row={row}  deleteCallback={handleDelete} openEditCallback={openEdit} />
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
         <EirAddItem open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default Eir;
