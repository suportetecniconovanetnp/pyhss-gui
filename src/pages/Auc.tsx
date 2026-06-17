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
import LoadingPage from '@app/components/LoadingPage';
import useTableSearchPagination from '@app/hooks/useTableSearchPagination';
import fetchAllPages from '@app/utils/fetchAllPages';
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
  const [isLoading, setIsLoading] = useState(true);

  const aucSearch = searchParams.get('auc');
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
    if (aucSearch) {
      AucApi.get(Number(aucSearch)).then((data) => {
        setItems([data.data]);
      }).finally(() => setIsLoading(false));
      return;
    }

    fetchAllPages<AucModel>((params) => AucApi.getAll(params))
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, [aucSearch]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = () => {
    loadData();
  };

  const handleDelete = (id: number) => {
    AucApi.delete(id).then(() => {
      refresh();
    }).catch((e)=> {
      setError(String(e));
    })
  }

  const handleAdd = () => {
    setEditMode(false);
    setOpenAdd(true);
  }
  const handleAddClose = () => {
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

  const displayedItems = aucSearch ? items : paginatedItems;

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
    setPySimItems(displayedItems.filter((a) => newSelected.indexOf(a.auc_id!) !== -1))
  };

  const isChecked = (id: number) => selected.indexOf(id) !== -1;

  if (isLoading) {
    return <LoadingPage title={(aucSearch?'AUC':'Authentication Center')} />;
  }
    
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
                onChange={handleSearchChange}
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
                      {displayedItems.map((row) => (
                        <AucItem checked={isChecked(row.auc_id!)} checkboxCallback={checkboxCallback} key={row.auc_id} row={row} single={(aucSearch?true:false)} deleteCallback={handleDelete} openEditCallback={openEdit}/>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {!aucSearch && (
                <TablePagination
                  component="div"
                  count={filteredItems.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
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
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
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
