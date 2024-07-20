import { Helmet } from 'react-helmet-async';

import { UploadView } from 'src/sections/upload';

// ----------------------------------------------------------------------

export default function UploadPage() {
  return (
    <>
      <Helmet>
        <title> Login | GateGaurd </title>
      </Helmet>

      <UploadView />
    </>
  );
}
