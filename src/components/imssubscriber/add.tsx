import React from 'react';

import {InputField} from '@components';
import Grid from '@mui/material/Grid';

import i18n from '@app/utils/i18n';
import {ErrorChangeHandler, FormChangeHandler, ImsSubscriber} from '@app/types/pyhss';

const ImsSubscriberAddItem = (props: {
  onChange: FormChangeHandler,
  state: ImsSubscriber,
  wizard?: boolean,
  onError?: ErrorChangeHandler
}) => {

  const {
    onChange,
    state,
    wizard=false,
    onError=()=>{},
  } = props;

  const [errors, setErrors ] = React.useState({
    'imsi':'',
    'msisdn':'',
    'msisdn_list':'',
    'ifc_path':'',
    'sh_profile':''
  })

  React.useEffect(() => {
    const nextErrors = {
      imsi: validateField('imsi', state.imsi),
      msisdn: validateField('msisdn', state.msisdn),
      msisdn_list: validateField('msisdn_list', state.msisdn_list),
      ifc_path: validateField('ifc_path', state.ifc_path),
      sh_profile: validateField('sh_profile', state.sh_profile)
    };

    setErrors(nextErrors);
    onError(Object.values(nextErrors).some((value) => value !== ''));
  }, [state, onError]);

  const validateField = (field: string, value: string) => {
    let error = '';

    if (field==='imsi' && value === '')
      error = i18n.t('validator.required');
    else if (field==='imsi' && !/^\d*$/.test(value))
      error = i18n.t('validator.onlyNumbers');
    else if (field==='imsi' && value.length < 15)
      error = i18n.t('validator.toShort');

    if (field==='msisdn' && value === '')
      error = i18n.t('validator.required');
    else if (field==='msisdn' && !/^\d*$/.test(value))
      error = i18n.t('validator.onlyNumbers');

    if (field==='msisdn_list' && value === '')
      error = i18n.t('validator.required');
    else if (field==='msisdn_list' && !/^[0-9]*(,[0-9]*)*$/.test(value))
      error = i18n.t('validator.onlyCSV');

    if (field==='ifc_path' && value === '')
      error = i18n.t('validator.required');

    if (field==='sh_profile' && value === '')
      error = i18n.t('validator.required');

    return error;
  };

  const onChangeLocal = (name: string, value: string) => {
    onChange(name, value);
  }

  return (
    <React.Fragment>
      <Grid container rowSpacing={1} spacing={1}>
        <Grid item xs={4}>
          <InputField
            value={state.imsi}
            error={errors.imsi}
            onChange={onChangeLocal}
            id="imsi"
            label={i18n.t('inputFields.header.imsi')}
            disabled={wizard}
          >{i18n.t('inputFields.desc.imsi')}</InputField>
        </Grid>
        <Grid item xs={4}>
          <InputField
            value={state.msisdn}
            error={errors.msisdn}
            onChange={onChangeLocal}
            id="msisdn"
            label={i18n.t('inputFields.header.msisdn')}
            disabled={wizard}
          >{i18n.t('inputFields.desc.msisdn')}</InputField>
        </Grid>
        <Grid item xs={4}>
          <InputField
            value={state.msisdn_list}
            error={errors.msisdn_list}
            onChange={onChangeLocal}
            id="msisdn_list"
            label={i18n.t('inputFields.header.msisdn_list')}
            required
          >{i18n.t('inputFields.desc.msisdn_list')}</InputField>
        </Grid>
        <Grid item xs={4}>
          <InputField
            value={state.ifc_path}
            error={errors.ifc_path}
            onChange={onChangeLocal}
            id="ifc_path"
            label={i18n.t('inputFields.header.ifc_path')}
            required
          >{i18n.t('inputFields.desc.ifc_path')}</InputField>
        </Grid>
        <Grid item xs={4}>
          <InputField
            value={state.sh_profile}
            error={errors.sh_profile}
            onChange={onChangeLocal}
            id="sh_profile"
            label={i18n.t('inputFields.header.sh_profile')}
            required
          >{i18n.t('inputFields.desc.sh_profile')}</InputField>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ImsSubscriberAddItem;
