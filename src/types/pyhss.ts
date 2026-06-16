export type FormValue = string | number | boolean | null;

export type FormChangeHandler = (name: string, value: any) => void;

export type ErrorChangeHandler = (hasError: boolean) => void;

export interface ListQueryParams {
  page?: number;
  pageSize?: number;
}

export interface Apn {
  apn_id?: number;
  apn: string;
  ip_version: number;
  pgw_address: string | null;
  sgw_address: string | null;
  charging_characteristics: string;
  apn_ambr_dl: number;
  apn_ambr_ul: number;
  qci: number;
  arp_priority: number;
  arp_preemption_capability: boolean;
  arp_preemption_vulnerability: boolean;
  charging_rule_list: string | null;
  nbiot: boolean;
  nidd_scef_id?: string;
  nidd_scef_realm?: string;
  nidd_mechanism?: string;
  nidd_rds?: boolean;
  nidd_preferred_data_mode?: string;
  last_modified?: string;
}

export interface Auc {
  auc_id?: number;
  ki: string;
  opc: string;
  amf: string;
  sqn: number;
  iccid: string;
  imsi: string;
  batch_name: string;
  sim_vendor: string;
  esim: boolean;
  lpa: string;
  pin1: string;
  pin2: string;
  puk1: string;
  puk2: string;
  kid: string;
  psk: string;
  des: string;
  adm1: string;
  misc1: string;
  misc2: string;
  misc3: string;
  misc4: string;
  last_modified?: string;
}

export interface ChargingRule {
  charging_rule_id?: number;
  rule_name: string;
  qci: number;
  arp_priority: number;
  arp_preemption_capability: boolean;
  arp_preemption_vulnerability: boolean;
  mbr_dl: number;
  mbr_ul: number;
  gbr_dl: number;
  gbr_ul: number;
  tft_group_id: number;
  precedence: number;
  rating_group: number;
  last_modified?: string;
}

export interface Eir {
  eir_id?: number;
  imei?: string;
  imsi?: string;
  regex_mode?: string;
  match_response_code?: string;
  last_modified?: string;
}

export interface ImsSubscriber {
  ims_subscriber_id?: number;
  msisdn: string;
  msisdn_list: string;
  imsi: string;
  ifc_path: string;
  sh_profile: string;
  pcscf?: string;
  pcscf_realm?: string;
  pcscf_peer?: string;
  scscf?: string;
  scscf_realm?: string;
  scscf_peer?: string;
  last_modified?: string;
}

export interface RoamingNetwork {
  roaming_network_id?: number | null;
  name: string;
  preference: number;
  mcc: string;
  mnc: string;
}

export interface RoamingRule {
  roaming_rule_id?: number | null;
  roaming_network_id: number | null;
  allow: boolean;
  enabled: boolean;
}

export interface Subscriber {
  subscriber_id?: number;
  imsi: string;
  enabled: boolean;
  roaming_enabled?: boolean;
  roaming_rule_list?: string | null;
  auc_id: number | null;
  default_apn: number | null;
  apn_list: string;
  msisdn: string;
  ue_ambr_dl: number;
  ue_ambr_ul: number;
  nam: number;
  subscribed_rau_tau_timer: number;
  serving_mme?: string;
  serving_mme_realm?: string;
  serving_mme_peer?: string;
  serving_mme_timestamp?: string;
}

export interface Tft {
  tft_id?: number;
  tft_group_id: number;
  tft_string: string;
  direction: number;
  last_modified?: string;
}

export interface DiameterPeer {
  LastDisconnectTimestamp: string;
  [key: string]: unknown;
}
