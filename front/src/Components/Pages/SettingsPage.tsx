import WebhookList from '../Organisms/WebhookList/WebhookList';
import './SettingsPage.scss';

export default function SettingsPage() {
  return (
    <div className="SettingsPage Page Page-padding">
      <div className="common-title">Paramètres</div>
      <div className="common-title-section l-top m-bottom">Webhooks</div>
      <WebhookList />
    </div>
  );
}
