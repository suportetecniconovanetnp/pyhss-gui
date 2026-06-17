import CircularProgress from '@mui/material/CircularProgress';
import {ContentHeader} from '@components';

type LoadingPageProps = {
  message?: string;
  title: string;
};

const LoadingPage = ({
  message = 'Loading records...',
  title
}: LoadingPageProps) => (
  <div>
    <ContentHeader title={title} />
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div
            className="card-body"
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              minHeight: '16rem'
            }}
          >
            <CircularProgress />
            <p style={{margin: 0}}>{message}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default LoadingPage;
