import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CryptoJS from 'crypto-js';
import i18n from '@app/utils/i18n';

import {SaveButtons} from '@components';
import RoamingRuleAddItem from './add';

import {RoamingRuleApi} from '../../services/pyhss';
import {FormValue, RoamingRule} from '@app/types/pyhss';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const RoamingRuleAddModal = (props: {
  open: boolean,
  handleClose: () => void,
  data: RoamingRule,
  edit: boolean,
  onError: (error: unknown) => void
}) => {
  const { open, handleClose, data, edit, onError = () => {} } = props;
  const [state, setState] = React.useState<RoamingRule>(data);
  const [error, setError] = React.useState(true);

  React.useEffect(() => {
      setState(data);
  }, [data])
 
  const handleChange = (name: string, value: FormValue) => {
  setState((prevState: RoamingRule) => ({
    ...prevState,
    [name]: value,
  	}));
  };


  const handleSave = () => {
    if (edit) {
      RoamingRuleApi.update(data.roaming_rule_id!, state).then((data) => {
        handleLocalClose();
      }).catch(err => {
      })

    }else{
      RoamingRuleApi.create(state).then((data) => {
        handleLocalClose();
      }).catch(err => {
        console.log(err);
        onError(err);
      })
    }
  }

  const handleLocalClose = () => {
    handleClose();
  }

  const handleError = (e: boolean) => {
    setError(e);
  }
  
  return (
    <React.Fragment>
      <Modal
       open={open}
       onClose={handleLocalClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>{(edit?i18n.t('general.edit'):i18n.t('general.add'))}</h3>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <RoamingRuleAddItem onChange={handleChange} state={state} edit={edit} onError={handleError}/>
          </Box>
          <SaveButtons onClickClose={handleLocalClose} onClickSave={handleSave} disabled={error}/>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default RoamingRuleAddModal;
