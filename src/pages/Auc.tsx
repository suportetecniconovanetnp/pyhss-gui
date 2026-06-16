/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import {ContentHeader, AucItem, AucAddModal, ErrorDialog} from '@components';
import {AucApi} from "../services/pyhss"
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useSearchParams } from "react-router-dom";
import i18n from '@app/utils/i18n';
import {Auc as AucModel} from '@app/types/pyhss';

const AucPySimModal = React.lazy(() => import('../components/auc/pySimModal'));

const aucTemplate = {
  "ki": "",
  "opc": "",
  "amf": "",
  "sqn": 0,
  "iccid": "",
  "imsi": "",
  "batch_name": "",
  "sim_vendor": "",
  "esim": false,
  "lpa": "",
  "pin1": "",
  "pin2": "",
  "puk1": "",
  "puk2": "",
  "kid": "",
  "psk": "",
  "des": "",
  "adm1": "",
  "misc1": "",
  "misc2": "",
  "misc3": "",
  "misc4": ""
}

const Auc = () => {
  const [items, setItems] = useState<AucModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openPySim, setOpenPySim] = useState(false);
  const [searchParams] = useSearchParams();
  const [dialogData, setDialogData] = useState<AucModel>(aucTemplate);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [pySimItems, setPySimItems] = useState<AucModel[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(-1);

  const aucSearch = searchParams.get('auc');

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    AucApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data) => {
      const nextItems = data.data as AucModel[];
      setItems(nextItems);
      setCount(nextItems.length < currentRowsPerPage
        ? currentPage * currentRowsPerPage + nextItems.length
        : currentPage * currentRowsPerPage + nextItems.length + 1);
    });
  }, []);

  const runSearch = React.useCallback((term: string) => {
    const normalized = term.trim();

    if (normalized === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    Promise.allSettled([
      AucApi.findByImsi(normalized),
      AucApi.findByIccid(normalized)
    ]).then((results) => {
      const nextItems = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map((result) => result.value.data as AucModel)
        .filter((item, index, array) => array.findIndex((candidate) => candidate.auc_id === item.auc_id) === index);
      setItems(nextItems);
      setCount(nextItems.length);
      setPage(0);
    });
  }, [loadPage, page, rowsPerPage]);

  React.useEffect(() => {
    if (aucSearch) {
      AucApi.get(Number(aucSearch)).then((data => {
        setItems([data.data])
        setCount(1);
      }));
      return;
    }

    if (search.trim() === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    runSearch(search);
  }, [aucSearch, loadPage, page, rowsPerPage, runSearch, search]);

  const refresh = () => {
    if (aucSearch) {
      AucApi.get(Number(aucSearch)).then((data => {
        setItems([data.data])
      }));
    } else {
      if (search.trim() === '') {
        loadPage(page, rowsPerPage);
      } else {
        runSearch(search);
      }
    }
  }

  const handleDelete = (id: number) => {
    AucApi.delete(id).then((data) => {
      console.log(id, data);
      refresh();
    }).catch((e)=> {
      console.log(e);
      setError(e);
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
    console.log('Closing add');
    setDialogData(aucTemplate);
    setOpenAdd(false);
    refresh();
  }
  const openEdit = (row: AucModel) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  const handleError = (err: unknown) => {
    setError(String(err));
  }

  const handlePySimClose = () => {
    setOpenPySim(false);
  }
  const handlePySimOpen = () => {
    setOpenPySim(true);
  }

  const checkboxCallback = (i: React.MouseEvent<HTMLInputElement>) => {
    const id = Number(i.currentTarget.id);
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    setPySimItems(items.filter((a) => newSelected.indexOf(a.auc_id!) !== -1))
  };

  const isChecked = (id: number) => selected.indexOf(id) !== -1; 
    
  return (
    <div>
      <ContentHeader title={(aucSearch?'AUC':'Authentication Center')} />
      <section className="content">
        <div className="container-fluid">
          {!aucSearch && (
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
          )}
          <div className="card">
            <div className="card-body">
                {selected.length > 0 && (<Toolbar><Button onClick={handlePySimOpen}>PySim</Button></Toolbar>)}
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell/>
                        <TableCell/>
                        <TableCell>{i18n.t('inputFields.header.id')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.imsi')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.iccid')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.simVendor')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.esim')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row) => (
                        <AucItem checked={isChecked(row.auc_id!)} checkboxCallback={checkboxCallback} key={row.auc_id} row={row} single={(aucSearch?true:false)} deleteCallback={handleDelete} openEditCallback={openEdit}/>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {!aucSearch && (
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
                )}
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
        <AucAddModal open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} onError={handleError}/>
        {openPySim && (
        <React.Suspense fallback={<p>Loading</p>}>
          <AucPySimModal open={openPySim} rows={pySimItems} handleClose={handlePySimClose}/>
        </React.Suspense>
        )}
        <ErrorDialog error={error} />
      </section>
    </div>
  );
};

export default Auc;
