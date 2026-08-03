// BGCA Sandbox — nested routes under /bgca.

import { Navigate, Route, Routes } from 'react-router-dom';
import BgcaLayout from './BgcaLayout';
import BgcaHome from './BgcaHome';
import PulseKiosk from './PulseKiosk';
import SampleSurvey from './SampleSurvey';
import UnitDirectorConsole from './UnitDirectorConsole';
import ExecutiveDashboard from './ExecutiveDashboard';

export default function BgcaRouter() {
  return (
    <BgcaLayout>
      <Routes>
        <Route index element={<BgcaHome />} />
        <Route path="pulse" element={<PulseKiosk />} />
        <Route path="survey" element={<SampleSurvey />} />
        <Route path="director" element={<UnitDirectorConsole />} />
        <Route path="dashboard" element={<ExecutiveDashboard />} />
        <Route path="*" element={<Navigate to="/bgca" replace />} />
      </Routes>
    </BgcaLayout>
  );
}
