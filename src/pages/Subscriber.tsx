/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {ContentHeader, SubscriberItem, SubscriberAddModal} from '@components';
import {SubscriberApi} from "../services/pyhss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import i18n from '@app/utils/i18n';
import {Subscriber as SubscriberModel} from '@app/types/pyhss';

const subscriberTemplate = {
  "imsi": "",
  "enabled": true,
  "auc_id": 0,
  "default_apn": 0,
  "apn_list": "",
  "msisdn": "",
  "ue_ambr_dl": 0,
  "ue_ambr_ul": 0,
  "nam": 0,
  "subscribed_rau_tau_timer": 600,
  "serving_mme": "",
  "serving_mme_realm": "",
  "serving_mme_peer": ""
}

const Subscriber = () => {
  const [dialogData, setDialogData] = React.useState<SubscriberModel>(subscriberTemplate);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [subscribers, setSubscribers] = React.useState<SubscriberModel[]>([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = React.useState(-1);

  const loadPage = React.useCallback((currentPage: number, currentRowsPerPage: number) => {
    SubscriberApi.getAll({page: currentPage, pageSize: currentRowsPerPage}).then((data) => {
      const items = data.data as SubscriberModel[];
      setSubscribers(items);
      setCount(items.length < currentRowsPerPage
        ? currentPage * currentRowsPerPage + items.length
        : currentPage * currentRowsPerPage + items.length + 1);
    });
  }, []);

  const runSearch = React.useCallback((term: string) => {
    const normalized = term.trim();

    if (normalized === '') {
      loadPage(page, rowsPerPage);
      return;
    }

    Promise.allSettled([
      SubscriberApi.findByImsi(normalized),
      SubscriberApi.findByMsisdn(normalized)
    ]).then((results) => {
      const items = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map((result) => result.value.data as SubscriberModel)
        .filter((item, index, array) => array.findIndex((candidate) => candidate.subscriber_id === item.subscriber_id) === index);
      setSubscribers(items);
      setCount(items.length);
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
    SubscriberApi.delete(id).then((data) => {
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
    setDialogData(subscriberTemplate);
    refresh();
  }
  const openEdit = (row: SubscriberModel) => {
    setEditMode(true);
    setDialogData(row);
    setOpenAdd(true);
  }

  return (
    <div>
      <ContentHeader title="Subscribers" />
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
                        <TableCell>{i18n.t('inputFields.header.imsi')}</TableCell>
                        <TableCell/>
                        <TableCell>{i18n.t('inputFields.header.auc')}</TableCell>
                        <TableCell>{i18n.t('generic.enabled')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.roaming')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.msisdn')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.apnDefault')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.ambr_dl')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.ambr_ul')}</TableCell>
                        <TableCell>{i18n.t('inputFields.header.tuaTimer')}</TableCell>
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscribers.map((row) => (
                        <SubscriberItem key={row.subscriber_id} row={row} deleteCallback={handleDelete} openEditCallback={openEdit}/>
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
        <SubscriberAddModal open={openAdd} handleClose={handleAddClose} data={dialogData} edit={editMode} />
      </section>
    </div>
  );
};

export default Subscriber;
