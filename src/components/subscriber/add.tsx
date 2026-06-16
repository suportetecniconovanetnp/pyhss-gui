import React from 'react';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import i18n from '@app/utils/i18n';
import {NetworkBandwidthFormatter, InputField, SelectField} from '@components';
import {AucApi, ApnApi} from '../../services/pyhss';
import {Apn, Auc, ErrorChangeHandler, FormChangeHandler, Subscriber} from '@app/types/pyhss';

const SubscriberAddItem = (props: {
onChange: FormChangeHandler, 
state: Subscriber,
onError?: ErrorChangeHandler,
wizard?: boolean
edit?: boolean
}) => {
  const { onChange, state, onError=()=>{}, wizard=false, edit=false } = props;
  const [auc, setAuc] = React.useState<Auc[]>([]);
  const [apn, setApn] = React.useState<Apn[]>([]);
  const [aucLoading, setAucLoading] = React.useState(true);
  const [apnLoading, setApnLoading] = React.useState(true);
  const [errors, setErrors ] = React.useState({
    'imsi':'',
    'msisdn':'',
    'default_apn':'',
    'apn_list': '',
    'ue_ambr_ul': '',
    'ue_ambr_dl': '',
    'roaming_rule_list': ''
  })

  React.useEffect(() => {
    onValidate('imsi', state.imsi)
    onValidate('msisdn', state.msisdn)
    onValidate('default_apn', state.default_apn)
    onValidate('apn_list', state.apn_list)
    onValidate('ue_ambr_ul', state.ue_ambr_ul)
    onValidate('ue_ambr_dl', state.ue_ambr_dl)
    onValidate('roaming_rule_list', state.roaming_rule_list)
    AucApi.getAll().then((data => {
      setAuc(data.data);
      setAucLoading(false);
    }));
    ApnApi.getAll().then((data => {
      setApn(data.data);
      setApnLoading(false);
    }));
  }, [state]);

  const setError = (name: string,value: string) => {
    setErrors(prevState => ({
        ...prevState,
        [name]: value
    }));
  }

  const onValidate = (field: string, value: any) => {
    const stringValue = value == null ? '' : String(value);
    let error = ""
    if (field==='imsi' && stringValue === '')
      error = i18n.t('validator.required'); 
    else if (field==='imsi' && !/^\d*$/.test(stringValue))
      error = i18n.t('validator.onlyNumbers'); 
    else if (field==='imsi' && stringValue.length < 15)
      error = i18n.t('validator.toShort'); 

    if (field==='msisdn' && stringValue === '')
      error = i18n.t('validator.required'); 
    else if (field==='msisdn' && !/^\d*$/.test(stringValue))
      error = i18n.t('validator.onlyNumbers'); 
    
    if (field==='default_apn' && stringValue === '0')
      error = i18n.t('validator.required'); 
    else if (field==='default_apn' && !/^\d*$/.test(stringValue))
      error = i18n.t('validator.onlyNumbers'); 

    if (field==='apn_list' && stringValue === '')
      error = i18n.t('validator.required'); 
    else if (field==='apn_list' && !/^[1-8]*(,[1-8]*)*$/.test(stringValue))
      error = i18n.t('validator.onlyCSV'); 

    if (field==='ue_ambr_ul' && stringValue === '0')
      error = i18n.t('validator.required'); 
    else if (field==='ue_ambr_ul' && !/^\d*$/.test(stringValue))
      error = i18n.t('validator.onlyNumbers'); 

    if (field==='ue_ambr_dl' && stringValue === '0')
      error = i18n.t('validator.required'); 
    else if (field==='ue_ambr_dl' && !/^\d*$/.test(stringValue))
      error = i18n.t('validator.onlyNumbers'); 

    else if (field==='roaming_rule_list' && !/^[1-8]*(,[1-8]*)*$/.test(stringValue) && value !== null)
      error = i18n.t('validator.onlyCSV'); 

    setError(field, error);

    if (error!=='' || Object.values(errors).filter((a)=>a!=='').length > 0)
      onError(true);
    else
      onError(false);
  }

  const onChangeLocal = (name: string, value: any) => {
    onValidate(name, value);
    onChange(name, value);
  }

  const onChangeAuc = (aucItem?: Auc) => {
    if (!aucItem || aucItem.auc_id === undefined) {
      return;
    }

    onChange('imsi', aucItem.imsi);
    onChange('auc_id', aucItem.auc_id);
    onValidate('imsi', aucItem.imsi);
  }

  const onChangeDefaultApn = (apnItem?: Apn) => {
    if (!apnItem || apnItem.apn_id === undefined) {
      return;
    }

    onChangeLocal('default_apn', String(apnItem.apn_id))
    if (state.apn_list === '')
      onChange('apn_list', '' + apnItem.apn_id);
    else
      onChange('apn_list', state.apn_list + ',' + apnItem.apn_id)
  }

  const onChangeApn = (apns: string[]) => {
    onChangeLocal('apn_list', apn
      .filter((a: Apn) => apns.includes(a.apn))
      .map((a: Apn) => a.apn_id)
      .filter((id): id is number => id !== undefined)
      .join(','));
  }

  return (
    <React.Fragment>
          <Grid container rowSpacing={1} spacing={1}>
            <Grid item xs={4}>
              <Autocomplete
                loading={aucLoading}
                onChange={(_event, value) => {
                  if (value) {
                    onChangeAuc(auc.find((a: Auc) => a.imsi === value));
                  }
                }}
                value={(auc.find((a: Auc) => a.auc_id === state.auc_id) || {'imsi':''}).imsi}
                disabled={wizard || edit}
                options={auc.map((option: Auc) => option.imsi)}
                renderInput={(params) => <TextField {...params} label={`IMSI ${errors.imsi}`} error={errors.imsi!==''} />}
              />
            </Grid>
            <Grid item xs={3}>
              <InputField
                value={state.msisdn}
                error={errors.msisdn}
                onChange={onChangeLocal}
                id="msisdn"
                label={i18n.t('inputFields.header.msisdn')}
              >{i18n.t('inputFields.desc.msisdn')}</InputField>
            </Grid>
            <Grid item xs={3}>
              <SelectField
                value={state.enabled}
                onChange={onChange}
                id="enabled"
                label={i18n.t('generic.enabled')}
                helper={i18n.t('inputFields.desc.subscriberEnabled')}
              >
                <MenuItem value="true">{i18n.t('generic.yes')}</MenuItem>
                <MenuItem value="false">{i18n.t('generic.no')}</MenuItem>
              </SelectField>
            </Grid>
            <Grid item xs={3}>
              <SelectField
                value={state.roaming_enabled ?? false}
                onChange={onChange}
                id="roaming_enabled"
                label={i18n.t('inputFields.header.roaming')}
                helper={i18n.t('inputFields.desc.subscriberRoamingEnabled')}
              >
                <MenuItem value="true">{i18n.t('generic.yes')}</MenuItem>
                <MenuItem value="false">{i18n.t('generic.no')}</MenuItem>
              </SelectField>
            </Grid>
            <Grid item xs={3}>
              <InputField
                value={state.roaming_rule_list ?? ''}
                error={errors.roaming_rule_list}
                onChange={onChangeLocal}
                id="roaming_rule_list"
                label="Roaming rules"
              >Roaming rules</InputField>
            </Grid>
            <Grid item xs={3}>
              <SelectField
                value={state.nam}
                onChange={onChange}
                id="nam"
                label={i18n.t('inputFields.header.nam')}
                helper={i18n.t('inputFields.desc.nam')}
              >
                <MenuItem value="0">{i18n.t('inputFields.options.nam.0')}</MenuItem>
                <MenuItem value="2">{i18n.t('inputFields.options.nam.2')}</MenuItem>
              </SelectField>
            </Grid>
            <Grid item xs={12}><h3>{i18n.t('inputFields.header.apn')}</h3></Grid>
            <Grid item xs={4}>
              <Autocomplete
                loading={apnLoading}
                onChange={(_event, value) => {
                  if (value) {
                    onChangeDefaultApn(apn.find((a: Apn) => a.apn === value));
                  }
                }}
                value={(apn.find((a: Apn) => a.apn_id === state.default_apn) || {'apn':''}).apn}
                options={apn.map((option: Apn) => option.apn)}
                renderInput={(params) => <TextField {...params} label={`${i18n.t('inputFields.header.defaultAPN')} ${errors.default_apn}`} error={errors.default_apn!==''} />}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                multiple
                loading={apnLoading}
                onChange={(_event, value) => {
                  if (value.length > 0) {
                    onChangeApn(value);
                  }
                }}
                value={apn.filter((a: Apn) => state.apn_list.split(",").includes(String(a.apn_id))).map((a: Apn)=> a.apn)}
                options={apn.map((option: Apn) => option.apn)}
                renderInput={(params) => <TextField {...params} label={`APNs ${errors.apn_list}`} error={errors.apn_list!==''} />}
              />
            </Grid>
            <Grid item xs={12}><h3>QoS</h3></Grid>
            <Grid item xs={6}>
              <InputField
                value={state.ue_ambr_ul}
                error={errors.ue_ambr_ul}
                onChange={onChangeLocal}
                id="ue_ambr_ul"
                label="AMBR ul"
              >{i18n.t('inputFields.desc.ambr_ul')} <NetworkBandwidthFormatter data={state.ue_ambr_ul} /></InputField>
            </Grid>
            <Grid item xs={6}>
              <InputField
                error={errors.ue_ambr_dl}
                value={state.ue_ambr_dl}
                onChange={onChangeLocal}
                id="ue_ambr_dl"
                label="AMBR dl"
              >{i18n.t('inputFields.desc.ambr_dl')} <NetworkBandwidthFormatter data={state.ue_ambr_dl} /></InputField>
            </Grid>
            <Grid item xs={12}><h3>Timers</h3></Grid>
            <Grid item xs={4}>
              <InputField
                value={state.subscribed_rau_tau_timer}
                onChange={onChange}
                id="subscribed_rau_tau_timer"
                label={i18n.t('inputFields.header.rauTauTimer')}
              >{i18n.t('inputFields.desc.rauTauTimer')}</InputField>
            </Grid>
          </Grid>
    </React.Fragment>
  );
}

export default SubscriberAddItem;
