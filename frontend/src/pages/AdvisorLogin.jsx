import AdvisorLoginGate from '../components/AdvisorLoginGate';

export default function AdvisorLogin({ onLoginSuccess }) {
  return <AdvisorLoginGate onLoginSuccess={onLoginSuccess} />;
}
