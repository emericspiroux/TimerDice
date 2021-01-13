import { FormEvent, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import './WebhookForm.scss';
import Loader from '../../Atoms/Loader';
import { TimerDiceFormError } from '../../../Types/errors.types';

export default function WebhookForm({
  onSubmit,
  isLoading,
  className,
  error,
}: {
  onSubmit: Function;
  isLoading: Boolean;
  className: string | undefined;
  error: TimerDiceFormError | undefined;
}) {
  const [uri, setUri] = useState('');

  function onSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const webhook = { uri };
    onSubmit(webhook, e);
  }

  return (
    <div className={`WebhookForm ${className || ''}`}>
      <form onSubmit={onSubmitForm}>
        <TextareaAutosize
          onChange={(event) => setUri(event.currentTarget.value)}
          placeholder="https://..."
          className="WebhookForm_input"
          rows={1}
        />
        &nbsp;
        {isLoading ? (
          <div className="WebhookForm__loader">
            <Loader size="24px" />
          </div>
        ) : (
          <button type="submit" className="button WebhookForm__button button-blue" disabled={!uri}>
            Ajouter
          </button>
        )}
      </form>
      {error && (
        <div className="WebhookForm_error l-top">
          {error.details.map((e) => (
            <div>- {e.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}
