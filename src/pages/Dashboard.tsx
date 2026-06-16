import {SmallBox} from '@app/components';
import React from 'react';
import {ContentHeader} from '@components';
import {NavLink} from 'react-router-dom';
import i18n from '@app/utils/i18n';
import {OamApi} from "../services/pyhss";
import {DiameterPeer} from '@app/types/pyhss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowCircleRight,
  faChartBar,
  faChartPie,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [subs, setSubs] = React.useState("0");
  const [subsIms, setSubsIms] = React.useState("0");
  const [subsPcrf, setSubsPcrf] = React.useState("0");
  const [diameter, setDiameter] = React.useState("0");

  const fetchData = () => {
    const current = new Date();
    

    OamApi.servingSubsIms().then(data => {
      setSubsIms(String(Object.values(data.data).length)); 
    });

    OamApi.servingSubsPcrf().then(data => {
      setSubsPcrf(String(Object.values(data.data).length)); 
      setSubs(String(Object.values(data.data).length));
    });

    OamApi.diameterPeers().then(data => {
      setDiameter(String(Object.values(data.data).filter((item) =>
        (item as DiameterPeer).LastDisconnectTimestamp === ""
      ).length));
    });
  };

  React.useEffect(() => {
    // Fetch once on mount
    fetchData();

    // Set interval to fetch 
    const interval = setInterval(fetchData, 10 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <ContentHeader title="Dashboard" />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Subscriber Box */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{subs}</h3>
                  <p>{i18n.t('dashboard.subscriberHeader')}</p>
                </div>
                <div className="icon">
                  <FontAwesomeIcon icon={faChartBar} />
                </div>
                <NavLink to="/subscriber" className="small-box-footer">
                  {i18n.t('generic.moreInfo')} <FontAwesomeIcon icon={faArrowCircleRight} />
                </NavLink>
              </div>
            </div>

            {/* IMS Subscriber Box */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{subsIms}</h3>
                  <p>{i18n.t('dashboard.imsSubscriberHeader')}</p>
                </div>
                <div className="icon">
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
                <NavLink to="/imssubscriber" className="small-box-footer">
                  {i18n.t('generic.moreInfo')} <FontAwesomeIcon icon={faArrowCircleRight} />
                </NavLink>
              </div>
            </div>

            {/* PCRF Subscriber Box */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{subsPcrf}</h3>
                  <p>{i18n.t('dashboard.subscribersPCRFHeader')}</p>
                </div>
                <div className="icon">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
              </div>
            </div>

            {/* Diameter Peers Box */}
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{diameter}</h3>
                  <p>{i18n.t('dashboard.diameterPeersHeader')}</p>
                </div>
                <div className="icon">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
