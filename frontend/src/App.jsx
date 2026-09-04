import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Payments } from './pages/Payments';
import { PaymentDetails } from './pages/PaymentDetails';
import { AuditTimelinePage } from './pages/AuditTimelinePage';
import { HumanReview } from './pages/HumanReview';
import { CreatePayment } from './pages/CreatePayment';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:paymentId" element={<PaymentDetails />} />
          <Route path="payments/:paymentId/audit" element={<AuditTimelinePage />} />
          <Route path="human-review" element={<HumanReview />} />
          <Route path="new-payment" element={<CreatePayment />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
